import { Button, createStyles, DialogTitle, Grid, makeStyles, TextField, Theme } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useRef } from "react";
import FadeIn from "../../components/Transitions/FadeIn";
import { createUserAsync } from "../../Firebase/Firebase.Utils";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         minHeight: "100vh",
         padding: "10%",
      },
   })
);

interface SignUpProps {
   onChange: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onChange }) => {
   const classes = useStyles();
   const { enqueueSnackbar } = useSnackbar();
   const userName = useRef("");
   const email = useRef("");
   const password = useRef("");
   const confirmPassword = useRef("");

   const onBlur = (event: any, ref: React.MutableRefObject<string>): void => {
      ref.current = event.target.value;
   };

   const onSignUp = async (): Promise<void> => {
      if (password.current !== confirmPassword.current) {
         console.log("passwords are not the same, please make it happen");
         return;
      }
      const isCreated = await createUserAsync(email.current, password.current, userName.current);
      if (isCreated) {
         enqueueSnackbar("Compte créé", { variant: "success" });
      } else {
         enqueueSnackbar("Une erreur s'est produite", { variant: "error" });
      }
   };
   return (
      <Grid container className={classes.root} justify="center">
         <Grid item>
            <Grid container direction="column" alignItems="center" justify="center" spacing={3}>
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
                     <Button variant="text" onClick={onChange}>
                        Déjà membre? Connectez-vous!
                     </Button>
                  </FadeIn>
               </Grid>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default SignUp;
