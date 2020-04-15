import { Button, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";

import moment, { Moment } from "moment";
import React, { MutableRefObject, useRef, useState } from "react";
import TextComponent from "./FormElements/TextComponent";
import EuroComponent from "./FormElements/EuroComponent";
import CheckBoxComponent from "./FormElements/CheckboxComponent";
import DateComponent from "./FormElements/DateComponent";
import { addReservationAsync } from "../Firebase/Firebase.Utils";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         height: "100%",
         width: "80%",
         paddingTop: "0%",
      },
      submit: {
         width: "60%",
         marginLeft: "20%",
         marginRight: "20%",
         marginTop: "2%",
         marginBottom: "2%",
         height: "7vh",
         borderRadius: "25px",
         background: "#EB4969",
         color: "white",
      },
      errorText: {
         paddingLeft: "10%",
         paddingRight: "10%",
         width: "80%",
         color: "red",
      },
   })
);

const initValidForm = {
   societe: {
      hasError: false,
      errorMessage: "",
   },
   modele: {
      hasError: false,
      errorMessage: "",
   },
   accessoires: {
      hasError: false,
      errorMessage: "",
   },
   gsm: {
      hasError: false,
      errorMessage: "",
   },
   email: {
      hasError: false,
      errorMessage: "",
   },
   prenom: {
      hasError: false,
      errorMessage: "",
   },
   nom: {
      hasError: false,
      errorMessage: "",
   },
   address: {
      hasError: false,
      errorMessage: "",
   },
   startDate: {
      hasError: false,
      errorMessage: "",
   },
   endDate: {
      hasError: false,
      errorMessage: "",
   },
   montant: {
      hasError: false,
      errorMessage: "",
   },
};

export interface FormProps {
   id?: string;
   onChange?: (newValue: any) => void;
}

interface ValidReservation {
   [key: string]: {
      hasError: boolean;
      errorMessage: string;
   };
}

export interface Reservation {
   id?: string;
   prenom: string;
   nom: string;
   societe: string;
   modele: string;
   accessoires: Array<string>;
   gsm: string;
   email: string;
   address: string;
   startDate: Moment;
   endDate?: Moment;
   montant: number;
   isBancontact: boolean;
   isReceived: boolean;
   reservationNumber?: string;
}

