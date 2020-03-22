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

const HomePage = () => {
   const classes = useStyles();
   return (
      <Grid container xs={12} justify="center" alignContent="center" alignItems="center" className={classes.grid}>
         <h1> Home Page </h1>
      </Grid>
   );
};

export default HomePage;
