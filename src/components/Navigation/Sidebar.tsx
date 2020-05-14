import {
   AppBar,
   createStyles,
   Drawer,
   IconButton,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   makeStyles,
   Theme,
   Toolbar,
   Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddIcon from "@material-ui/icons/Add";
import EventNoteIcon from "@material-ui/icons/EventNote";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
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
         color: "white",
      },
      nav: {
         background: "#16181F",
         color: "white",
      },
      profileMenu: {
         marginTop: "50px",
      },
   })
);

const SideBar: React.FC = () => {
   const classes = useStyles();

   const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

   const toggleDrawer = (value: boolean) => {
      setIsOpenDrawer(value);
   };

   return (
      <>
         <AppBar position="sticky" className={classes.nav}>
            <Toolbar>
               <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={() => toggleDrawer(true)}
               >
                  <MenuIcon />
               </IconButton>
               <Typography variant="h6" className={classes.title}>
                  <Link to="/" className={classes.title}>
                     Agenda Antoine SPRL
                  </Link>
               </Typography>
               <Authentification />
            </Toolbar>
         </AppBar>
         <Drawer anchor="left" open={isOpenDrawer} onClose={() => toggleDrawer(false)}>
            <List component="nav" aria-label="navigation menu" className={classes.list}>
               <Link to="/account" className={classes.link} onClick={() => toggleDrawer(false)}>
                  <ListItem button dense className={classes.listItem}>
                     <ListItemIcon>
                        <AccountCircleIcon fontSize="large" />
                     </ListItemIcon>
                     <ListItemText>
                        <Typography variant="h6">Mon Compte</Typography>
                     </ListItemText>
                  </ListItem>
               </Link>
               <Link to="/calendrier" className={classes.link} onClick={() => toggleDrawer(false)}>
                  <ListItem button dense className={classes.listItem}>
                     <ListItemIcon>
                        <EventNoteIcon fontSize="large" />
                     </ListItemIcon>
                     <ListItemText>
                        <Typography variant="h6">Calendrier</Typography>
                     </ListItemText>
                  </ListItem>
               </Link>
               <Link to="/reservation" className={classes.link} onClick={() => toggleDrawer(false)}>
                  <ListItem button dense className={classes.listItem}>
                     <ListItemIcon>
                        <AddIcon fontSize="large" />
                     </ListItemIcon>
                     <ListItemText>
                        <Typography variant="h6">Reservation</Typography>
                     </ListItemText>
                  </ListItem>
               </Link>
            </List>
         </Drawer>
      </>
   );
};

export default SideBar;
