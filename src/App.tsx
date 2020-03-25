import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles, Theme, createStyles, Grid } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import ReservationPage from "pages/ReservationPage";
import CalendarPage from "pages/CalendarPage";
import HomePage from "pages/HomePage";
import SideBar from "components/Navigation/Sidebar";
import AddButton from "components/AddButton";
import useUserContext, { UserContextProvider } from "Contexts/UserContext";
import { isFunction } from "Utils";

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

// #region Firebase

const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

// #endregion

// #region react-redux-firebase

const App: React.FC = () => {
   const classes = useStyles();
   const { setUser } = useUserContext();
   firebase.auth().onAuthStateChanged(user => {
      if (user) {
         console.log("user is signed in");
         if (isFunction(setUser)) setUser(user);
      } else {
         console.log("No User is signed in");
      }
   });

   return (
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
                        <Route path="/">
                           <HomePage />
                        </Route>
                     </Switch>
                  </AddButton>
               </Grid>
            </Grid>
         </Router>
      </UserContextProvider>
   );
};

export default App;
