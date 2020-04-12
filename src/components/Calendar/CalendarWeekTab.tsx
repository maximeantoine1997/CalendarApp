import { makeStyles, createStyles, Box, Grid } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { ReactElement, useEffect } from "react";
import { Reservation } from "../reservation_form";
import CalendarReservation from "./CalendarReservation";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
         border: "1px solid #F4F4F4",
         width: "14vw",
         height: "80vh",
      },
      date: {
         border: "1px solid #F4F4F4",
         width: "100%",
         background: "#F8F8F8",
         padding: "20px",
         fontFamily: "Arial",
         fontWeight: "bold",
      },
      dateNumber: {
         fontSize: "2em",
      },
   })
);

interface CalendarWeekTabProps {
   day: Moment;
   data: Array<Reservation>;
}

const CalendarWeekTab: React.FC<CalendarWeekTabProps> = ({ day, data }) => {
   const classes = useStyles();

   const dayName = day.format("dddd").substring(0, 2).toUpperCase();
   const dayDate = day.date();

   return (
      <Grid container className={classes.calendar} direction="column">
         <Grid item style={{ color: day.isSame(moment(), "date") ? "red" : "black" }} className={classes.date}>
            {dayName}
            <br />
            <Box className={classes.dateNumber}>{dayDate}</Box>
         </Grid>
         <Grid item>
            {data.map(reservation => {
               return <CalendarReservation reservation={reservation} />;
            })}
         </Grid>
      </Grid>
   );
};

export default CalendarWeekTab;
