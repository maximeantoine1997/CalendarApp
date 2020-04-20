import { Optional, Nullable } from "./Interfaces/Common";
import { Reservation } from "./components/reservation_form";

export const isFunction = (f: any): f is Function => {
   return typeof f === "function";
};

export const checkIfConnected = (user: Optional<Nullable<firebase.User>>, path: string): string => {
   if (!user) return "/";

   return path;
};

export interface WithId {
   id: string;
}

export const isPreparation = (reservation: Reservation): boolean => {
   switch (reservation.type) {
      case "Fini":
         return true;
      case "Livraison":
         return false;
      case "Livre":
         return false;
      case "Preparation":
         return true;
      case "Retour":
         return false;
      default:
         return true;
   }
};

export const isLivraison = (reservation: Reservation): boolean => {
   switch (reservation.type) {
      case "Fini":
         return true;
      case "Livraison":
         return true;
      case "Livre":
         return true;
      case "Preparation":
         return false;
      case "Retour":
         return true;
      default:
         return true;
   }
};
