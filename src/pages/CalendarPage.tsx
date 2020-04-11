import { Box, Button, createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import CalendarReservation from "../components/Calendar/CalendarReservation";
import { Reservation } from "../components/reservation_form";
import * as firebase from "firebase/app";
import "firebase/functions";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "92vh",
         paddingTop: "3vh",
         background: "#F5F6FA",
      },
   })
);

const CalendarPage: React.FC = () => {
   const classes = useStyles();

   const [date, setDate] = useState<Moment>(moment());
   const [weekPlanning, setWeekPlanning] = useState<Array<Array<Reservation>>>([]);

   const getWeekReservationsAsync = firebase.functions().httpsCallable("getWeekReservationsAsync");

   useEffect(() => {
      const getReservations = async () => {
         const currentDay = date.clone();

         // Get the reservations from Monday to Sunday of that Week
         let week: Array<Array<Reservation>> = [];

         await getWeekReservationsAsync({ date: currentDay.format("YYYY-MM-DD") }).then(result => {
            week = result.data;
         });
         setWeekPlanning(week);
      };

      getReservations();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const onChangeDate = (newDate: Moment) => {
      setDate(newDate);

      // Get the reservations from Monday to Sunday of that Week

      //   let week: Array<Array<Reservation>> = [];

      //   await getWeekReservationsAsync({ date: newDate.format("YYYY-MM-DD") }).then(result => {
      //      week = result.data;
      //   });

      //   setWeekPlanning(week);
   };

   if (weekPlanning.length === 0) {
      return <></>;
   }

   const renderMonday = weekPlanning[0].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });
   const renderTuesday = weekPlanning[1].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });
   const renderWednesday = weekPlanning[2].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });
   const renderThursday = weekPlanning[3].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });
   const renderFriday = weekPlanning[4].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });
   const renderSaturday = weekPlanning[5].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });
   const renderSunday = weekPlanning[6].map(res => {
      return <CalendarReservation reservation={res} key={uuid()} />;
   });

   return (
      <Box className={classes.grid}>
         {/* <Grid container alignItems="center">
            <Grid item xs={4}>
               <Button onClick={() => onUpdate("substract")}>Previous Week</Button>
            </Grid>
            <Grid item xs={4}>
               <Typography>{date.format("YYYY-MM-DD")}</Typography>
            </Grid>
            <Grid item xs={4}>
               <Button onClick={() => onUpdate("add")}>Next Week</Button>
            </Grid>
         </Grid> */}
         <CalendarNavigation currentDate={date} onChangeDate={onChangeDate} />
         <Grid container>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Lundi</Typography>
               {renderMonday}
            </Grid>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Mardi</Typography>
               {renderTuesday}
            </Grid>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Mercredi</Typography>
               {renderWednesday}
            </Grid>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Jeudi</Typography>
               {renderThursday}
            </Grid>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Vendredi</Typography>
               {renderFriday}
            </Grid>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Samedi</Typography>
               {renderSaturday}
            </Grid>
            <Grid item style={{ width: "14vw" }}>
               <Typography align="center">Dimanche</Typography>
               {renderSunday}
            </Grid>
         </Grid>
      </Box>
   );

   //    return <Redirect to="/" />;
};

export default CalendarPage;
