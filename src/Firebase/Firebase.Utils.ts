import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { Nullable } from "../Interfaces/Common";
import { Reservation } from "../components/reservation_form";

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

export const dateExistAsync = async (date: string): Promise<boolean> => {
   let exist = false;
   await firebase
      .database()
      .ref("Calendar")
      .orderByKey()
      .equalTo(date)
      .once("value")
      .then(snapshot => {
         if (snapshot.val()) {
            exist = true;
         }
      })
      .catch(error => console.error(error));

   return exist;
};

export const addReservationAsync = async (reservation: Reservation): Promise<void> => {
   const dateKey = reservation.startDate.format("YYYY-MM-DD");
   // const dateExist = await dateExistAsync(dateKey);

   const reservationId = firebase.database().ref(`Calendar/${dateKey}`).push().key;
   if (reservationId) {
      reservation.id = reservationId;

      const updates: Record<string, string> = {};
      updates[`Calendar/${dateKey}/${reservationId}`] = JSON.stringify(reservation);

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
