import { createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import useUserContext from "../Contexts/UserContext";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      grid: {
         height: "100%",
         // This makes sure that the content doesn't go under the navbar
         paddingTop: "5vh",
      },
   })
);

const SettingsPage = () => {
   const classes = useStyles();

   return (
      <>
         <Grid container justify="center" alignContent="center" alignItems="center" className={classes.grid}></Grid>
      </>
   );
};

export default SettingsPage;