const ReservationForm: React.FC<FormProps> = ({ onChange: onChange_ }) => {
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
   const startDate = useRef<Moment>(moment());
   const endDate = useRef<Moment>();
   const montant = useRef<number>(0);
   const isBancontact = useRef<boolean>(false);
   const isReceived = useRef<boolean>(false);
   // #endregion

   const [validForm, setValidForm] = useState<ValidReservation>(initValidForm);

   const [hasEndDate, setHasEndDate] = useState<boolean>(false);
   const onChange = (ref: MutableRefObject<any>, newValue: any) => {
      ref.current = newValue;
   };

   const addReservation = (reservation: Reservation): void => {
      addReservationAsync(reservation);
   };

   /**
    * Checks if the form is valid. Validation logic is here.
    */
   const onSubmit = () => {
      let newValidForm: ValidReservation = {
         societe: {
            hasError: false,
            errorMessage: "",
         },
         modele: {
            hasError: false,
            errorMessage: "",
         },
         accessoires: {
            hasError: false,
            errorMessage: "",
         },
         gsm: {
            hasError: false,
            errorMessage: "",
         },
         email: {
            hasError: false,
            errorMessage: "",
         },
         prenom: {
            hasError: false,
            errorMessage: "",
         },
         nom: {
            hasError: false,
            errorMessage: "",
         },
         address: {
            hasError: false,
            errorMessage: "",
         },
         startDate: {
            hasError: false,
            errorMessage: "",
         },
         endDate: {
            hasError: false,
            errorMessage: "",
         },
         montant: {
            hasError: false,
            errorMessage: "",
         },
      };

      const updateForm = (type: string, hasError: boolean, errorMessage: string) => {
         newValidForm[type].hasError = hasError;
         newValidForm[type].errorMessage = errorMessage;
      };

      // #region errors
      // Prenom
      if (prenom.current.length < 1) {
         updateForm("prenom", true, "Au moins un caractère");
      }
      // Nom;
      if (nom.current.length < 1) {
         updateForm("nom", true, "Au moins un caractère");
      }
      // Societe
      if (societe.current.length < 1) {
         updateForm("societe", true, "Au moins un caractère");
      }
      // Modele
      if (modele.current.length < 1) {
         updateForm("modele", true, "Veuillez rentrer un modèle");
      }
      // Gsm
      if (gsm.current.length < 1) {
         updateForm("gsm", true, "Au moins un numéro");
      }
      // Email
      if (email.current.length < 1) {
         updateForm("email", true, "Veuillez rentrer un email valide");
      }
      // Address
      if (address.current.length < 1) {
         updateForm("address", true, "Au moins un caractère");
      }
      // startDate & endDate
      if (endDate.current && !startDate.current?.isSameOrBefore(endDate.current, "day")) {
         updateForm(
            "startDate",
            true,
            "la date de fin ne peut pas être avant celle du début, veuillez ajuster en conséquence"
         );
      }
      // #endregion

      const hasError = Object.values(newValidForm).find(value => {
         return value.hasError === true;
      });

      if (!hasError) {
         addReservation({
            prenom: prenom.current,
            nom: nom.current,
            societe: societe.current,
            modele: modele.current,
            accessoires: accessoires.current,
            gsm: gsm.current,
            email: email.current,
            address: address.current,
            startDate: startDate.current,
            endDate: endDate.current,
            montant: montant.current,
            isBancontact: isBancontact.current,
            isReceived: isReceived.current,
         });
      }
      setValidForm(newValidForm);
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
            <TextComponent
               hasError={validForm["modele"].hasError}
               errorText={validForm["modele"].errorMessage}
               placeholder="Modèle"
               url="Reservation/Modele"
               onChange={e => onChange(modele, e)}
            />
         </Grid>
         <Grid item xs={6}>
            <EuroComponent placeholder="Montant" onChange={(e: any) => onChange(montant, e)} />
         </Grid>
         <Grid item xs={6}>
            <TextComponent
               hasError={validForm["accessoires"].hasError}
               errorText={validForm["accessoires"].errorMessage}
               placeholder="Accessoires"
               url="Reservation/Accessoires"
               onChange={e => onChange(accessoires, e)}
               multiple
            />
         </Grid>
         <Grid item xs={6}>
            <CheckBoxComponent
               value={isBancontact.current}
               placeholder="Par Bancontact"
               onChange={(e: any) => onChange(isBancontact, e)}
            />
            <CheckBoxComponent
               value={isReceived.current}
               placeholder="Reçu"
               onChange={(e: any) => onChange(isReceived, e)}
            />
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h4" align="center">
               Chantier
            </Typography>
         </Grid>
         <Grid item xs={6}>
            <TextComponent
               hasError={validForm["societe"].hasError}
               errorText={validForm["societe"].errorMessage}
               placeholder="Société"
               onChange={e => onChange(societe, e)}
               url="Reservation/Societe"
            />
         </Grid>
         <Grid item xs={6}></Grid>
         <Grid item xs={12}>
            <TextComponent
               hasError={validForm["address"].hasError}
               errorText={validForm["address"].errorMessage}
               placeholder="Adresse"
               url="Reservation/Address"
               onChange={e => onChange(address, e)}
               customClass={{ paddingLeft: "5%", width: "85%", paddingRight: "10%" }}
            />
         </Grid>
         <Grid item xs={6} style={{ minHeight: "10vh" }}>
            <DateComponent placeholder="Début" onChange={(e: any) => onChange(startDate, e)} />
         </Grid>
         <Grid item xs={6}>
            <Grid container justify="center" style={{ minHeight: "10vh" }}>
               {hasEndDate && (
                  <Grid item xs={6}>
                     <DateComponent placeholder="Fin" onChange={(e: any) => onChange(endDate, e)} />
                  </Grid>
               )}
               <Grid item xs={hasEndDate ? 6 : 12}>
                  <CheckBoxComponent
                     value={hasEndDate}
                     placeholder="Date de fin"
                     onChange={(e: boolean) => {
                        setHasEndDate(e);
                        if (e) {
                           onChange(endDate, moment());
                        } else {
                           onChange(endDate, undefined);
                        }
                     }}
                  />
               </Grid>
            </Grid>
         </Grid>
         <Grid item xs={12}>
            {validForm["startDate"].hasError && (
               <Typography className={classes.errorText} align="center">
                  {validForm["startDate"].errorMessage}
               </Typography>
            )}
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h4" align="center">
               Client
            </Typography>
         </Grid>
         <Grid item xs={6}>
            <TextComponent
               hasError={validForm["nom"].hasError}
               errorText={validForm["nom"].errorMessage}
               placeholder="Nom"
               url="Reservation/Nom"
               onChange={e => onChange(nom, e)}
            />
         </Grid>
         <Grid item xs={6}>
            <TextComponent
               hasError={validForm["prenom"].hasError}
               errorText={validForm["prenom"].errorMessage}
               placeholder="Prénom"
               url="Reservation/Prenom"
               onChange={e => onChange(prenom, e)}
            />
         </Grid>
         <Grid item xs={6}>
            <TextComponent
               hasError={validForm["gsm"].hasError}
               errorText={validForm["gsm"].errorMessage}
               placeholder="Téléphone"
               url="Reservation/Telephone"
               onChange={e => onChange(gsm, e)}
            />
         </Grid>
         <Grid item xs={6}>
            <TextComponent
               hasError={validForm["email"].hasError}
               errorText={validForm["email"].errorMessage}
               placeholder="Email"
               url="Reservation/Email"
               onChange={e => onChange(email, e)}
            />
         </Grid>
         <Grid item xs={12}>
            <Button variant="contained" type="button" className={classes.submit} onClick={e => onSubmit()}>
               <Typography variant="h6">Reserver</Typography>
            </Button>
         </Grid>
      </Grid>
   );
};

export default ReservationForm;
