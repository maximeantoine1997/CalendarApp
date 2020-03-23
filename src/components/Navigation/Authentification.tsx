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
} from "@material-ui/core";
import React, { useRef } from "react";
import firebase from "firebase";
import { signInFirebase } from "Firebase/Firebase.Utils";

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

interface AuthProps {
   onToggle: (value: boolean) => void;
   open: boolean;
}

const Authentification: React.FC<AuthProps> = ({ onToggle, open }) => {
   const classes = useStyles();

   const email = useRef("");
   const password = useRef("");

   const onBlur = (event: any, ref: React.MutableRefObject<string>): void => {
      ref.current = event.target.value;
   };

   const onSignUp = (): void => {
      console.log(`Sign Up => email is: ${email.current} & password is: ${password.current}`);
      firebase
         .auth()
         .createUserWithEmailAndPassword(email.current, password.current)
         .catch(error => {
            // Handle Errors here.
            // const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
            // ...
         });
      onToggle(false);
   };

   const onSignIn = (): void => {
      console.log(`Sign In => email is: ${email.current} & password is: ${password.current}`);
      signInFirebase(email, password);
      onToggle(false);
   };

   return (
      <Dialog open={open} fullWidth onClose={() => onToggle(false)}>
         <DialogTitle id="simple-dialog-title">Se Connecter</DialogTitle>
         <DialogContent>
            <Typography variant="h6">Sign In</Typography>
            <TextField variant="outlined" label="email" onBlur={e => onBlur(e, email)} />
            <TextField variant="outlined" label="password" onBlur={e => onBlur(e, password)} />
            <Button variant="contained" onClick={() => onSignUp()}>
               Sign up
            </Button>
            <Button variant="contained" onClick={() => onSignIn()}>
               Sign In
            </Button>
         </DialogContent>
      </Dialog>
   );
};

export default Authentification;
