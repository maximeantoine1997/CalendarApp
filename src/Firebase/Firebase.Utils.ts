import { Reservation } from "./../components/reservation_form";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { Nullable } from "../Interfaces/Common";
import moment, { Moment } from "moment";

// #region Realtime Database
export const getFirebaseElementAsync = async (url: string): Promise<string> => {
   let res: string = "";
   await firebase
      .database()
      .ref(url)
      .once("value")
      .then(snapshot => {
         res = snapshot.val();
      });

   return res;
};

export const getFirebaseElementsAsync = async (url: string): Promise<Array<any>> => {
   const res: Array<any> = [];
   await firebase
      .database()
      .ref(url)
      .once("value")
      .then(snapshot => {
         const obj: Object = snapshot.val();

         Object.values(obj).forEach(value => {
            if (value) res.push(value);
         });
      });

   return res;
};

export const addFirebaseElementAsync = async (url: string, data: unknown): Promise<void> => {
   await firebase.database().ref(url).push();
};

export const updateFirebaseElementAsync = async (url: string): Promise<void> => {};

export const deleteFirebaseElementAsync = async (url: string): Promise<void> => {};

export const findFirebaseElementAsync = async <T>(url: string, key: string, value: string): Promise<Nullable<T>> => {
   let res: Nullable<T> = null;
   await firebase
      .database()
      .ref(url)
      .orderByChild(key)
      .equalTo(value)
      .once("value")
      .then(snapshot => {
         const result = snapshot.val();
         res = result;
      });
   return res;
};

export const getFirebaseKey = (value: any): Nullable<string> => {
   const keys = Object.keys(value);
   if (keys.length === 1) return keys[0];
   return null;
};

export const createFirebaseKeyAsync = async (url: string): Promise<Nullable<string>> => {
   const id = await firebase.database().ref(url).push().key;
   return id;
};

export const isDuplicateFirebaseAsync = async (url: string, value: string): Promise<boolean> => {
   let isDuplicate = false;

   await firebase
      .database()
      .ref(url)
      .once("value")
      .then(snapshot => {
         if (snapshot) {
            const items = Object.values(snapshot.val()) as Array<string>;
            isDuplicate = items.some(item => {
               return item === value;
            });
         }
      })
      .catch(error => console.error(error));

   return isDuplicate;
};

// #region Reservation
export const addReservationAsync = async (reservation: Reservation): Promise<void> => {
   const dateKey = reservation.startDate.format("YYYY-MM-DD");

   // This will store the reservation JSON
   const reservationId = await createFirebaseKeyAsync("Reservations");

   // This will reference the JSON with its unique reservation ID (to avoid duplicate data)
   const calendarId = await createFirebaseKeyAsync(`Calendar/${dateKey}`);

   if (calendarId && reservationId) {
      // Put reference of reservationId within JSON
      reservation.id = reservationId;

      const updates: Record<string, string | Array<string>> = {};
      // Stores the reservation JSON
      updates[`Reservations/${reservationId}`] = JSON.stringify(reservation);

      // Put reference at start date
      updates[`Calendar/${dateKey}/${calendarId}`] = reservationId;
      if (reservation.endDate) {
         // Put reference at end date
         const endDateKey = reservation.endDate.format("YYYY-MM-DD");
         updates[`Calendar/${endDateKey}/${calendarId}`] = reservationId;
      } else {
         // Put reference at no end date
         updates[`Calendar/NoEndDate/${calendarId}`] = reservationId;
      }

      //#region Reservation form data

      reservation.accessoires.forEach(async accessoire => {
         if (!(await isDuplicateFirebaseAsync("Reservation/Accessoires", accessoire))) {
            const accessoiresId = await createFirebaseKeyAsync("Reservation/Accessoires");
            updates[`Reservation/Accessoires/${accessoiresId}`] = accessoire;
         }
      });

      if (!(await isDuplicateFirebaseAsync("Reservation/Societe", reservation.societe))) {
         const societeId = await createFirebaseKeyAsync("Reservation/Societe");
         updates[`Reservation/Societe/${societeId}`] = reservation.societe;
      }
      if (!(await isDuplicateFirebaseAsync("Reservation/Address", reservation.address))) {
         const addressId = await createFirebaseKeyAsync("Reservation/Address");
         updates[`Reservation/Address/${addressId}`] = reservation.address;
      }
      if (!(await isDuplicateFirebaseAsync("Reservation/Prenom", reservation.prenom))) {
         const prenomId = await createFirebaseKeyAsync("Reservation/Prenom");
         updates[`Reservation/Prenom/${prenomId}`] = reservation.prenom;
      }
      if (!(await isDuplicateFirebaseAsync("Reservation/Nom", reservation.nom))) {
         const nomId = await createFirebaseKeyAsync("Reservation/Nom");
         updates[`Reservation/Nom/${nomId}`] = reservation.nom;
      }
      if (!(await isDuplicateFirebaseAsync("Reservation/Telephone", reservation.gsm))) {
         const telephoneId = await createFirebaseKeyAsync("Reservation/Telephone");
         updates[`Reservation/Telephone/${telephoneId}`] = reservation.gsm;
      }
      if (!(await isDuplicateFirebaseAsync("Reservation/Email", reservation.email))) {
         const emailId = await createFirebaseKeyAsync("Reservation/Email");
         updates[`Reservation/Email/${emailId}`] = reservation.email;
      }

      if (!(await isDuplicateFirebaseAsync("Reservation/Modele", reservation.modele))) {
         const modeleId = await createFirebaseKeyAsync("Reservation/Modele");
         updates[`Reservation/Modele/${modeleId}`] = reservation.modele;
      }
      // #endregion

      await firebase
         .database()
         .ref()
         .update(updates)
         .catch(error => console.error(error));
   }
};

