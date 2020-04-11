import * as functions from "firebase-functions";
import * as moment from "moment";
import * as admin from "firebase-admin";

admin.initializeApp();

export interface Reservation {
   id?: string;
   prenom: string;
   nom: string;
   societe: string;
   modele: string;
   accessoires: Array<string>;
   gsm: string;
   email: string;
   address: string;
   startDate: moment.Moment;
   endDate?: moment.Moment;
   montant: number;
   isBancontact: boolean;
   isReceived: boolean;
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const getWeekReservationsAsync = functions.https.onCall(
   async (data: any, context): Promise<Array<Array<Reservation>>> => {
      const date: string = data.date;

      const weekReservations: Array<Array<Reservation>> = [[], [], [], [], [], [], []];

      const cache: Array<Record<string, Reservation>> = [];

      // 1) Get the Calendar reservations
      let i = 1;
      while (i < 8) {
         const currentIndex = i;

         const currentDate = moment(date).day(i);

         await admin
            .database()
            .ref("Calendar/")
            .child(currentDate.format("YYYY-MM-DD"))
            .once("value")
            .then(snapshot => {
               if (snapshot) {
                  const reservations = snapshot.val();

                  if (reservations) {
                     const reservationIds: Array<string> = Object.values(reservations);

                     reservationIds.forEach(async id => {
                        let reservation = cache.find(record => {
                           return record[id];
                        });
                        if (!reservation) {
                           await admin
                              .database()
                              .ref("Reservations")
                              .child(id)
                              .once("value")
                              .then(snap => {
                                 const res = snap.val();
                                 // put res in cache
                                 const cacheRes: Record<string, Reservation> = {};
                                 cacheRes[id] = JSON.parse(res);
                                 cache.push(cacheRes);
                                 reservation = cacheRes;
                              })
                              .catch(error => {
                                 // Re-throwing the error as an HttpsError so that the client gets the error details.
                                 throw new functions.https.HttpsError("unknown", error.message, error);
                              });
                        }

                        if (reservation) {
                           const finalReservation = Object.values(reservation)[0];
                           weekReservations[currentIndex - 1].push(finalReservation);
                        }
                     });
                  }
               }
            })
            .catch(error => {
               // Re-throwing the error as an HttpsError so that the client gets the error details.
               throw new functions.https.HttpsError("unknown", error.message, error);
            });
         i++;
      }

      await admin
         .database()
         .ref("Calendar/NoEndDate")
         .once("value")
         .then(async snapshot => {
            if (snapshot) {
               const values = snapshot.val();
               if (values) {
                  // All the ids of the NoEndDates reservations
                  const reservationsIds = Object.values(values as string);

                  for (const id of reservationsIds) {
                     await admin
                        .database()
                        .ref("Reservations")
                        .child(id)
                        .once("value")
                        .then(snap => {
                           const res = snap.val();
                           // put res in cache

                           const noEndDate = JSON.parse(res);
                           const start = moment(noEndDate.startDate);

                           let index = 1;

                           while (index < 8) {
                              const currentIndex = index;
                              const currentDate = moment(date).day(currentIndex);
                              if (start.isSameOrBefore(currentDate, "day")) {
                                 weekReservations[index - 1].push(noEndDate);
                              }
                              index++;
                           }
                        });
                  }
               }
            }
         });

      const final = Promise.all(weekReservations);
      return final;
   }
);
