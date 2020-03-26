import React, { useRef } from "react";
import { Grid, DialogTitle, TextField, Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import * as firebase from "firebase";
import "firebase/auth";
import { motion } from "framer-motion";
import FadeIn from "components/Transitions/FadeIn";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         flexGrow: 1,
         minHeight: "65vh",
      },
      sideBar: {
         background: "linear-gradient(to right, #457fca, #5691c8)",
         color: "white",
         height: "100%",
         width: "100%",
      },
   })
);

interface SignInProps {
   onSignUp: () => void;
   onClose: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignUp, onClose }) => {
   const classes = useStyles();

   const email = useRef("florian@antoinesprl.be");
   const password = useRef("123456");

   // #region Animation

   const sideBarVariants = {
      hidden: { scaleX: 5, scaleY: 2, opacity: 1 },
      show: {
         y: 0,
         x: 0,
         scaleX: 1,
         scaleY: 1,
         transition: { delay: 0.2, duration: 0.4, ease: "easeInOut" },
      },
   };

   // #endregion

   const onBlur = (event: any, ref: React.MutableRefObject<string>): void => {
      ref.current = event.target.value;
   };

   const onSignIn = (): void => {
      console.log(`Sign In => email is: ${email.current} & password is: ${password.current}`);
      firebase
         .auth()
         .setPersistence(firebase.auth.Auth.Persistence.SESSION)
         .then(async () => {
            await firebase.auth().signInWithEmailAndPassword(email.current, password.current);
            console.log("signed in");
            onClose(false);
         })
         .catch(error => {
            var errorMessage = error.message;
            console.error(errorMessage);
         });
   };
   return (
      <Grid container className={classes.root}>
         <Grid item xs={4}>
            <motion.div
               animate={"show"}
               initial="hidden"
               variants={sideBarVariants}
               exit="hidden"
               className={classes.sideBar}
            ></motion.div>
         </Grid>

         <Grid item xs={8}>
            <Grid
               container
               direction="column"
               alignItems="center"
               justify="center"
               spacing={3}
               style={{ minHeight: "65vh" }}
            >
               <FadeIn transitionDelay={0.4}>
                  <DialogTitle id="simple-dialog-title">Se Connecter</DialogTitle>
               </FadeIn>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.5}>
                     <TextField variant="outlined" label="email" onBlur={e => onBlur(e, email)} />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.6}>
                     <TextField variant="outlined" label="password" onBlur={e => onBlur(e, password)} type="password" />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.7}>
                     <Button variant="outlined" onClick={() => onSignIn()}>
                        Sign In
                     </Button>
                  </FadeIn>
               </Grid>
               <FadeIn transitionDelay={0.8}>
                  <Button variant="text" onClick={onSignUp}>
                     Pas encore de compte? Inscrivez-vous!
                  </Button>
               </FadeIn>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default SignIn;
