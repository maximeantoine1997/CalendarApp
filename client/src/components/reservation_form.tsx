import React, { useState } from "react";
import { Box, makeStyles, Theme, createStyles, Grid, Typography } from "@material-ui/core";
import TextComponent from "./form_elements/text-component";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

export interface FormProps {
   id?: string;
}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         "& > *": {
            margin: theme.spacing(1),
            width: 200,
         },
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

const Reservation_Form = (props: FormProps) => {
   const classes = useStyles();

   const [prenom, setPrenom] = useState<string>();
   const [nom, setNom] = useState<string>();
   const [societe, setSociete] = useState<string>();
   const [modele, setModele] = useState<string>();
   const [accessoires, setAccessoires] = useState<Array<string>>();
   const [gsm, setGsm] = useState<string>();
   const [email, setEmail] = useState<string>();
   const [address, setAddress] = useState<string>();
   const [startDate, setStartDate] = useState<MaterialUiPickersDate>();
   const [endDate, setEndDate] = useState<MaterialUiPickersDate>();
   const [montant, setMontant] = useState<number>();
   const [isBancontact, setIsBancontact] = useState<boolean>(false);

   return (
      <Box paddingX="100px" paddingY="20px" height="100%">
         <Grid container alignItems="center" justify="space-evenly">
            <Grid item xs={12}>
               <Typography variant="h4">Client</Typography>
            </Grid>
            <Grid item xs={6}>
               <TextComponent placeholder="Nom" onChange={e => setNom(e)} />
            </Grid>
            <Grid item xs={6}>
               <TextComponent placeholder="Prénom" onChange={e => setPrenom(e)} />
            </Grid>
            <Grid item xs={6}>
               <TextComponent placeholder="Prénom" onChange={e => setSociete(e)} />
            </Grid>
            <Grid item xs={6}>
               <TextComponent placeholder="Prénom" onChange={e => setSociete(e)} />
            </Grid>
         </Grid>
      </Box>
   );
};

export default Reservation_Form;
