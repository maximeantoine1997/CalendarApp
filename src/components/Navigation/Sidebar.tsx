import { AppBar, createStyles, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Authentification from "./Authentification";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      link: {
         color: "black",
         font: "Roboto",
         fontSize: "20px",
         textDecoration: "none",
      },
      list: {
         width: "25vw",
         height: "100vh",
      },
      listItem: { padding: "30px" },
      buttonText: { paddingLeft: "10px" },
      menu: {
         padding: "0px",
         width: "100%",
         height: "5vh",
         borderBottom: "1px solid black",
      },
      menuButton: {
         marginRight: theme.spacing(2),
      },
      title: {
         flexGrow: 1,
         textDecoration: "none",
         color: "black",
      },
      nav: {
         background: "white",
         color: "black",
      },
      profileMenu: {
         marginTop: "50px",
      },
   })
);

const SideBar: React.FC = () => {
   const classes = useStyles();

   return (
      <>
         <AppBar position="sticky" className={classes.nav}>
            <Toolbar>
               <Typography variant="h6" className={classes.title}>
                  <Link to="/" className={classes.title}>
                     Agenda Antoine SPRL
                  </Link>
               </Typography>
               <Authentification />
            </Toolbar>
         </AppBar>
      </>
   );
};

export default SideBar;