export const getReservationsAsync = async (date: string): Promise<Array<Reservation>> => {
   let reservations: Array<Reservation> = [];

   console.log("date is: ", date);

   await firebase
      .database()
      .ref(`Calendar/${date}`)
      .once("value")
      .then(snapshot => {
         if (snapshot) {
            const values = snapshot.val();
            if (values) {
               const reservationsIds = Object.values(values) as Array<string>;

               reservationsIds.forEach(async id => {
                  await firebase
                     .database()
                     .ref("Reservations")
                     .child(id)
                     .once("value")
                     .then(snapshot => {
                        const res = snapshot.val();
                        reservations.push(JSON.parse(res));
                     });
               });
            }
         }
      });

   await firebase
      .database()
      .ref("Calendar/NoEndDate")
      .once("value")
      .then(snapshot => {
         if (snapshot) {
            const values = snapshot.val();
            if (values) {
               const reservationsIds = Object.values(values) as Array<string>;

               reservationsIds.forEach(async id => {
                  await firebase
                     .database()
                     .ref("Reservations")
                     .child(id)
                     .once("value")
                     .then(snapshot => {
                        const res = snapshot.val();
                        reservations.push(JSON.parse(res));
                     });
               });
            }
         }
      });

   console.log("reservations: ", reservations);
   console.log("------------------ ");
   return reservations;
};

export const updateReservationAsync = (id: string, newReservation: Reservation): void => {
   const raw = JSON.stringify(newReservation);
   firebase.database().ref("Reservations").child(id).set(raw);
};

export const getWeekReservationsAsync = async (date: Moment): Promise<Array<Array<Reservation>>> => {
   const weekReservations: Array<Array<Reservation>> = [[], [], [], [], [], [], []];

   const cache: Array<Record<string, Reservation>> = [];

   // 1) Get the Calendar reservations
   //    let i = 1;
   //    while (i < 8) {
   //       const currentIndex = i;
   //       const currentDate = date.clone().day(i);
   //       await firebase
   //          .database()
   //          .ref("Calendar/")
   //          .child(currentDate.format("YYYY-MM-DD"))
   //          .once("value")

   //          .then(snapshot => {
   //             if (snapshot) {
   //                const reservations = snapshot.val();

   //                if (reservations) {
   //                   const reservationIds: Array<string> = Object.values(reservations);

   //                   reservationIds.forEach(async id => {
   //                      let reservation = cache.find(record => {
   //                         console.log("record is: ", record);
   //                         return record[id];
   //                      });
   //                      if (!reservation) {
   //                         await firebase
   //                            .database()
   //                            .ref("Reservations")
   //                            .child(id)
   //                            .once("value")
   //                            .then(snapshot => {
   //                               const res = snapshot.val();
   //                               // put res in cache
   //                               const cacheRes: Record<string, Reservation> = {};
   //                               cacheRes[id] = JSON.parse(res);
   //                               cache.push(cacheRes);
   //                               reservation = cacheRes;
   //                            });
   //                      }

   //                      if (reservation) {
   //                         const finalReservation = Object.values(reservation)[0];
   //                         weekReservations[currentIndex - 1].push(finalReservation);
   //                      }
   //                   });
   //                }
   //             }
   //          });
   //       i++;
   //    }

   // 2) Get the NoEndDate reservations
   await firebase
      .database()
      .ref("Calendar/NoEndDate")
      .once("value")
      .then(snapshot => {
         if (snapshot) {
            const values = snapshot.val();
            if (values) {
               // All the ids of the NoEndDates reservations
               const reservationsIds = Object.values(values) as Array<string>;

               reservationsIds.forEach(id => {
                  firebase
                     .database()
                     .ref("Reservations")
                     .child(id)
                     .once("value")
                     .then(snapshot => {
                        const res = snapshot.val();
                        // put res in cache

                        const noEndDate = JSON.parse(res);
                        const start = moment(noEndDate.startDate);

                        let i = 1;
                        const currentDate = date.clone();

                        while (i < 8) {
                           if (currentDate.isSameOrAfter(start)) {
                              weekReservations[i - 1].push(noEndDate);
                           }
                           i++;
                        }
                     });
               });
            }
         }
      });

   // 2) When ids found, put in cache if not in there yet

   // 3)

   return weekReservations;
};

// #endregion
