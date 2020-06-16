import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Calendar } from "../images/calendar.svg";
import { ReactComponent as Compte } from "../images/compte.svg";
import { ReactComponent as Reservation } from "../images/reservation.svg";
import { ReactComponent as Settings } from "../images/settings.svg";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "3vh",
      },
      card: {
         border: "1px solid #EDEBEC",
         borderRadius: "10px",
         padding: "20px",
         margin: "20px",
         cursor: "pointer",
      },
      picture: {
         paddingBottom: "25px",
      },
      title: {
         fontSize: "1.5em",
         fontFamily: "Arial ",
         fontWeight: "bold",
         color: "black",
      },
      link: {
         textDecoration: "none",
      },
   })
);

const HomePage = () => {
   const classes = useStyles();

   return (
      <Grid container alignContent="center" className={classes.grid}>
         <Grid container justify="center">
            <Grid item className={classes.card}>
               <Link to="/calendrier" className={classes.link}>
                  <Calendar width="25vw" height="25vh" title="Calendrier" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Calendrier
                  </Typography>
               </Link>
            </Grid>
            <Grid item className={classes.card}>
               <Link to="/reservation" className={classes.link}>
                  <Reservation width="25vw" height="25vh" title="Reservation" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Reservation
                  </Typography>
               </Link>
            </Grid>
         </Grid>
         <Grid container justify="center">
            <Grid item className={classes.card}>
               <Link to="/account" className={classes.link}>
                  <Compte width="25vw" height="25vh" title="Compte" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Compte
                  </Typography>
               </Link>
            </Grid>
            <Grid item className={classes.card}>
               <Link to="/settings" className={classes.link}>
                  <Settings width="25vw" height="25vh" title="Admin" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Admin
                  </Typography>
               </Link>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default HomePage;
