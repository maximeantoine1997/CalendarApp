import { Reservation } from "./../components/reservation_form";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { Nullable } from "../Interfaces/Common";
import Axios from "axios";

const api = "https://europe-west1-antoinesprl-calendrier.cloudfunctions.net/api";

// #region Realtime Database
export const getFirebaseElementAsync = async (url: string): Promise<string> => {
   let res: string = "";
   firebase
      .database()
      .ref(url)
      .once("value")
      .then(snapshot => {
         res = snapshot.val();
      });

   return Promise.resolve(res);
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

export const createFirebaseKeyAsync = (url: string): Nullable<string> => {
   const id = firebase.database().ref(url).push().key;
   return id;
};

export const isDuplicateFirebaseAsync = (url: string, value: string): Promise<boolean> => {
   const isDuplicate = firebase
      .database()
      .ref(url)
      .once("value")
      .then(snapshot => {
         if (snapshot) {
            const items = Object.values(snapshot.val()) as Array<string>;
            return items.some(item => {
               return item === value;
            });
         }
         return false;
      })
      .catch(error => {
         console.log(error);
         return false;
      });

   return isDuplicate;
};

// #region Reservation
// export const addReservationAsync = async (reservation: Reservation): Promise<void> => {
//    const dateKey = reservation.startDate.format("YYYY-MM-DD");

//    // This will store the reservation JSON
//    const reservationId = createFirebaseKeyAsync("Reservations");

//    // This will reference the JSON with its unique reservation ID (to avoid duplicate data)
//    const calendarId = createFirebaseKeyAsync(`Calendar/${dateKey}`);

//    if (calendarId && reservationId) {
//       // Put reference of reservationId within JSON
//       reservation.id = reservationId;

//       const updates: Record<string, string | Array<string>> = {};
//       // Stores the reservation JSON
//       updates[`Reservations/${reservationId}`] = JSON.stringify(reservation);

//       // Put reference at start date
//       updates[`Calendar/${dateKey}/${calendarId}`] = reservationId;
//       if (reservation.endDate) {
//          // Put reference at end date
//          const endDateKey = reservation.endDate.format("YYYY-MM-DD");
//          updates[`Calendar/${endDateKey}/${calendarId}`] = reservationId;
//       } else {
//          // Put reference at no end date
//          updates[`Calendar/NoEndDate/${calendarId}`] = reservationId;
//       }

//       //#region Reservation form data

//       reservation.accessoires.forEach(async accessoire => {
//          if (!(await isDuplicateFirebaseAsync("Reservation/Accessoires", accessoire))) {
//             const accessoiresId = createFirebaseKeyAsync("Reservation/Accessoires");
//             updates[`Reservation/Accessoires/${accessoiresId}`] = accessoire;
//          }
//       });

//       if (!(await isDuplicateFirebaseAsync("Reservation/Societe", reservation.societe))) {
//          const societeId = createFirebaseKeyAsync("Reservation/Societe");
//          updates[`Reservation/Societe/${societeId}`] = reservation.societe;
//       }
//       if (!(await isDuplicateFirebaseAsync("Reservation/Address", reservation.address))) {
//          const addressId = createFirebaseKeyAsync("Reservation/Address");
//          updates[`Reservation/Address/${addressId}`] = reservation.address;
//       }
//       if (!(await isDuplicateFirebaseAsync("Reservation/Prenom", reservation.prenom))) {
//          const prenomId = createFirebaseKeyAsync("Reservation/Prenom");
//          updates[`Reservation/Prenom/${prenomId}`] = reservation.prenom;
//       }
//       if (!(await isDuplicateFirebaseAsync("Reservation/Nom", reservation.nom))) {
//          const nomId = createFirebaseKeyAsync("Reservation/Nom");
//          updates[`Reservation/Nom/${nomId}`] = reservation.nom;
//       }
//       if (!(await isDuplicateFirebaseAsync("Reservation/Telephone", reservation.gsm))) {
//          const telephoneId = createFirebaseKeyAsync("Reservation/Telephone");
//          updates[`Reservation/Telephone/${telephoneId}`] = reservation.gsm;
//       }
//       if (!(await isDuplicateFirebaseAsync("Reservation/Email", reservation.email))) {
//          const emailId = createFirebaseKeyAsync("Reservation/Email");
//          updates[`Reservation/Email/${emailId}`] = reservation.email;
//       }

//       if (!(await isDuplicateFirebaseAsync("Reservation/Modele", reservation.modele))) {
//          const modeleId = createFirebaseKeyAsync("Reservation/Modele");
//          updates[`Reservation/Modele/${modeleId}`] = reservation.modele;
//       }
//       // #endregion

//       firebase
//          .database()
//          .ref()
//          .update(updates)
//          .catch(error => {
//             throw new Error(error);
//          });
//    }
// };

export const updateReservationAsync = (id: string, newReservation: Reservation): void => {
   const raw = JSON.stringify(newReservation);
   firebase.database().ref("Reservations").child(id).set(raw);
};

// #endregion

// API

export const _addReservationAsync = async (reservation: Reservation): Promise<void> => {
   Axios.post(`${api}/reservation`, { ...reservation }, { method: "POST" })
      .then(response => {
         console.log(response);
      })
      .catch(error => {
         console.log(error);
      });
};
