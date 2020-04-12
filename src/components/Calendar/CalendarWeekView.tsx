import { makeStyles, createStyles, Grid } from "@material-ui/core";
import { Moment } from "moment";
import React, { ReactElement, useEffect, useState } from "react";
import { Reservation } from "../reservation_form";
import * as firebase from "firebase/app";
import "firebase/functions";
import CalendarWeekTab from "./CalendarWeekTab";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
         padding: "25px",
         minHeight: "50vh",
      },
      button: {
         margin: "auto",
      },
      root: {
         padding: "10px",
      },
      pointer: {
         cursor: "pointer",
      },
   })
);

interface CalendarWeekViewProps {
   currentDate: Moment;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ currentDate }) => {
   const classes = useStyles();

   const [weekPlanning, setWeekPlanning] = useState<Array<Array<Reservation>>>([]);

   useEffect(() => {
      const getData = async () => {
         const day = currentDate.clone();
         let week: Array<Array<Reservation>> = [];
         const getWeekReservationsAsync = firebase.functions().httpsCallable("getWeekReservationsAsync");
         await getWeekReservationsAsync({ date: day.format("YYYY-MM-DD") }).then(result => {
            week = result.data;
         });
         setWeekPlanning(week);
      };
      getData();
   }, [currentDate]);

   if (!weekPlanning.length) {
      return <></>;
   }

   return (
      <Grid container justify="center" alignContent="space-around">
         {weekPlanning.map((dayData, index) => {
            return (
               <Grid item>
                  <CalendarWeekTab data={dayData} day={currentDate.clone().day(index + 1)} />
               </Grid>
            );
         })}
      </Grid>
   );
};

export default CalendarWeekView;
