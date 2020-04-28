import { Grid } from "@material-ui/core";
import "firebase/functions";
import { Moment } from "moment";
import React from "react";
import { CalendarType } from "../../Interfaces/Common";
import { Reservation } from "../reservation_form";
import CalendarWeekTab from "./CalendarWeekTab";
import useDateContext from "../../Contexts/DateContext";

interface CalendarWeekViewProps {
   calendarType: CalendarType;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ calendarType }) => {
   const { date } = useDateContext();

   const weekPlanning: Array<Array<Reservation>> = [[], [], [], [], [], [], []];

   if (!weekPlanning.length) {
      return <></>;
   }

   return (
      <Grid container justify="center" alignContent="space-around" direction="row">
         {weekPlanning.map((dayData, index) => {
            console.log("index: ", index, " - data: ", dayData);
            return (
               <Grid item key={index}>
                  <CalendarWeekTab data={dayData} day={date.clone().day(index + 1)} key={index} type={calendarType} />
               </Grid>
            );
         })}
      </Grid>
   );
};

export default CalendarWeekView;
