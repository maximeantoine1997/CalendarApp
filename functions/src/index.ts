import * as functions from "firebase-functions";
// import * as moment from "moment";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors());

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
   startDate: string;
   endDate?: string;
   montant: number;
   isBancontact: boolean;
   isReceived: boolean;
}
// const getWeekReservationsAsync = functions.https.onCall(
//    async (data: any, context): Promise<Array<Array<Reservation>>> => {
//       const date: string = data.date;

//       const weekReservations: Array<Array<Reservation>> = [[], [], [], [], [], [], []];

//       const cache: Array<Record<string, Reservation>> = [];

//       let i = 1;
//       while (i < 8) {
//          const currentIndex = i;

//          const currentDate = moment(date).day(i);

//          admin
//             .database()
//             .ref("Calendar/")
//             .child(currentDate.format("YYYY-MM-DD"))
//             .on("value", snapshot => {
//                if (snapshot) {
//                   const reservations = snapshot.val();

//                   if (reservations) {
//                      const reservationIds: Array<string> = Object.values(reservations);

//                      reservationIds.forEach(async id => {
//                         let reservation = cache.find(record => {
//                            return record[id];
//                         });
//                         if (!reservation) {
//                            admin
//                               .database()
//                               .ref("Reservations")
//                               .child(id)
//                               .on("value", snap => {
//                                  if (snap) {
//                                     const res = snap.val();
//                                     // put res in cache
//                                     const cacheRes: Record<string, Reservation> = {};
//                                     cacheRes[id] = JSON.parse(res);
//                                     cache.push(cacheRes);
//                                     reservation = cacheRes;
//                                  }
//                               });
//                         }

//                         if (reservation) {
//                            const finalReservation = Object.values(reservation)[0];
//                            weekReservations[currentIndex - 1].push(finalReservation);
//                         }
//                      });
//                   }
//                }
//             });
//          i++;
//       }

//       const final = Promise.all(weekReservations);
//       return final;
//    }
// );

app.get("/calendar", (req, res) => {
   console.log("req is: ", req);
   const date: string = req.query.date as string;
   console.log("the date is: ", date);
   admin
      .firestore()
      .collection("Calendar")
      .doc(date)
      .get()
      .then(snap => {
         let ids: Array<string> = [];
         console.log("snap data is: ", snap.data());
         const data = snap.data();
         if (data) {
            ids = Object.values<string>(data);
         }
         return res.json(ids);
      })
      .catch(error => {
         console.log(error);
         return res.json({ error: "an error occured" });
      });
});

app.get("/todayreservations", (req, res) => {
   console.log("req is: ", req);
   const date: string = req.query.date as string;
   console.log("the date is: ", date);
   admin
      .firestore()
      .collection("Calendar")
      .doc(date)
      .get()
      .then(async snapshot => {
         let result: Array<string> = [];
         console.log("snap data is: ", snapshot.data());
         const data = snapshot.data();
         if (data) {
            const reservations = data.res;

            result = await admin
               .firestore()
               .collection("Reservations")
               .where(admin.firestore.FieldPath.documentId(), "in", reservations)
               .get()
               .then(snap => {
                  console.log("reservations are: ", snap.docs);
                  if (snap.docs) {
                     snap.docs.forEach(doc => {
                        console.log("doc data: ", doc.data());
                     });
                  }
                  return [];
               });
         }
         return res.json(result);
      })
      .catch(error => {
         console.log(error);
         return res.json({ error: "an error occured" });
      });
});

app.post("/reservation", (req, res) => {
   const newReservation: Reservation = {
      prenom: req.body.prenom,
      id: req.body.id || "",
      nom: req.body.nom,
      societe: req.body.societe,
      modele: req.body.modele,
      accessoires: req.body.accessoires,
      gsm: req.body.gsm,
      email: req.body.email,
      address: req.body.address,
      startDate: req.body.startDate,
      endDate: req.body.endDate || "",
      montant: req.body.montant,
      isBancontact: req.body.isBancontact,
      isReceived: req.body.isReceived,
   };

   console.log("the data is: ", newReservation);
   admin
      .firestore()
      .collection("calendar")
      .doc(newReservation.startDate)
      .collection("reservations")
      .doc()
      .set(newReservation)
      .then(() => {
         return res.status(200).send({ message: "Reservation was made successfuly" });
      })
      .catch(error => {
         console.log(error);
         return res.status(500).send({ message: "An error occured" });
      });
});

export const api = functions.region("europe-west1").https.onRequest(app);
