import React, { useState } from "react";
import { Grid, Typography, Dialog, makeStyles, createStyles, DialogContent, DialogTitle } from "@material-ui/core";
import { Reservation } from "../reservation_form";

const useStyles = makeStyles(() =>
   createStyles({
      dialog: {
         height: "50vh",
         padding: "20px",
      },
   })
);
interface CalendarModalProps {
   reservation: Reservation;
   open: boolean;
   onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ reservation, open, onClose: onClose_ }) => {
   const classes = useStyles();
   return (
      <>
         <Dialog open={open} onClose={onClose_} fullWidth scroll="paper">
            <DialogTitle>Reservation</DialogTitle>
            <DialogContent>
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
            </DialogContent>
         </Dialog>
      </>
   );
};

export default CalendarModal;
