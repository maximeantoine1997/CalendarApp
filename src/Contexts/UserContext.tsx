import React, { createContext, ReactNode, ReactElement, useContext, useEffect, useState } from "react";
import { Nullable } from "Interfaces/Common";
import firebase from "firebase";

interface IUserContext {
   user: Nullable<firebase.User>;
   setUser?: (value: Nullable<firebase.User>) => void;
}

export const UserContext = createContext<IUserContext>({
   user: null,
});

export const UserContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [user, setUser] = useState<Nullable<firebase.User>>(null);

   useEffect(() => {
      firebase.auth().onAuthStateChanged(firebaseUser => {
         if (firebaseUser) setUser(firebaseUser);
      });
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
