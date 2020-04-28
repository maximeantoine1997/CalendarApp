import { Box, createStyles, makeStyles } from "@material-ui/core";
import "firebase/functions";
import moment, { Moment } from "moment";
import React, { useState, useEffect } from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";
import { CalendarType } from "../Interfaces/Common";
import { Reservation } from "../components/reservation_form";
import firebase from "firebase";
import { DateContextProvider } from "../Contexts/DateContext";

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
   const [calendarType, setCalendarType] = useState<CalendarType>("preparation");

   const [weekPlanning, setWeekPlanning] = useState<Array<Array<Reservation>>>([]);

   const onChangeDate = (newDate: Moment) => {
      setDate(newDate);
   };

   const onChangeCalendarType = (type: CalendarType) => {
      setCalendarType(type);
   };

   useEffect(() => {
      const getData = async () => {
         const day = date.clone();
         let week: Array<Array<Reservation>> = [];
         //  const getWeekReservationsAsync = firebase.functions().httpsCallable("getWeekReservationsAsync");
         //  await getWeekReservationsAsync({ date: day.format("YYYY-MM-DD") }).then(result => {
         //     week = result.data;
         //  });
         setWeekPlanning(week);
      };
      getData();
   }, [date]);

   return (
      <DateContextProvider>
         <Box className={classes.grid}>
            <CalendarNavigation onChangeCalendarType={onChangeCalendarType} calendarType={calendarType} />
            <CalendarWeekView calendarType={calendarType} />
         </Box>
      </DateContextProvider>
   );

   //    return <Redirect to="/" />;
};

export default CalendarPage;
