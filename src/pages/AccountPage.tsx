import React from "react";
import { makeStyles, createStyles, Grid } from "@material-ui/core";

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
   return (
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.grid}>
         <h1> Profil </h1>
      </Grid>
   );
};

export default AccountPage;
