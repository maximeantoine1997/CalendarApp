import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Reservation } from "../reservation_form";
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
         marginTop: "20px",
         paddingLeft: "10px",
         paddingRight: "10px",
         cursor: "pointer",
      },
   })
);
interface CalendarReservationProps {
   reservation: Reservation;
}

const CalendarReservation: React.FC<CalendarReservationProps> = ({ reservation }) => {
   const classes = useStyles();
   const [expand, setExpand] = useState<boolean>(false);

   return (
      <>
         <Grid container onClick={() => setExpand(true)} className={classes.container} direction="column">
            <Grid item>
               <Typography>{reservation.reservationNumber || "123"}</Typography>
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
      </>
   );
};

export default CalendarReservation;
