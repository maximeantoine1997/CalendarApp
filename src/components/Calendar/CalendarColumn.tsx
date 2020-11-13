import { createStyles, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import useCalendarContext from "../../Contexts/CalendarContext";
import { IColumn } from "../../Utils";
import CalendarColumnHeader from "./CalendarColumnHeader";
import CalendarReservation from "./Reservation/CalendarReservation";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
         border: "1px solid #F4F4F4",
         borderBottomStyle: "hidden",
         width: "14vw",
         minHeight: "83vh",
         display: "flex",
         flexDirection: "column"
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
      droppable: { backgroundColor: "red" },
   })
);

interface CalendarColumnProps {
   day: string;
   column: IColumn;
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ day, column }) => {
   const classes = useStyles();


   const { getReservations } = useCalendarContext();

   return (
      <Grid container className={classes.calendar} direction="row" alignContent="flex-start" justify="center">
         <CalendarColumnHeader date={day} />
         {column ? (
                <Droppable droppableId={column.id}>
                {(provided, snapshot) => {

                    const reservations = getReservations(column.reservationIds);

                    return (
                        <div ref={provided.innerRef}  {...provided.droppableProps} style={{flexGrow: 1, paddingBottom: "25px"}} >
                           {reservations.map((reservation, index) => {
                           return <CalendarReservation reservation={reservation} key={reservation.id} index={index} />;
                           })}
                           {provided.placeholder}
                        </div>
                    );
                }}
                </Droppable>
         ) : (
            <div style={{flexGrow: 1, paddingBottom: "25px"}}></div>
         )}
      </Grid>
   );
};

export default CalendarColumn;
