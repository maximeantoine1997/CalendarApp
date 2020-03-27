import React from "react";
import { makeStyles, createStyles, Grid } from "@material-ui/core";
import useUserContext from "Contexts/UserContext";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "3vh",
      },
   })
);

const AccountPage = () => {
   const classes = useStyles();

   const { user } = useUserContext();

   if (user) {
      return (
         <Grid container justify="center" alignContent="center" alignItems="center" className={classes.grid}>
            <h1> Profil Page </h1>
         </Grid>
      );
   }

   return <Redirect to="/" />;
};

export default AccountPage;
