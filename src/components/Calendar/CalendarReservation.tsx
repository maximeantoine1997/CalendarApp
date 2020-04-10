import React, { useState } from "react";
import { Grid, Typography, makeStyles, createStyles, Box } from "@material-ui/core";
import { Reservation } from "../reservation_form";
import CalendarModal from "./CalendarModal";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
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
         <Grid container onClick={() => setExpand(true)} className={classes.container}>
            <Box boxShadow={3} className={classes.calendar} style={{ borderLeft: "4px solid red" }}>
               <Grid item xs={12}>
                  <Typography variant="h5">{reservation.societe}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="body1">{reservation.startDate}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="body1">{reservation.accessoires[0]}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant="body1">{reservation.address}</Typography>
               </Grid>
            </Box>
         </Grid>
         <CalendarModal reservation={reservation} open={expand} onClose={() => setExpand(false)} />
      </>
   );
};

export default CalendarReservation;
