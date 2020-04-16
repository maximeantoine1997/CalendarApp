import { createStyles, Grid, makeStyles } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/functions";
import { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { Reservation } from "../reservation_form";
import CalendarWeekTab from "./CalendarWeekTab";
import { CalendarType } from "../../Interfaces/Common";

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
   calendarType: CalendarType;
   weekPlanning: Array<Array<Reservation>>;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ weekPlanning, currentDate, calendarType }) => {
   const classes = useStyles();

   if (!weekPlanning.length) {
      return <></>;
   }
   if (calendarType === "preparation") {
      return (
         <Grid container justify="center" alignContent="space-around" direction="row">
            {weekPlanning.map((dayData, index) => {
               console.log("index: ", index, " - data: ", dayData);
               return (
                  <Grid item key={index}>
                     <CalendarWeekTab data={dayData} day={currentDate.clone().day(index + 1)} key={index} />
                  </Grid>
               );
            })}
         </Grid>
      );
   }

   return <>LIVRAISON</>;
};

export default CalendarWeekView;
