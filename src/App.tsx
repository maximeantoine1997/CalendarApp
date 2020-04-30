import React from "react";
import useUserContext from "./Contexts/UserContext";
import AuthApp from "./Apps/AuthApp";
import NotAuthApp from "./Apps/NotAuthApp";
import { SnackbarProvider } from "notistack";

const App: React.FunctionComponent = () => {
   const { user } = useUserContext();

   const app = user ? <AuthApp /> : <NotAuthApp />;
   console.log("user is: ", user);
   return <SnackbarProvider autoHideDuration={3000}>{app}</SnackbarProvider>;
};

export default App;
