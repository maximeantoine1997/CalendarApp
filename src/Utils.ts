import { Optional, Nullable } from "Interfaces/Common";

export const isFunction = (f: any): f is Function => {
   return typeof f === "function";
};

export const checkIfConnected = (user: Optional<Nullable<firebase.User>>, path: string): string => {
   if (!user) return "/";

   return path;
};
