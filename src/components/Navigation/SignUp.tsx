import React, { useRef } from "react";
import { Grid, DialogTitle, TextField, Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";
import { motion } from "framer-motion";
import FadeIn from "../Transitions/FadeIn";
import signUp from "../../images/signup.svg";

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
         backgroundImage: `url(${signUp})`,
         backgroundSize: "contain",
         backgroundRepeat: "no-repeat",
         backgroundPosition: "center center",
      },
   })
);

interface SignUpProps {
   onSignIn: () => void;
   onClose: (value: boolean) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignIn, onClose }) => {
   const classes = useStyles();

   const userName = useRef("");
   const email = useRef("florian@antoinesprl.be");
   const password = useRef("123456");
   const confirmPassword = useRef("123456");

   // #region Animation

   const sideBarVariants = {
      hidden: { opacity: 0, x: 100 },
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

   const onSignUp = (): void => {
      firebase
         .auth()
         .createUserWithEmailAndPassword(email.current, password.current)
         .then(value => {
            value.user
               ?.updateProfile({
                  displayName: userName.current,
               })
               .then()
               .catch(error => console.error(error));
         })
         .catch(error => {
            const errorMessage = error.message;
            console.error(errorMessage);
         });
      onClose(false);
   };
   return (
      <Grid container className={classes.root}>
         <Grid item xs={7}>
            <Grid
               container
               direction="column"
               alignItems="center"
               justify="center"
               spacing={3}
               style={{ minHeight: "65vh" }}
            >
               <FadeIn transitionDelay={0.4}>
                  <DialogTitle id="simple-dialog-title">S'inscrire</DialogTitle>
               </FadeIn>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.5}>
                     <TextField variant="outlined" label="Nom d'utilisateur" onBlur={e => onBlur(e, userName)} />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.6}>
                     <TextField variant="outlined" label="Adresse e-mail" onBlur={e => onBlur(e, email)} />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.7}>
                     <TextField
                        variant="outlined"
                        type="password"
                        label="Mot de passe"
                        onBlur={e => onBlur(e, password)}
                     />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.8}>
                     <TextField
                        variant="outlined"
                        type="password"
                        label="Confirmer mot de passe"
                        onBlur={e => onBlur(e, confirmPassword)}
                     />
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={0.9}>
                     <Button variant="outlined" onClick={() => onSignUp()}>
                        S'inscrire
                     </Button>
                  </FadeIn>
               </Grid>
               <Grid item xs={12}>
                  <FadeIn transitionDelay={1}>
                     <Button variant="text" onClick={onSignIn}>
                        Déjà membre? Connectez-vous!
                     </Button>
                  </FadeIn>
               </Grid>
            </Grid>
         </Grid>
         <Grid item xs={5}>
            <motion.div
               animate={"show"}
               initial="hidden"
               variants={sideBarVariants}
               exit="hidden"
               className={classes.sideBar}
            ></motion.div>
         </Grid>
      </Grid>
   );
};

export default SignUp;
