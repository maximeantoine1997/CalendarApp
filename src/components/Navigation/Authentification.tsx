import { makeStyles, Theme, createStyles, Button, Avatar, Menu, MenuItem, Dialog } from "@material-ui/core";
import React, { useState } from "react";
import useUserContext from "Contexts/UserContext";
import SignIn from "components/Navigation/SignIn";
import SignUp from "components/Navigation/SignUp";
import firebase from "firebase";
import { isFunction } from "Utils";
import { motion } from "framer-motion";
import FadeIn from "components/Transitions/FadeIn";

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
   })
);

interface AuthProps {}

const Authentification: React.FC<AuthProps> = () => {
   const classes = useStyles();

   const { user, setUser } = useUserContext();

   const initial = user?.displayName?.charAt(0).toUpperCase();

   const [openSignUp, setOpenSignUp] = useState<boolean>(false);

   const [isOpenAuth, setIsOpenAuth] = useState<boolean>(false);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const signOut = () => {
      firebase.auth().signOut();
      if (isFunction(setUser)) setUser(null);
   };

   const toggleAuth = (value: boolean) => {
      setIsOpenAuth(value);
   };

   if (user && initial) {
      return (
         <>
            <FadeIn open={Boolean(user)}>
               <Button variant="text" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <Avatar alt="User Avatar">{initial}</Avatar>
               </Button>
               <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className={classes.profileMenu}
               >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={signOut}>Se Déconnecter</MenuItem>
               </Menu>
            </FadeIn>
         </>
      );
   }
   if (isOpenAuth) {
      if (openSignUp) {
         return (
            <Dialog open={isOpenAuth} fullWidth onClose={() => setIsOpenAuth(false)}>
               <SignUp onSignIn={() => setOpenSignUp(false)} onClose={() => setIsOpenAuth(false)} />
            </Dialog>
         );
      }
      return (
         <Dialog open={isOpenAuth} fullWidth onClose={() => setIsOpenAuth(false)}>
            <SignIn onSignUp={() => setOpenSignUp(true)} onClose={() => setIsOpenAuth(false)} />
         </Dialog>
      );
   }

   if (user === null) {
      return (
         <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 1 }}>
            <Button
               onClick={() => {
                  toggleAuth(true);
               }}
               className={classes.menuButton}
            >
               Se Connecter
            </Button>
         </motion.div>
      );
   }

   return <></>;
};

export default Authentification;
