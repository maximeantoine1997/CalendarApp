import React, { ReactElement } from "react";
import {
   Grid,
   Typography,
   Dialog,
   makeStyles,
   createStyles,
   DialogContent,
   DialogTitle,
   Chip,
} from "@material-ui/core";
import { Reservation } from "../reservation_form";

const useStyles = makeStyles(() =>
   createStyles({
      dialog: {
         height: "50vh",
      },
      title: {
         paddingTop: "20px",
         fontFamily: "Arial",
         fontSize: "1.5em",
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

   const renderAccessoires: Array<ReactElement> = reservation.accessoires
      ? reservation.accessoires.map((accessoire, index) => {
           return <Chip label={accessoire} variant="outlined" color="secondary" size="medium" key={index} />;
        })
      : [];

   return (
      <>
         <Dialog open={open} onClose={onClose_} fullWidth scroll="paper">
            <DialogTitle>Reservation</DialogTitle>
            <DialogContent>
               <Grid container className={classes.dialog} direction="column">
                  <Grid item>
                     <Typography className={classes.title}>Societé:</Typography>
                     <Typography>{reservation.societe}</Typography>
                  </Grid>
                  <Grid item>
                     <Typography className={classes.title}>Machine:</Typography>
                     <Typography>{reservation.modele}</Typography>
                  </Grid>
                  <Grid item>
                     <Typography className={classes.title}>Accessoires:</Typography>
                     {renderAccessoires}
                  </Grid>
                  <Grid item>
                     <Typography className={classes.title}>Addresse:</Typography>
                     <Typography>{reservation.address}</Typography>
                  </Grid>
               </Grid>
            </DialogContent>
         </Dialog>
      </>
   );
};

export default CalendarModal;
