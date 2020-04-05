import React, { useState } from "react";
import { Grid, Typography, Dialog, makeStyles, createStyles } from "@material-ui/core";
import { Reservation } from "../reservation_form";

const useStyles = makeStyles(() =>
   createStyles({
      dialog: {
         height: "50vh",
         padding: "20px",
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
         <Grid container style={{ border: "1px solid black", width: "auto" }} onClick={() => setExpand(true)}>
            <Grid item xs={12}>
               <Typography variant="h5">{reservation.societe}</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="body1">{reservation.modele}</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="body1">{reservation.accessoires[0]}</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="body1">{reservation.address}</Typography>
            </Grid>
         </Grid>
         <Dialog open={expand} onClose={() => setExpand(false)} fullWidth>
            <Grid container className={classes.dialog}>
               <Grid item xs={12}>
                  <Typography variant="h5">{reservation.societe}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="body1">{reservation.modele}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="body1">{reservation.accessoires[0]}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="body1">{reservation.address}</Typography>
               </Grid>
            </Grid>
         </Dialog>
      </>
   );
};

export default CalendarReservation;