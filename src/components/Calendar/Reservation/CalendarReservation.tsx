import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { typeColors } from "../../../Utils";
import { Reservation } from "../../reservation_form";
import CalendarMenu from "./CalendarMenu";
import CalendarModal from "./CalendarModal";

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
   onUpdate: (newReservation: Reservation | null) => void;
}

const CalendarReservation: React.FC<CalendarReservationProps> = ({ reservation, onUpdate }) => {
   const classes = useStyles();
   const [expand, setExpand] = useState<boolean>(false);

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
   };

   const onModalClose = (newReservation: Reservation | null) => {
      onUpdate(newReservation);
      setExpand(false);
   };

   const handleClose = () => {
      onUpdate(reservation);
      setAnchorEl(null);
   };

   const handleDelete = () => {
      onUpdate(null);
      setAnchorEl(null);
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
      <>
         <Grid
            container
            onClick={() => setExpand(true)}
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
         <CalendarModal reservation={reservation} open={expand} onClose={onModalClose} />
         {reservation.type !== "Livré / Venu Chercher" && (
            <CalendarMenu
               reservation={reservation}
               anchorEl={anchorEl}
               handleClick={handleClick}
               handleClose={handleClose}
               handleDelete={handleDelete}
            />
         )}
      </>
   );
};

export default CalendarReservation;
