import "firebase/auth";
import React, { createContext, ReactElement, ReactNode, useContext, useState, useEffect } from "react";
import { Optional } from "../Utils";
import { Account, Fauna } from "../FaunaDB/Api";

interface IUserContext {
   user: Optional<Fauna<Account>>;
   setUser: React.Dispatch<React.SetStateAction<Optional<Fauna<Account>>>>;
}

export const UserContext = createContext<IUserContext>({
   user: undefined,
   setUser: () => {},
});

export const UserContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [user, setUser] = useState<Optional<Fauna<Account>>>();

   useEffect(() => {
      const user = localStorage.getItem("authUser");
      if (user) {
         setUser(JSON.parse(user));
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
