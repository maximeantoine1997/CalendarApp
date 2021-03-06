import { Moment } from "moment";
import { Reservation } from "./components/reservation_form";
import { Note } from "./FaunaDB/Api";

export const isFunction = (f: any): f is Function => {
   return typeof f === "function";
};

export const isReservation = (element: any): element is Reservation => {
   return element.modele !== undefined;
};

export const isNote = (element: any): element is Note => {
   return element.note !== undefined;
};

export const checkIfConnected = (user: Optional<object>, path: string): string => {
   if (!user) return "/";

   return path;
};

export interface HashMap<T> {
   [key: string]: T;
}

export type Nullable<T> = null | T;

export type Optional<T> = undefined | T;

export type CalendarType = "transport" | "general";

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

export const typeColors: Record<ReservationType, string> = {
   "A Livrer": "#5FBE7D",
   "Annulé": "#474747",
   "Attente Caution": "#55ABE5",
   "Client Vient Chercher": "#A895E2",
   "Dépannage": "#B9C0CB",
   "Divers": "#A3B367",
   "Doit Confirmer": "#FECB6F",
   "Livraison par Transporteur": "#33BAB1",
   "Livré / Venu Chercher": "#910A19",
   "Rendez-vous": "#F5AD0B",
   "Retour": "#1C6367",
   "Transport": "#E48BB5",
};

export const isTransport: Record<ReservationType, boolean> = {
   "A Livrer": true,
   "Annulé": false,
   "Attente Caution": false,
   "Client Vient Chercher": false,
   "Dépannage": true,
   "Divers": true,
   "Doit Confirmer": false,
   "Livraison par Transporteur": true,
   "Livré / Venu Chercher": false,
   "Rendez-vous": false,
   "Retour": true,
   "Transport": true,
};

export const getWeekDays = (day: Moment): Array<string> => {
   const days: Array<string> = [];
   for (let i = 1; i < 8; i++) {
      days.push(day.clone().day(i).format("YYYY-MM-DD"));
   }
   return days;
};

// DRAG & DROP

export interface IColumn {
   id: string;
   reservationIds: Array<string>;
   noteIds: Array<string>;
}
