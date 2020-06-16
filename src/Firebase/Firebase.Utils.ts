import Axios from "axios";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
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
