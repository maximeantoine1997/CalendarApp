import React from "react";
import { makeStyles, createStyles, Grid, Typography } from "@material-ui/core";
import { ReactComponent as Calendar } from "../images/calendar.svg";
import { ReactComponent as Reservation } from "../images/reservation.svg";
import { ReactComponent as Compte } from "../images/compte.svg";
import { ReactComponent as Question } from "../images/question.svg";
import { Link } from "react-router-dom";

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
            <Grid item direction="column" className={classes.card}>
               <Link to="/calendrier" className={classes.link}>
                  <Calendar width="25vw" height="25vh" title="Calendrier" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Calendrier
                  </Typography>
               </Link>
            </Grid>
            <Grid item direction="column" className={classes.card}>
               <Link to="/reservation" className={classes.link}>
                  <Reservation width="25vw" height="25vh" title="Reservation" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Reservation
                  </Typography>
               </Link>
            </Grid>
         </Grid>
         <Grid container justify="center">
            <Grid item direction="column" className={classes.card}>
               <Link to="/account" className={classes.link}>
                  <Compte width="25vw" height="25vh" title="Compte" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Compte
                  </Typography>
               </Link>
            </Grid>
            <Grid item direction="column" className={classes.card}>
               <Link to="/" className={classes.link}>
                  <Question width="25vw" height="25vh" title="Calendrier" className={classes.picture} />
                  <Typography className={classes.title} align="center">
                     Questions
                  </Typography>
               </Link>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default HomePage;
