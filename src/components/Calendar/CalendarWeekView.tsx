import { Grid } from "@material-ui/core";
import "firebase/functions";
import { Moment } from "moment";
import React from "react";
import { CalendarType } from "../../Interfaces/Common";
import { Reservation } from "../reservation_form";
import CalendarWeekTab from "./CalendarWeekTab";

interface CalendarWeekViewProps {
   currentDate: Moment;
   calendarType: CalendarType;
   weekPlanning: Array<Array<Reservation>>;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ weekPlanning, currentDate, calendarType }) => {
   if (!weekPlanning.length) {
      return <></>;
   }

   return (
      <Grid container justify="center" alignContent="space-around" direction="row">
         {weekPlanning.map((dayData, index) => {
            console.log("index: ", index, " - data: ", dayData);
            return (
               <Grid item key={index}>
                  <CalendarWeekTab
                     data={dayData}
                     day={currentDate.clone().day(index + 1)}
                     key={index}
                     type={calendarType}
                  />
               </Grid>
            );
         })}
      </Grid>
   );
};

export default CalendarWeekView;
