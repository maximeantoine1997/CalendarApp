import React from "react";
import ReservationForm from "components/reservation_form";
import { makeStyles, Theme, createStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      grid: {
         height: "100%",
         paddingTop: "3vh",
      },
   })
);

const ReservationPage = () => {
   const classes = useStyles();
   return (
      <Grid container xs={12} justify="center" alignContent="center" alignItems="center" className={classes.grid}>
         <ReservationForm />
      </Grid>
   );
};

export default ReservationPage;
