import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { CalendarType } from "../../Interfaces/Common";
import { isLivraison, isPreparation } from "../../Utils";
import { Reservation } from "../reservation_form";
import CalendarReservation from "./CalendarReservation";
import { getReservations } from "../../Firebase/Firebase.Utils";

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
         height: "100px",
      },
      dateNumber: {
         fontSize: "2em",
      },
      scroll: {
         overflowY: "auto",
      },
   })
);

interface CalendarWeekTabProps {
   day: Moment;
   data: Array<Reservation>;
   type: CalendarType;
}

const CalendarWeekTab: React.FC<CalendarWeekTabProps> = ({ day, type }) => {
   const classes = useStyles();

   const dayName = day.format("dddd").substring(0, 2).toUpperCase();
   const dayDate = day.date();

   const [reservations, setReservations] = useState<Array<Reservation>>([]);

   useEffect(() => {
      const getData = async () => {
         const newReservations: Array<Reservation> = await getReservations(day.format("YYYY-MM-DD"));
         setReservations(newReservations);
      };
      getData();
   }, [day]);

   const filterData = (): Array<Reservation> => {
      let newData: Array<Reservation> = [];

      if (type === "preparation") {
         newData = reservations.filter(reservation => isPreparation(reservation));
      }
      if (type === "livraison") {
         newData = reservations.filter(reservation => isLivraison(reservation));
      }
      return newData;
   };

   const filteredReservations = filterData();

   return (
      <Grid container className={classes.calendar} direction="row">
         <Grid item style={{ color: day.isSame(moment(), "date") ? "red" : "black" }} className={classes.date}>
            {dayName}
            <br />
            <Box className={classes.dateNumber}>{dayDate}</Box>
         </Grid>
         <Grid item>
            {filteredReservations.map((reservation, index) => {
               return <CalendarReservation reservation={reservation} key={index} />;
            })}
         </Grid>
      </Grid>
   );
};

export default CalendarWeekTab;
