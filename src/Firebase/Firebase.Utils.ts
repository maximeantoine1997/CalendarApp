import { Reservation } from "./../components/reservation_form";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { Nullable } from "../Interfaces/Common";

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

export const addReservationAsync = async (reservation: Reservation): Promise<void> => {
   const dateKey = reservation.startDate.format("YYYY-MM-DD");

   let reservationPath = "";
   if (!reservation.endDate) {
      // Put reservation in NoEndDate category
      reservationPath = "Calendar/NoEndDate";
   } else {
      reservationPath = `Calendar/${dateKey}`;
   }

   const reservationId = await createFirebaseKeyAsync(reservationPath);

   if (reservationId) {
      reservation.id = reservationId;

      const reservationPath = reservation.endDate
         ? `Calendar/${dateKey}/${reservationId}`
         : `Calendar/NoEndDate/${reservationId}`;

      const updates: Record<string, string> = {};
      updates[reservationPath] = JSON.stringify(reservation);

      if (!isDuplicateFirebaseAsync("Reservation/Modele", reservation.modele)) {
         const modeleId = await createFirebaseKeyAsync("Reservation/Modele");
         updates[`Reservation/Modele/${modeleId}`] = reservation.modele;
      }

      const accessoiresId = await createFirebaseKeyAsync("Reservation/Accessoires");
      updates[`Reservation/Accessoires/${accessoiresId}`] = JSON.stringify(reservation.accessoires);

      if (!isDuplicateFirebaseAsync("Reservation/Societe", reservation.societe)) {
         const societeId = await createFirebaseKeyAsync("Reservation/Societe");
         updates[`Reservation/Societe/${societeId}`] = reservation.societe;
      }
      if (!isDuplicateFirebaseAsync("Reservation/Address", reservation.address)) {
         const addressId = await createFirebaseKeyAsync("Reservation/Address");
         updates[`Reservation/Address/${addressId}`] = reservation.address;
      }
      if (!isDuplicateFirebaseAsync("Reservation/Prenom", reservation.prenom)) {
         const prenomId = await createFirebaseKeyAsync("Reservation/Prenom");
         updates[`Reservation/Prenom/${prenomId}`] = reservation.prenom;
      }
      if (!isDuplicateFirebaseAsync("Reservation/Nom", reservation.nom)) {
         const nomId = await createFirebaseKeyAsync("Reservation/Nom");
         updates[`Reservation/Nom/${nomId}`] = reservation.nom;
      }
      if (!isDuplicateFirebaseAsync("Reservation/Telephone", reservation.gsm)) {
         const telephoneId = await createFirebaseKeyAsync("Reservation/Telephone");
         updates[`Reservation/Telephone/${telephoneId}`] = reservation.gsm;
      }
      if (!isDuplicateFirebaseAsync("Reservation/Email", reservation.email)) {
         const emailId = await createFirebaseKeyAsync("Reservation/Email");
         updates[`Reservation/Email/${emailId}`] = reservation.email;
      }

      firebase.database().ref().update(updates);
   }
};

export const getReservationsAsync = async (date: string): Promise<Array<Reservation>> => {
   let reservations: Array<Reservation> = [];

   await firebase
      .database()
      .ref(`Calendar/${date}`)
      .once("value")
      .then(snapshot => {
         if (snapshot) {
            const values = snapshot.val();
            if (values) {
               const raw = Object.values(values) as Array<string>;
               console.log(raw);
               reservations = raw.map(res => JSON.parse(res));
            }
         }
      });

   return reservations;
};

// #endregion
