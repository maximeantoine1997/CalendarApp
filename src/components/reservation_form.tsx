import React, { useRef, MutableRefObject, useState } from "react";
import { Grid, Typography, makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import TextComponent from "./FormElements/TextComponent";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import DateComponent from "components/FormElements/DateComponent";
import EuroComponent from "components/FormElements/EuroComponent";
import CheckBoxComponent from "components/FormElements/CheckboxComponent";

export interface FormProps {
   id?: string;
}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         height: "100%",
         width: "80%",
         paddingTop: "0%",
      },
      submit: {
         width: "80%",
         marginLeft: "10%",
         marginRight: "10%",
         marginTop: "2%",
         marginBottom: "2%",
         height: "7vh",
         borderRadius: "25px",
         background: "linear-gradient(to right, #606c88, #3f4c6b)",
         color: "white",
      },
   })
);

interface Reservation {
   societe: string;
   modele: string;
   accessoires: Array<string>;
   gsm: string;
   email: string;
   prenom: string;
   nom: string;
   address: string;
   duree: string;
   montant?: number;
   isBancontact?: boolean;
}

const ReservationForm = (props: FormProps) => {
   const classes = useStyles();

   // #region  useRef
   const prenom = useRef<string>("");
   const nom = useRef<string>("");
   const societe = useRef<string>("");
   const modele = useRef<string>("");
   const accessoires = useRef<Array<string>>([]);
   const gsm = useRef<string>("");
   const email = useRef<string>("");
   const address = useRef<string>("");
   const startDate = useRef<MaterialUiPickersDate>();
   const endDate = useRef<MaterialUiPickersDate>();
   const montant = useRef<number>();
   const isBancontact = useRef<boolean>(false);
   const isReceived = useRef<boolean>(false);
   // #endregion

   const [hasEndDate, setHasEndDate] = useState<boolean>(false);
   const onChange = (ref: MutableRefObject<any>, newValue: any) => {
      ref.current = newValue;
   };

   return (
      <Grid
         container
         className={classes.container}
         spacing={0}
         direction="row"
         alignItems="center"
         justify="center"
         alignContent="center"
      >
         <Grid item xs={6}>
            <Typography variant="h4" align="center">
               Machine
            </Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography variant="h4" align="center">
               Info
            </Typography>
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Modèle" onChange={e => onChange(modele, e)} />
         </Grid>
         <Grid item xs={6}>
            <EuroComponent placeholder="Montant" onChange={e => onChange(montant, e)} />
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Accessoires" onChange={e => onChange(accessoires, e)} multiple />
         </Grid>
         <Grid item xs={6}>
            <CheckBoxComponent placeholder="Par Bancontact" onChange={e => onChange(isBancontact, e)} />
            <CheckBoxComponent placeholder="Reçu" onChange={e => onChange(isReceived, e)} />
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h4" align="center">
               Chantier
            </Typography>
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Société" onChange={e => onChange(societe, e)} url="Companies" sortBy="Name" />
         </Grid>
         <Grid item xs={12}>
            <TextComponent placeholder="Adresse" onChange={e => onChange(address, e)} />
         </Grid>
         <Grid item xs={6} style={{ minHeight: "10vh" }}>
            <DateComponent placeholder="Début" onChange={e => onChange(startDate, e)} />
         </Grid>
         <Grid item xs={6}>
            <Grid container justify="center" style={{ minHeight: "10vh" }}>
               {hasEndDate && (
                  <Grid item xs={6}>
                     <DateComponent placeholder="Fin" onChange={e => onChange(endDate, e)} />
                  </Grid>
               )}
               <Grid item xs={hasEndDate ? 6 : 12}>
                  <CheckBoxComponent placeholder="Date de fin" onChange={e => setHasEndDate(e)} />
               </Grid>
            </Grid>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h4" align="center">
               Client
            </Typography>
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Nom" onChange={e => onChange(nom, e)} />
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Prénom" onChange={e => onChange(prenom, e)} />
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Téléphone" onChange={e => onChange(gsm, e)} />
         </Grid>
         <Grid item xs={6}>
            <TextComponent placeholder="Email" onChange={e => onChange(email, e)} />
         </Grid>
         <Grid item xs={12}>
            <Button variant="contained" className={classes.submit}>
               <Typography variant="h6">Reserver</Typography>
            </Button>
         </Grid>
      </Grid>
   );
};

export default ReservationForm;
