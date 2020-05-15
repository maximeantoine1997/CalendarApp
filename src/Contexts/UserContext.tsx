import React, { createContext, ReactNode, ReactElement, useContext, useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { Optional, Nullable } from "../Utils";

interface IUserContext {
   user: Optional<Nullable<firebase.User>>;
   setUser: (value: Nullable<firebase.User>) => void;
}

export const UserContext = createContext<IUserContext>({
   user: null,
   setUser: () => {},
});

export const UserContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [user, setUser] = useState<Optional<Nullable<firebase.User>>>();

   useEffect(() => {
      const user = localStorage.getItem("authUser");
      if (user) {
         setUser(JSON.parse(user));
      } else {
         firebase.auth().onAuthStateChanged(user => {
            setUser(user);
         });
      }
   }, []);
   const userContext = { user, setUser };
   return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
};

const useUserContext = (): IUserContext => {
   const context = useContext(UserContext);
   if (context === null) {
      throw new Error("UserContext is not provided");
   }
   return context;
};

export default useUserContext;
