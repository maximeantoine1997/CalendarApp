import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { useState, useEffect } from "react";
import { CalendarType } from "../../Interfaces/Common";
import { isLivraison, isPreparation } from "../../Utils";
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

const CalendarWeekTab: React.FC<CalendarWeekTabProps> = ({ day, data: data_, type }) => {
   const classes = useStyles();
   const [data, setData] = useState<Array<Reservation>>([...data_]);

   const dayName = day.format("dddd").substring(0, 2).toUpperCase();
   const dayDate = day.date();

   const filterData = (): Array<Reservation> => {
      let newData: Array<Reservation> = [];

      if (type === "general") {
         newData = [...data];
      }
      if (type === "preparation") {
         newData = data.filter(reservation => isPreparation(reservation));
      }
      if (type === "livraison") {
         newData = data.filter(reservation => isLivraison(reservation));
      }

      return newData;
   };

   const filteredData = filterData();

   const onUpdate = (newReservation: Reservation, index: number) => {
      const newData = [...data];
      newData[index] = newReservation;
      setData([...newData]);
   };

   // Update @ runtime of data will rerender this component
   useEffect(() => {
      setData(data_);
   }, [data_]);

   return (
      <Grid container className={classes.calendar} direction="row">
         <Grid item style={{ color: day.isSame(moment(), "date") ? "red" : "black" }} className={classes.date}>
            {dayName}
            <br />
            <Box className={classes.dateNumber}>{dayDate}</Box>
         </Grid>
         <Grid item>
            {filteredData.map((reservation, index) => {
               return (
                  <CalendarReservation
                     reservation={reservation}
                     key={index}
                     onUpdate={newReservation => onUpdate(newReservation, index)}
                  />
               );
            })}
         </Grid>
      </Grid>
   );
};

export default CalendarWeekTab;
