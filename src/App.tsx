import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles, Theme, createStyles, Grid } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";
import useUserContext, { UserContextProvider } from "./Contexts/UserContext";
import { isFunction } from "./Utils";
import SideBar from "./components/Navigation/Sidebar";
import AddButton from "./components/AddButton";
import ReservationPage from "./pages/ReservationPage";
import CalendarPage from "./pages/CalendarPage";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import { SnackbarProvider } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      menu: {
         height: "5vh",
      },
      content: {
         minHeight: "95vh",
      },
   })
);

// #region react-redux-firebase

const App: React.FC = () => {
   const classes = useStyles();
   const { setUser } = useUserContext();
   firebase.auth().onAuthStateChanged(user => {
      if (user) {
         if (isFunction(setUser)) setUser(user);
      } else {
      }
   });

   return (
      <SnackbarProvider autoHideDuration={2000}>
         <UserContextProvider>
            <Router>
               <Grid container>
                  <Grid item xs={12} className={classes.menu}>
                     <SideBar />
                  </Grid>
                  <Grid item xs={12} className={classes.content}>
                     <AddButton>
                        <Switch>
                           <Route path="/reservation">
                              <ReservationPage />
                           </Route>
                           <Route path="/calendrier">
                              <CalendarPage />
                           </Route>
                           <Route path="/account">
                              <AccountPage />
                           </Route>
                           <Route path="/settings">
                              <SettingsPage />
                           </Route>
                           <Route exact path="/">
                              <HomePage />
                           </Route>
                        </Switch>
                     </AddButton>
                  </Grid>
               </Grid>
            </Router>
         </UserContextProvider>
      </SnackbarProvider>
   );
};

export default App;
