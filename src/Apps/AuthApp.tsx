import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddButton from "../components/AddButton";
import SideBar from "../components/Navigation/Sidebar";
import useUserContext from "../Contexts/UserContext";
import AccountPage from "../pages/AccountPage";
import CalendarPage from "../pages/CalendarPage";
import HomePage from "../pages/HomePage";
import ReservationPage from "../pages/ReservationPage";
import SettingsPage from "../pages/SettingsPage";
import { isFunction } from "../Utils";

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

const AuthApp: React.FC = () => {
   const classes = useStyles();
   const { setUser } = useUserContext();
   firebase.auth().onAuthStateChanged(user => {
      if (user) {
         if (isFunction(setUser)) setUser(user);
      } else {
      }
   });

   return (
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
   );
};

export default AuthApp;