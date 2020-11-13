import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import "firebase/auth";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddButton from "../components/AddButton";
import SideBar from "../components/Navigation/Sidebar";
import { Reservation } from "../components/reservation_form";
import { CalendarContextProvider } from "../Contexts/CalendarContext";
import {
   FDBGetAllReservations,
   Fauna,
   convertToReservation,
   FDBupdateReservationAsync,
   FDBgetReservations,
} from "../FaunaDB/Api";
import AccountPage from "../pages/AccountPage";
import CalendarPage from "../pages/CalendarPage";
import HomePage from "../pages/HomePage";
import ReservationPage from "../pages/ReservationPage";
import SettingsPage from "../pages/SettingsPage";
import { HashMap } from "../Utils";

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

   const [width, setWidth] = useState(window.innerWidth);
   const [height, setHeight] = useState(window.innerHeight);

   const updateWidthAndHeight = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
   };

   const isDone = false;

   useEffect(() => {
      window.addEventListener("resize", updateWidthAndHeight);
      window.addEventListener("beforeunload", event => {
         event.preventDefault();
         event.returnValue = "";
      });

      return () => {
         window.removeEventListener("resize", updateWidthAndHeight);
         window.removeEventListener("beforeunload", () => {});
      };
   });

   useEffect(() => {
      const onClick = async () => {
         const data: Array<Fauna<Reservation>> = (await FDBgetReservations(["2020-11-14"])) as Array<
            Fauna<Reservation>
         >;
         console.log(data);
         if (!data) return;
         const hash: HashMap<Array<Reservation>> = {};
         // store all reservations in a hash
         data.forEach(async fReservation => {
            const reservation = convertToReservation(fReservation);
            const date = reservation.startDate;
            // add new element to existing array
            if (hash[date]) {
               const newHash = Array.from(hash[date]);
               newHash.push(reservation);
               hash[date] = newHash;
               return;
            }
            // hash has nothing stored yet so create array
            hash[date] = [reservation];
         });
         for (let date in hash) {
            const res = hash[date];
            for (let i = 0; i < res.length - 1; i++) {
               const currentReservation = res[i];
               const nextReservation = res[i + 1];
               let previousId = (currentReservation.id as unknown) as string;
               let nextId = (nextReservation.id as unknown) as string;
               if (!previousId || !nextId) return;
               // Asign next ID to current item
               res[i] = {
                  ...currentReservation,
                  next: nextId,
               };
               // Assign previous ID to the next item
               res[i + 1] = {
                  ...nextReservation,
                  previous: previousId,
               };
            }
            res[0] = { ...res[0], previous: "FIRST" };
            res[res.length - 1] = { ...res[res.length - 1], next: "LAST" };
            res.forEach(async element => {
               await FDBupdateReservationAsync(element);
            });
         }
         console.log("DONE");
      };
      //onClick();
   }, []);

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
