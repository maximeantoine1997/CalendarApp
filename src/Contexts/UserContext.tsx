import * as firebase from "firebase/app";
import "firebase/auth";
import React, { createContext, ReactElement, ReactNode, useContext, useState } from "react";
import { Nullable, Optional } from "../Interfaces/Common";

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
