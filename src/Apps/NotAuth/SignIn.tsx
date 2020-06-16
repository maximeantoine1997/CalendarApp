import { Button, createStyles, DialogTitle, Grid, makeStyles, TextField, Theme } from "@material-ui/core";
import "firebase/auth";
import React, { useRef } from "react";
import FadeIn from "../../components/Transitions/FadeIn";
import useUserContext from "../../Contexts/UserContext";
import { Account, Fauna, FDBLogin } from "../../FaunaDB/Api";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         minHeight: "100vh",
         padding: "5%",
      },
   })
);

interface SignInProps {
   onChange: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onChange }) => {
   const classes = useStyles();
   const { setUser } = useUserContext();

   const email = useRef("");
   const password = useRef("");

   const onBlur = (event: any, ref: React.MutableRefObject<string>): void => {
      ref.current = event.target.value;
   };

   const onSignIn = async (): Promise<void> => {
      const user = await FDBLogin(email.current, password.current);
      localStorage.setItem("authUser", JSON.stringify(user));
      setUser(user as Fauna<Account>);
   };
   return (
      <Grid container className={classes.root} justify="center" style={{ border: "1px solid black" }}>
         <Grid item>
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
                  <Button variant="text" onClick={onChange}>
                     Pas encore de compte? Inscrivez-vous!
                  </Button>
               </FadeIn>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default SignIn;
