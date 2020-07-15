import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box/Box";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EventNoteIcon from "@material-ui/icons/EventNote";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import home from "../images/home.svg";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "3vh",
         background: `url(${home})`,
      },
      card: {
         "minWidth": "200px",
         "border": "1px solid #EDEBEC",
         "borderRadius": "10px",
         "padding": "20px",
         "margin": "20px",
         "cursor": "pointer",
         "transition": "0.3s",
         "background": "white",
         "&:hover": {
            transition: "0.3s",
            background: "#f2f2f2",
         },
      },
      picture: {
         paddingBottom: "25px",
      },
      title: {
         fontSize: "1.5em",
         fontFamily: "Arial ",
         color: "black",
      },
      link: {
         textDecoration: "none",
      },
   })
);

const HomePage = () => {
   const classes = useStyles();

   const createCard = (link: string, title: string, icon?: ReactNode): ReactNode => {
      return (
         <Link to={link} className={classes.link}>
            <Box boxShadow={3} className={classes.card}>
               <Grid container direction="column" justify="center" alignItems="center">
                  {icon || null}
                  <Typography className={classes.title} align="center">
                     {title}
                  </Typography>
               </Grid>
            </Box>
         </Link>
      );
   };

   return (
      <Grid container alignContent="center" className={classes.grid}>
         <Grid container justify="center">
            <Grid item>
               {createCard("/calendrier", "Calendrier", <EventNoteIcon color="primary" fontSize="large" />)}
            </Grid>
            <Grid item>
               {createCard("/reservation", "Reservation", <AddCircleOutlineIcon color="primary" fontSize="large" />)}
            </Grid>
            <Grid item>
               {createCard("/settings", "Admin", <SupervisorAccountIcon color="primary" fontSize="large" />)}
            </Grid>
         </Grid>
         <Grid container justify="center"></Grid>
      </Grid>
   );
};

export default HomePage;
