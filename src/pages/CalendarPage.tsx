import React from "react";
import { makeStyles, createStyles, Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import useUserContext from "Contexts/UserContext";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "3vh",
      },
   })
);

const CalendarPage = () => {
   const classes = useStyles();

   const { user } = useUserContext();

   if (user) {
      return (
         <Grid container justify="center" alignContent="center" alignItems="center" className={classes.grid}>
            <h1> Calendar Page </h1>
         </Grid>
      );
   }

   return <Redirect to="/" />;
};

export default CalendarPage;
