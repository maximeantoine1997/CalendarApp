import { createStyles, Grid, makeStyles, Typography, Chip } from "@material-ui/core";
import React, { useState } from "react";
import { Reservation } from "../reservation_form";
import CalendarMenu from "./CalendarMenu";
import CalendarModal from "./CalendarModal";
import { typeColors } from "../../Interfaces/Common";

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
         marginTop: "20px",
         paddingLeft: "10px",
         paddingRight: "10px",
         cursor: "pointer",
         userSelect: "none",
      },
      reservation: {
         paddingLeft: "5px",
         fontSize: "1em",
      },
   })
);
interface CalendarReservationProps {
   reservation: Reservation;
   onUpdate: (newReservation: Reservation) => void;
}

const CalendarReservation: React.FC<CalendarReservationProps> = ({ reservation, onUpdate }) => {
   const classes = useStyles();
   const [expand, setExpand] = useState<boolean>(false);

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
   };

   const onModalClose = (newReservation: Reservation) => {
      onUpdate(newReservation);
      setExpand(false);
   };

   const handleClose = () => {
      onUpdate(reservation);
      setAnchorEl(null);
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
            direction="column"
         >
            <Grid item>
               <Chip
                  label={reservation.reservationNumber || "N° Vary"}
                  style={{ backgroundColor: typeColors[reservation.type], fontSize: "1em", cursor: "pointer" }}
               />
            </Grid>
            <Grid item>
               <Typography className={classes.reservation} style={{ paddingTop: "3px" }}>
                  {reservation.societe}
               </Typography>
            </Grid>
            <Grid item>
               <Typography className={classes.reservation}>{reservation.modele}</Typography>
            </Grid>
            <Grid item>
               <Typography className={classes.reservation}>{reservation.address}</Typography>
            </Grid>
         </Grid>
         <CalendarModal reservation={reservation} open={expand} onClose={onModalClose} />
         <CalendarMenu
            reservation={reservation}
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
         />
      </>
   );
};

export default CalendarReservation;
