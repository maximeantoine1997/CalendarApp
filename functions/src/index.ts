import * as functions from "firebase-functions";
import * as moment from "moment";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors());

export type ReservationType =
   | "A Livrer"
   | "Annulé"
   | "Attente Caution"
   | "Client Vient Chercher"
   | "Dépannage"
   | "Divers"
   | "Doit Confirmer"
   | "Livraison par Transporteur"
   | "Livré / Venu Chercher"
   | "Rendez-vous"
   | "Retour"
   | "Transport";

export interface Reservation {
   // Date:
   startDate: string;
   endDate?: string;

   // Caution:
   amount: number;
   isReceived: boolean;
   isCash: boolean;

   // Machine:
   modele: string;
   accessoires: Array<string>;

   // Chantier:
   isToBeDelivered: boolean;
   street: string;
   city: string;
   sitePhone: string;

   // Client:
   isCompany: boolean;
   toSave: boolean;
   company?: string;
   firstname?: string;
   lastname?: string;
   phone?: string;
   email?: string;

   // Extra:
   id?: string;
   varyNumber?: string;
   type: ReservationType;
   notes?: string;
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
   updateAutocompleteElement("firstname", req.body.firstname);
   updateAutocompleteElement("lastname", req.body.lastname);
   updateAutocompleteElement("company", req.body.company);
   updateAutocompleteElement("modele", req.body.modele);
   updateAutocompleteElement("accessoires", req.body.accessoires);
   updateAutocompleteElement("phone", req.body.phone);
   updateAutocompleteElement("email", req.body.email);
   updateAutocompleteElement("street", req.body.street);
   updateAutocompleteElement("city", req.body.city);
   updateAutocompleteElement("sitePhone", req.body.sitePhone);
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
      // Date:
      startDate: req.body.startDate,
      endDate: req.body.endDate || "",

      // Caution:
      amount: req.body.amount,
      isReceived: req.body.isReceived,
      isCash: req.body.isCash,

      // Machine:
      modele: req.body.modele,
      accessoires: req.body.accessoires,

      // Chantier:
      isToBeDelivered: req.body.isToBeDelivered,
      street: req.body.street,
      city: req.body.city,
      sitePhone: req.body.sitePhone,

      // Client:
      isCompany: req.body.isCompany,
      toSave: req.body.toSave,
      company: req.body.company || "",
      firstname: req.body.firstname || "",
      lastname: req.body.lastname || "",
      phone: req.body.phone || "",
      email: req.body.email || "",

      // Extra:
      id: reservationRef.id,
      varyNumber: req.body.varyNumber || "",
      type: req.body.type,
      notes: req.body.notes || "",
   };
   console.log("new res is:", newReservation);

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
      // Date:
      startDate: req.body.startDate,
      endDate: req.body.endDate || "",

      // Caution:
      amount: req.body.amount,
      isReceived: req.body.isReceived,
      isCash: req.body.isCash,

      // Machine:
      modele: req.body.modele,
      accessoires: req.body.accessoires,

      // Chantier:
      isToBeDelivered: req.body.isToBeDelivered,
      street: req.body.street,
      city: req.body.city,
      sitePhone: req.body.sitePhone,

      // Client:
      isCompany: req.body.isCompany,
      toSave: req.body.toSave,
      company: req.body.company || "",
      firstname: req.body.firstname || "",
      lastname: req.body.lastname || "",
      phone: req.body.phone || "",
      email: req.body.email || "",

      // Extra:
      id: req.body.id,
      varyNumber: req.body.varyNumber || "",
      type: req.body.type,
      notes: req.body.notes || "",
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
