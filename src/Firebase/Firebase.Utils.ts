import Axios from "axios";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Reservation } from "./../components/reservation_form";

const api = "https://europe-west1-antoinesprl-calendrier.cloudfunctions.net/api";

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

export const addReservationAsync = async (reservation: Reservation): Promise<object> => {
   return Axios.post(`${api}/reservation`, { ...reservation }, { method: "POST" })
      .then(response => {
         return response;
      })
      .catch(error => {
         return error;
      });
};

export const updateReservationAsync = async (reservation: Reservation): Promise<void> => {
   Axios.put(`${api}/reservation`, { ...reservation }, { method: "PUT" })
      .then(response => {
         console.log(response);
      })
      .catch(error => {
         console.log(error);
      });
};

export const getReservations = async (date: string): Promise<Array<Reservation>> => {
   return Axios.get(`${api}/reservations`, {
      params: {
         date: date,
      },
   })
      .then(response => {
         const data = response.data;

         return data.reservations;
      })
      .catch(error => {
         console.log(error);
         return [];
      });
};
