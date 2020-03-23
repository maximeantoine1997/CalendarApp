import * as firebase from "firebase/app";
import "firebase/database";
import { Nullable } from "Interfaces/Common";

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

// #endregion

export const signInFirebase = (
   email: React.MutableRefObject<string>,
   password: React.MutableRefObject<string>
): void => {
   firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
         return firebase.auth().signInWithEmailAndPassword(email.current, password.current);
      })
      .catch(function(error) {
         // Handle Errors here.
         //  var errorCode = error.code;
         var errorMessage = error.message;
         console.error(errorMessage);
      });
};
