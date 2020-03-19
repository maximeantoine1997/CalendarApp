import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, makeStyles, Theme, createStyles } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/database";
import ReservationPage from "pages/ReservationPage";
import CalendarPage from "pages/CalendarPage";
import HomePage from "pages/HomePage";

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

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      links: {
         flexGrow: 1,
         flexDirection: "row",
         alignContent: "end",
      },
      link: {
         "color": "black",
         "padding": "25px",
         "font": "Roboto",
         "fontSize": "20px",
         "textDecoration": "none",
         "&:hover": {
            color: "grey",
            transition: "0.2s",
         },
      },
      logo: {
         "color": "black",
         "fontWeight": "bold",
         "padding": "25px",
         "font": "Roboto",
         "fontSize": "20px",
         "textDecoration": "none",
         "&:hover": {
            color: "grey",
            transition: "0.2s",
         },
      },
   })
);

const App: React.FC = () => {
   const classes = useStyles();

   return (
      <Router>
         <AppBar position="static" color="inherit">
            <Toolbar>
               <Link to="/" className={classes.logo}>
                  Antoine SPRL
               </Link>
               <Link to="/calendrier" className={classes.link}>
                  Calendrier
               </Link>
               <Link to="/reservation" className={classes.link}>
                  Reservation
               </Link>
            </Toolbar>
         </AppBar>
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
      </Router>
   );
};

export default App;
