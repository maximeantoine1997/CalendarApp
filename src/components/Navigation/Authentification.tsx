import { Avatar, Button, createStyles, makeStyles, Menu, MenuItem, Theme } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useUserContext from "../../Contexts/UserContext";
import FadeIn from "../Transitions/FadeIn";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      link: {
         color: "black",
         font: "Roboto",
         fontSize: "20px",
         textDecoration: "none",
      },
      menuLink: {
         color: "black",
         font: "Roboto",
         fontSize: "16px",
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
         color: "white",
      },
      title: {
         flexGrow: 1,
      },
      nav: {
         background: "linear-gradient(to right, #606c88, #3f4c6b)",
         color: "white",
      },
      profileMenu: {
         marginTop: "50px",
      },
      avatar: {
         background: "#EB4969",
      },
   })
);

interface AuthProps {}

const Authentification: React.FC<AuthProps> = () => {
   const classes = useStyles();

   const { user, setUser } = useUserContext();

   const initial = user?.displayName?.charAt(0).toUpperCase();

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const signOut = () => {
      localStorage.removeItem("authUser");
      firebase.auth().signOut();
      setUser(null);
   };

   if (user && initial) {
      return (
         <>
            <FadeIn open={Boolean(user)}>
               <Button variant="text" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <Avatar alt="User Avatar" className={classes.avatar}>
                     {initial}
                  </Avatar>
               </Button>
               <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className={classes.profileMenu}
               >
                  <MenuItem onClick={handleClose}>
                     <Link to="/account" className={classes.menuLink}>
                        Mon Profil
                     </Link>
                  </MenuItem>
                  <MenuItem onClick={signOut} className={classes.menuLink}>
                     Se Déconnecter
                  </MenuItem>
               </Menu>
            </FadeIn>
         </>
      );
   }

   return <></>;
};

export default Authentification;
