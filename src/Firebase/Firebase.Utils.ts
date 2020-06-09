import Axios from "axios";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Reservation } from "./../components/reservation_form";
import { HashMap } from "../Utils";

const api = "https://europe-west1-antoinesprl-calendrier.cloudfunctions.net/api";

// Auth

export const createUserAsync = async (email: string, password: string, userName: string): Promise<boolean> => {
   return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
         if (!value.user) return false;
         return value.user
            ?.updateProfile({
               displayName: userName,
            })
            .then(() => {
               return true;
            })
            .catch(error => {
               console.error(error);
               return false;
            });
      })
      .catch(error => {
         console.error(error);
         return false;
      });
};

export const signInUserAsync = async (email: string, password: string): Promise<firebase.User | null> => {
   return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
         return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
               return user.user;
            });
      })
      .catch(error => {
         console.error(error);
         return null;
      });
};

// Autocomplete

export const getAutocompleteAsync = async (): Promise<HashMap<unknown>> => {
   return Axios.get(`${api}/autocomplete`)
      .then(response => {
         const data = response.data;

         return data.hash;
      })
      .catch(error => {
         console.log(error);
         return {};
      });
};

export const updateAutocompleteAsync = async (hash: HashMap<unknown>): Promise<void> => {
   console.log({ ...hash });
   Axios.put(`${api}/autocomplete`, { ...hash }, { method: "PUT" }).then(response => {
      console.log(response.data);
   });
};

// Reservation

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

export const deleteReservationAsync = async (reservation: Reservation): Promise<void> => {
   console.log("axios id is: ", reservation.id);
   Axios.delete(`${api}/reservation`, {
      params: {
         id: reservation.id,
      },
   }).catch(error => {
      console.log(error);
   });
};

export const getReservationsAsync = async (date: string): Promise<Array<Reservation>> => {
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
