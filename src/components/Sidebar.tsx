import {
   Drawer,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   Typography,
   Button,
   makeStyles,
   Theme,
   createStyles,
   AppBar,
   Toolbar,
   IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventNoteIcon from "@material-ui/icons/EventNote";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

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
      },
      nav: {
         background: "linear-gradient(to right, #606c88, #3f4c6b)",
         color: "white",
      },
   })
);

const SideBar: React.FC = () => {
   const classes = useStyles();

   const [isOpen, setIsOpen] = useState<boolean>(false);

   const toggleDrawer = (value: boolean) => {
      setIsOpen(value);
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
                  Calendrier Antoine SPRL
               </Typography>
               <Button color="inherit">Login</Button>
            </Toolbar>
         </AppBar>
         <Drawer anchor="left" open={isOpen} onClose={() => toggleDrawer(false)}>
            <Button onClick={() => toggleDrawer(false)}>
               <CloseIcon fontSize="large" />
               <Typography variant="h6" className={classes.buttonText}>
                  Fermer
               </Typography>
            </Button>
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
