import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import "firebase/auth";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddButton from "../components/AddButton";
import SideBar from "../components/Navigation/Sidebar";
import { CalendarContextProvider } from "../Contexts/CalendarContext";
import AccountPage from "../pages/AccountPage";
import CalendarPage from "../pages/CalendarPage";
import HomePage from "../pages/HomePage";
import ReservationPage from "../pages/ReservationPage";
import RetourPage from "../pages/RetourPage";
import SettingsPage from "../pages/SettingsPage";

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

const AuthApp: React.FC = () => {
   const classes = useStyles();

   const [width, setWidth] = useState(window.innerWidth);
   const [height, setHeight] = useState(window.innerHeight);

   const updateWidthAndHeight = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
   };

   useEffect(() => {
      window.addEventListener("resize", updateWidthAndHeight);

      return () => {
         window.removeEventListener("resize", updateWidthAndHeight);
      };
   });

   return (
      <Router>
         <CalendarContextProvider>
            <Grid container style={{ width: width, height: height, overflowX: "hidden" }}>
               <Grid item xs={12} className={classes.menu}>
                  <SideBar />
               </Grid>
               <Grid item xs={12}>
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
                     <Route path="/retour">
                        <RetourPage />
                     </Route>
                     <Route exact path="/">
                        <HomePage />
                     </Route>
                  </Switch>
                  <AddButton />
               </Grid>
            </Grid>
         </CalendarContextProvider>
      </Router>
   );
};

export default AuthApp;
