import React from "react";
import ReservationForm from "components/reservation_form";
import { makeStyles, Theme, createStyles, Grid } from "@material-ui/core";
import useUserContext from "Contexts/UserContext";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      grid: {
         height: "100%",
         // This makes sure that the content doesn't go under the navbar
         paddingTop: "3vh",
      },
   })
);

const ReservationPage = () => {
   const classes = useStyles();

   const { user } = useUserContext();

   if (user) {
      return (
         <Grid container justify="center" alignContent="center" alignItems="center" className={classes.grid}>
            <ReservationForm />
         </Grid>
      );
   }

   return <Redirect to="/" />;
};

export default ReservationPage;
