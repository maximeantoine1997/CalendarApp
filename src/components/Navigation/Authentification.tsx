import {
   makeStyles,
   Theme,
   createStyles,
   Dialog,
   DialogTitle,
   DialogContent,
   Typography,
   TextField,
   Button,
   Avatar,
   Menu,
   MenuItem,
} from "@material-ui/core";
import React, { useRef, useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import useUserContext from "Contexts/UserContext";

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
      profileMenu: {
         marginTop: "50px",
      },
   })
);

interface AuthProps {}

const Authentification: React.FC<AuthProps> = () => {
   console.log("Auth component rendering");

   const classes = useStyles();

   const email = useRef("florian@antoinesprl.be");
   const password = useRef("123456");
   const userName = useRef("");

   const [isOpenAuth, setIsOpenAuth] = useState<boolean>(false);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const onSignUp = (): void => {
      console.log(`Sign Up => email is: ${email.current} & password is: ${password.current}`);
      firebase
         .auth()
         .createUserWithEmailAndPassword(email.current, password.current)
         .then(value => {
            value.user
               ?.updateProfile({
                  displayName: userName.current,
               })
               .then(() => console.log("it worked"))
               .catch(error => console.error(error));
         })
         .catch(error => {
            const errorMessage = error.message;
            console.error(errorMessage);
         });
      setIsOpenAuth(false);
   };

   const onSignIn = (): void => {
      console.log(`Sign In => email is: ${email.current} & password is: ${password.current}`);
      firebase
         .auth()
         .setPersistence(firebase.auth.Auth.Persistence.SESSION)
         .then(async () => {
            await firebase.auth().signInWithEmailAndPassword(email.current, password.current);
            console.log("signed in");
            setIsOpenAuth(false);
         })
         .catch(error => {
            var errorMessage = error.message;
            console.error(errorMessage);
         });
   };

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const toggleAuth = (value: boolean) => {
      setIsOpenAuth(value);
   };

   const onBlur = (event: any, ref: React.MutableRefObject<string>): void => {
      ref.current = event.target.value;
   };

   useEffect(() => {
      console.log("render");
   }, []);

   const { user } = useUserContext();
   const initial = user?.displayName?.charAt(0).toUpperCase();
   if (user && initial) {
      return (
         <>
            <Button variant="text" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
               <Avatar alt="User Avatar">{initial}</Avatar>
            </Button>
            <Menu
               id="simple-menu"
               anchorEl={anchorEl}
               keepMounted
               open={Boolean(anchorEl)}
               onClose={handleClose}
               className={classes.profileMenu}
            >
               <MenuItem onClick={handleClose}>Profile</MenuItem>
               <MenuItem onClick={handleClose}>Se Déconnecter</MenuItem>
            </Menu>
         </>
      );
   }
   if (isOpenAuth) {
      return (
         <Dialog open={isOpenAuth} fullWidth onClose={() => setIsOpenAuth(false)}>
            <DialogTitle id="simple-dialog-title">Se Connecter</DialogTitle>
            <DialogContent>
               <Typography variant="h6">Sign In</Typography>
               <TextField variant="outlined" label="email" onBlur={e => onBlur(e, email)} />
               <TextField variant="outlined" label="password" onBlur={e => onBlur(e, password)} />
               <TextField variant="outlined" label="username" onBlur={e => onBlur(e, userName)} />
               <Button variant="contained" onClick={() => onSignUp()}>
                  Sign up
               </Button>
               <Button variant="contained" onClick={() => onSignIn()}>
                  Sign In
               </Button>
            </DialogContent>
         </Dialog>
      );
   }

   if (user === null) {
      return (
         <Button
            color="inherit"
            onClick={() => {
               toggleAuth(true);
            }}
         >
            Se Connecter
         </Button>
      );
   }

   return <></>;
};

export default Authentification;
