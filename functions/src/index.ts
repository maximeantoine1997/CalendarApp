import * as functions from "firebase-functions";
import * as moment from "moment";
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

app.get("/reservations", (req, res) => {
   const date: string = req.query.date as string;
   const day = moment(date);
   let reservationsRef = admin.firestore().collection("reservations");

   const getWeekDays = (): Array<string> => {
      const days: Array<string> = [];
      for (let i = 1; i < 8; i++) {
         days.push(day.clone().day(i).format("YYYY-MM-DD"));
      }
      return days;
   };
   const weekdays = getWeekDays();

   reservationsRef
      .where("startDate", "in", weekdays)
      .get()
      .then(snapshot => {
         const data: Array<Reservation> = [];
         snapshot.forEach(doc => {
            data.push(doc.data() as Reservation);
         });
         console.log(data);
         return res.status(200).send({ message: "it works", reservations: data });
      })
      .catch(error => {
         console.log(error);
         return res.status(500).send({ error: "an error occured" });
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

   admin
      .firestore()
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
