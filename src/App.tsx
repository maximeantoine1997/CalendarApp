import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles, Theme, createStyles, Box, Grid } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/database";
import ReservationPage from "pages/ReservationPage";
import CalendarPage from "pages/CalendarPage";
import HomePage from "pages/HomePage";
import SideBar from "components/Sidebar";
import AddButton from "components/AddButton";

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

const App: React.FC = () => {
   const classes = useStyles();

   return (
      <Router>
         <Grid container xs={12}>
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
   );
};

export default App;
