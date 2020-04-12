import { Box, Button, createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import CalendarReservation from "../components/Calendar/CalendarReservation";
import { Reservation } from "../components/reservation_form";
import * as firebase from "firebase/app";
import "firebase/functions";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "92vh",
         paddingTop: "3vh",
      },
   })
);

const CalendarPage: React.FC = () => {
   const classes = useStyles();

   const [date, setDate] = useState<Moment>(moment());

   const onChangeDate = (newDate: Moment) => {
      setDate(newDate);
   };

   return (
      <Box className={classes.grid}>
         <CalendarNavigation currentDate={date} onChangeDate={onChangeDate} />
         <CalendarWeekView currentDate={date} />
      </Box>
   );

   //    return <Redirect to="/" />;
};

export default CalendarPage;
