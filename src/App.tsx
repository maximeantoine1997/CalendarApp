import NotAuthApp from "./Apps/NotAuthApp";
import { SnackbarProvider } from "notistack";
import React from "react";
import AuthApp from "./Apps/AuthApp";
import useUserContext from "./Contexts/UserContext";

const App: React.FunctionComponent = () => {
   const { user } = useUserContext();

   const app = user ? <AuthApp /> : <NotAuthApp />;

   return <SnackbarProvider autoHideDuration={2000}>{app}</SnackbarProvider>;
};

export default App;
