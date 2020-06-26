import { createStyles, Grid, makeStyles } from "@material-ui/core";
import { Moment } from "moment";
import React, { useEffect, useState } from "react";
import useCalendarContext from "../../Contexts/CalendarContext";
import { isTransport } from "../../Utils";
import { Reservation } from "../reservation_form";
import CalendarHeaderTab from "./CalendarHeaderTab";
import CalendarReservation from "./Reservation/CalendarReservation";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
         border: "1px solid #F4F4F4",
         borderBottomStyle: "hidden",
         width: "14vw",
         minHeight: "83vh",
      },
      date: {
         border: "1px solid #F4F4F4",
         width: "100%",
         background: "#F8F8F8",
         paddingTop: "10px",
         paddingLeft: "20px",
         fontFamily: "Arial",
         fontWeight: "bold",
         height: "13vh",
      },
      dateNumber: {
         fontSize: "2em",
      },
      scroll: {},
   })
);

interface CalendarWeekTabProps {
   day: Moment;
}

const CalendarWeekTab: React.FC<CalendarWeekTabProps> = ({ day }) => {
   const classes = useStyles();
   const { calendarType, reservations, updateReservations } = useCalendarContext();
   const [data, setData] = useState<Array<Reservation>>([]);

   const filterData = (): Array<Reservation> => {
      let newData: Array<Reservation> = data;

      if (calendarType === "transport") {
         newData = data.filter(reservation => isTransport[reservation.type]);
      }

      return newData;
   };

   const filteredData = filterData();

   const onUpdate = (newReservation: Reservation | null, index: number) => {
      const newData = [...data];
      if (newReservation) {
         newData[index] = newReservation;
      } else {
         newData.splice(index, 1);
      }
      updateReservations(day.format("YYYY-MM-DD"), newData);
   };

   useEffect(() => {
      setData(reservations[day.format("YYYY-MM-DD")] || []);
   }, [day, reservations]);

   return (
      <Grid container className={classes.calendar} direction="row" alignContent="flex-start" justify="center">
         <CalendarHeaderTab day={day} />
         <Grid item className={classes.scroll}>
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
