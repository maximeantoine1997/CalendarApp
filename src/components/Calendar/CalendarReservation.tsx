import { createStyles, Grid, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Reservation } from "../reservation_form";
import CalendarModal from "./CalendarModal";
import CalendarMenu from "./CalendarMenu";

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
   })
);
interface CalendarReservationProps {
   reservation: Reservation;
}

const CalendarReservation: React.FC<CalendarReservationProps> = ({ reservation }) => {
   const classes = useStyles();
   const [expand, setExpand] = useState<boolean>(false);

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
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
               <Typography>{reservation.reservationNumber || "N° Vary"}</Typography>
            </Grid>
            <Grid item>
               <Typography>{reservation.societe}</Typography>
            </Grid>
            <Grid item>
               <Typography>{reservation.modele}</Typography>
            </Grid>
            <Grid item>
               <Typography>{reservation.address}</Typography>
            </Grid>
         </Grid>
         <CalendarModal reservation={reservation} open={expand} onClose={() => setExpand(false)} />
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
