import * as functions from "firebase-functions";
import * as moment from "moment";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors());

type ReservationType = "Preparation" | "Livraison" | "Livre" | "Retour" | "Fini";

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
   reservationNumber?: string;
   type: ReservationType;
}

export interface IHash {
   [key: string]: Array<unknown>;
}

// Autocomplete

app.get("/autocomplete", (req, res) => {
   admin
      .firestore()
      .collection("autocomplete")
      .get()
      .then(snapshot => {
         const documents = snapshot.docs;
         if (!documents) return res.status(500).send({ error: "No documents in autocomplete", hash: {} });
         const hash: IHash = {};
         documents.forEach(doc => {
            hash[doc.id] = doc.data().items || [];
         });
         return res.status(200).send({ hash: hash });
      })
      .catch(error => {
         console.log(error);
         return res.status(500).send({ error: "an error occured", hash: {} });
      });
});

const updateAutocompleteElement = (docName: string, items: Array<unknown>): void => {
   const newArray = [...new Set(items)];
   admin
      .firestore()
      .collection("autocomplete")
      .doc(docName)
      .update({
         items: newArray,
      })
      .catch(error => {
         console.log(error);
      });
};

app.put("/autocomplete", (req, res) => {
   updateAutocompleteElement("prenoms", req.body.prenoms);
   updateAutocompleteElement("noms", req.body.noms);
   updateAutocompleteElement("societes", req.body.societes);
   updateAutocompleteElement("modeles", req.body.modeles);
   updateAutocompleteElement("accessoires", req.body.accessoires);
   updateAutocompleteElement("gsms", req.body.gsms);
   updateAutocompleteElement("emails", req.body.emails);
   updateAutocompleteElement("addresses", req.body.addresses);
   return res.status(200).send({ message: "Autocomplete was updated successfuly" });
});

// Reservation

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
         return res.status(200).send({ reservations: data });
      })
      .catch(error => {
         console.log(error);
         return res.status(500).send({ error: "an error occured" });
      });
});

app.post("/reservation", (req, res) => {
   const reservationRef = admin.firestore().collection("reservations").doc();

   const newReservation: Reservation = {
      prenom: req.body.prenom,
      id: reservationRef.id,
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
      reservationNumber: req.body.reservationNumber || "",
      type: req.body.type,
   };

   reservationRef
      .set(newReservation)
      .then(() => {
         return res.status(200).send({ message: "Reservation was made successfuly" });
      })
      .catch(error => {
         console.log(error);
         return res.status(500).send({ message: "An error occured" });
      });
});

app.put("/reservation", (req, res) => {
   const reservation: Reservation = {
      prenom: req.body.prenom,
      id: req.body.id,
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
      reservationNumber: req.body.reservationNumber || "",
      type: req.body.type,
   };
   if (reservation.id) {
      return admin
         .firestore()
         .collection("reservations")
         .doc(reservation.id)
         .set(reservation)
         .then(() => {
            return res.status(200).send({ message: "Reservation was updated successfuly" });
         })
         .catch(error => {
            console.log(error);
            return res.status(500).send({ error: "An error occured" });
         });
   } else {
      return res.status(500).send({ error: "The reservation has no id" });
   }
});

app.delete("/reservation", (req, res) => {
   const id = req.query.id as string;
   console.log("id is: ", id);
   admin
      .firestore()
      .collection("reservations")
      .doc(id)
      .delete()
      .then(() => {
         return res.status(200).send({ message: "Reservation was deleted successfuly" });
      })
      .catch(error => {
         console.log(error);
         return res.status(500).send({ error: "An error occured" });
      });
});

export const api = functions.region("europe-west1").https.onRequest(app);
