import React, { useRef } from "react";
import { Grid, DialogTitle, TextField, Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";
import { motion } from "framer-motion";
import FadeIn from "../Transitions/FadeIn";
import signIn from "../../images/signIn.svg";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         minHeight: "70vh",
         padding: "15px",
      },
      sideBar: {
         background: "linear-gradient(to right, #457fca, #5691c8)",
         color: "white",
         height: "100%",
         backgroundImage: `url(${signIn})`,
         backgroundSize: "contain",
         backgroundRepeat: "no-repeat",
         backgroundPosition: "center center",
      },
   })
);

interface SignInProps {
   onSignUp: () => void;
   onClose: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignUp, onClose }) => {
   const classes = useStyles();

   const email = useRef("");
   const password = useRef("");

   // #region Animation

   const sideBarVariants = {
      hidden: { opacity: 0, x: -100 },
      show: {
         y: 0,
         x: 0,
         opacity: 1,
         transition: { delay: 0.2, duration: 0.4, ease: "easeInOut" },
      },
   };

   // #endregion

   const onBlur = (event: any, ref: React.MutableRefObject<string>): void => {
      ref.current = event.target.value;
   };

   const onSignIn = (): void => {
      firebase
         .auth()
         .setPersistence(firebase.auth.Auth.Persistence.SESSION)
         .then(async () => {
            await firebase.auth().signInWithEmailAndPassword(email.current, password.current);
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
                     <TextField variant="outlined" label="Adresse e-mail" onBlur={e => onBlur(e, email)} />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.6}>
                     <TextField
                        variant="outlined"
                        label="Mot de passe"
                        onBlur={e => onBlur(e, password)}
                        type="password"
                     />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.7}>
                     <Button variant="outlined" onClick={() => onSignIn()}>
                        Connexion
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
