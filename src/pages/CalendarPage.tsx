import { Box, Button, createStyles, makeStyles, Typography, Grid } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Reservation } from "../components/reservation_form";
import useUserContext from "../Contexts/UserContext";
import { getReservationsAsync } from "../Firebase/Firebase.Utils";
import CalendarReservation from "../components/Calendar/CalendarReservation";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "5vh",
      },
   })
);

const CalendarPage: React.FC = () => {
   const classes = useStyles();

   const { user } = useUserContext();

   const [date, setDate] = useState<Moment>(moment());
   const [weekPlanning, setWeekPlanning] = useState<Array<Array<Reservation>>>([]);

   useEffect(() => {
      const getReservations = async () => {
         const currentDay = date.clone();
         const monday = await getReservationsAsync(currentDay.day(1).format("YYYY-MM-DD"));
         const tuesday = await getReservationsAsync(currentDay.day(2).format("YYYY-MM-DD"));
         const wednesday = await getReservationsAsync(currentDay.day(3).format("YYYY-MM-DD"));
         const thursday = await getReservationsAsync(currentDay.day(4).format("YYYY-MM-DD"));
         const friday = await getReservationsAsync(currentDay.day(5).format("YYYY-MM-DD"));
         const saturday = await getReservationsAsync(currentDay.day(6).format("YYYY-MM-DD"));
         const sunday = await getReservationsAsync(currentDay.day(7).format("YYYY-MM-DD"));

         setWeekPlanning([monday, tuesday, wednesday, thursday, friday, saturday, sunday]);
      };

      getReservations();
   }, []);

   const onUpdate = async (val: "add" | "substract") => {
      // We need to clone the object so that the React see it as a new object
      // Set to next week (+ 7 days) or previous week (- 7 days)
      const newDate = date.clone();

      console.log("before: ", newDate.format("YYYY-MM-DD"));
      if (val === "add") {
         newDate.add(7, "days");
      } else {
         newDate.subtract(7, "days");
      }

      console.log("after: ", newDate.format("YYYY-MM-DD"));

      setDate(newDate.clone());

      // Set date to the Monday of that week (= 1)
      const monday = await getReservationsAsync(newDate.day(1).format("YYYY-MM-DD"));
      const tuesday = await getReservationsAsync(newDate.day(2).format("YYYY-MM-DD"));
      const wednesday = await getReservationsAsync(newDate.day(3).format("YYYY-MM-DD"));
      const thursday = await getReservationsAsync(newDate.day(4).format("YYYY-MM-DD"));
      const friday = await getReservationsAsync(newDate.day(5).format("YYYY-MM-DD"));
      const saturday = await getReservationsAsync(newDate.day(6).format("YYYY-MM-DD"));
      const sunday = await getReservationsAsync(newDate.day(7).format("YYYY-MM-DD"));

      // Get the reservations from Monday to Sunday of that Week
      setWeekPlanning([monday, tuesday, wednesday, thursday, friday, saturday, sunday]);
   };

   if (weekPlanning.length === 0) {
      return <></>;
   }

   const renderMonday = weekPlanning[0].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });
   const renderTuesday = weekPlanning[1].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });
   const renderWednesday = weekPlanning[2].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });
   const renderThursday = weekPlanning[3].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });
   const renderFriday = weekPlanning[4].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });
   const renderSaturday = weekPlanning[5].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });
   const renderSunday = weekPlanning[6].map(res => {
      return <CalendarReservation reservation={res} key={res.id} />;
   });

   return (
      <Box className={classes.grid}>
         <Grid container alignItems="center">
            <Grid item xs={4} alignItems="flex-end">
               <Button onClick={() => onUpdate("substract")}>Previous Week</Button>
            </Grid>
            <Grid item xs={4}>
               <Typography>{date.format("YYYY-MM-DD")}</Typography>
            </Grid>
            <Grid item xs={4}>
               <Button onClick={() => onUpdate("add")}>Next Week</Button>
            </Grid>
         </Grid>
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

   return <Redirect to="/" />;
};

export default CalendarPage;
