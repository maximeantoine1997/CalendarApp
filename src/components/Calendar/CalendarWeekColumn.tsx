import { createStyles, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import useCalendarContext from "../../Contexts/CalendarContext";
import { IColumn } from "../../Utils";
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

interface CalendarWeekColumnProps {
   day: string;
   column: IColumn;
}

const CalendarWeekColumn: React.FC<CalendarWeekColumnProps> = ({ day, column }) => {
   const classes = useStyles();

   const { getReservations } = useCalendarContext();

   const reservations = getReservations(column.reservationIds);

   return (
      <Grid container className={classes.calendar} direction="row" alignContent="flex-start" justify="center">
         {/* <CalendarHeaderTab day={day} /> */}
         <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
               <div ref={provided.innerRef} className={classes.scroll} {...provided.droppableProps}>
                  {reservations.map((reservation, index) => {
                     return <CalendarReservation reservation={reservation} key={reservation.id} index={index} />;
                  })}
                  {provided.placeholder}
               </div>
            )}
         </Droppable>
      </Grid>
   );
};

export default CalendarWeekColumn;
