/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import useCalendarContext from "../../../Contexts/CalendarContext";
import { typeColors } from "../../../Utils";
import { Reservation } from "../../reservation_form";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
         margin: "0px",
         width: "auto",
         paddingLeft: "10px",
         paddingRight: "10px",
         borderRadius: "5px",
         background: "white",
      },
      container: {
         marginTop: "10px",
         padding: "5px 10px",
         cursor: "pointer",
         userSelect: "none",
         fontSize: "1em",
         color: "white",
         borderRadius: "10px",
         whiteSpace: "nowrap",
         width: "13vw",
      },
   })
);
interface CalendarReservationProps {
   reservation: Reservation;
   index: number;
}

const CalendarReservation: React.FC<CalendarReservationProps> = ({ reservation, index }) => {
   const classes = useStyles();
   const { openModal, openMenu } = useCalendarContext();

   const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      openMenu(event.currentTarget, reservation);
   };

   const getAccessoires = (): string => {
      let text = "";
      reservation.accessoires.forEach((accessoire, index) => {
         if (index === 0) {
            text = text.concat(accessoire);
         } else {
            text = text.concat(" - ", accessoire);
         }
      });
      return text;
   };

   return (
      <Draggable draggableId={((reservation.id as unknown) as string) || ""} index={index}>
         {(provided, snapshot) => {
            return (
               <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                  <Grid
                     container
                     onClick={() => openModal(reservation)}
                     onContextMenu={e => {
                        handleClick(e);
                     }}
                     className={classes.container}
                     style={{ backgroundColor: typeColors[reservation.type] }}
                  >
                     <Grid container alignItems="center">
                        <Grid item xs={6}>
                           <Box textOverflow="ellipsis" overflow="hidden" fontSize="0.8em" paddingBottom="3px">
                              {reservation.varyNumber}
                           </Box>
                        </Grid>
                        <Grid item xs={reservation.varyNumber ? 6 : 12}>
                           <Box textOverflow="ellipsis" overflow="hidden" fontSize="0.8em" paddingBottom="3px">
                              {reservation.company || reservation.name}
                           </Box>
                        </Grid>
                     </Grid>
                     <Grid item xs={12}>
                        <Box textOverflow="ellipsis" overflow="hidden" fontSize="0.8em" paddingBottom="3px">
                           {reservation.modele}
                        </Box>
                     </Grid>
                     {reservation.accessoires.length > 0 && (
                        <Grid item xs={12}>
                           <Box textOverflow="ellipsis" overflow="hidden" fontSize="0.8em" paddingBottom="3px">
                              {getAccessoires()}
                           </Box>
                        </Grid>
                     )}

                     <Grid container>
                        <Grid item xs={12}>
                           <Box textOverflow="ellipsis" overflow="hidden" fontSize="0.8em" paddingBottom="3px">
                              {reservation.city || "Vient Chercher"}
                           </Box>
                        </Grid>
                     </Grid>
                  </Grid>
               </div>
            );
         }}
      </Draggable>
   );
};

export default CalendarReservation;
