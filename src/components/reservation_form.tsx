import { Button, createStyles, Grid, makeStyles, Theme, Typography, TextareaAutosize } from "@material-ui/core";
import ArchiveIcon from "@material-ui/icons/Archive";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BusinessIcon from "@material-ui/icons/Business";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import PaymentIcon from "@material-ui/icons/Payment";
import PersonIcon from "@material-ui/icons/Person";
import moment, { Moment } from "moment";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { addReservationAsync, getAutocompleteAsync, updateAutocompleteAsync } from "../Firebase/Firebase.Utils";
import { IHash, ReservationType } from "../Utils";
import CheckBoxComponent from "./FormElements/CheckboxComponent";
import DateComponent from "./FormElements/DateComponent";
import EuroComponent from "./FormElements/EuroComponent";
import SquareButtons from "./FormElements/SquareButton";
import TextComponent from "./FormElements/TextComponent";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         height: "100%",
         width: "80%",
         paddingTop: "0%",
      },
      submit: {
         width: "90%",
         marginTop: "-2%",
         height: "7vh",
         borderRadius: "25px",
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
   startDate: string;
   endDate?: string;
   montant: number;
   isBancontact: boolean;
   isReceived: boolean;
   isCash: boolean;
   reservationNumber?: string;
   type: ReservationType;
}

const ReservationForm: React.FC<FormProps> = ({ onChange: onChange_ }) => {
   const classes = useStyles();
   const history = useHistory();

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
   const isCash = useRef<boolean>(false);
   // #endregion

   const [validForm, setValidForm] = useState<ValidReservation>(initValidForm);
   const [hasEndDate, setHasEndDate] = useState<boolean>(true);
   const [autocomplete, setAutocomplete] = useState<IHash<unknown>>({});
   const newType = true;

   const onChange = (ref: MutableRefObject<any>, newValue: any) => {
      ref.current = newValue;
   };
   const addAutocompleteItem = (docName: string, newItem: unknown) => {
      const items = autocomplete[docName];
      items.push(newItem);
   };
   const addReservation = async (reservation: Reservation): Promise<void> => {
      addAutocompleteItem("prenoms", reservation.prenom);
      addAutocompleteItem("noms", reservation.nom);
      addAutocompleteItem("addresses", reservation.address);
      addAutocompleteItem("emails", reservation.email);
      addAutocompleteItem("gsms", reservation.gsm);
      addAutocompleteItem("modeles", reservation.modele);
      addAutocompleteItem("societes", reservation.societe);
      const items = autocomplete["accessoires"];
      reservation.accessoires.forEach(accessoire => {
         items.push(accessoire);
      });
      updateAutocompleteAsync(autocomplete);
      await addReservationAsync(reservation);
      history.push("/calendrier");
   };

   /**
    * Checks if the form is valid. Validation logic is here.
    */
   const onSubmit = (type: "chercher" | "reserver") => {
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
            startDate: moment(startDate.current).format("YYYY-MM-DD"),
            endDate: moment(endDate.current).format("YYYY-MM-DD"),
            montant: montant.current,
            isBancontact: isBancontact.current,
            isReceived: isReceived.current,
            isCash: isCash.current,
            type: type === "chercher" ? "Client Vient Chercher" : "A Livrer",
         });
      }
      setValidForm(newValidForm);
   };

   useEffect(() => {
      const getAutocomplete = async () => {
         const data = await getAutocompleteAsync();
         setAutocomplete(data);
      };
      getAutocomplete();
   }, []);

   if (!newType) {
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
               <DateComponent placeholder="Début" onChange={(e: any) => onChange(startDate, e)} />
            </Grid>
            <Grid item xs={6}>
               <Grid container justify="center">
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
            <Grid item xs={6}>
               <Typography variant="h4" align="center" style={{ paddingBottom: "2vh" }}>
                  Machine
               </Typography>
            </Grid>
            <Grid item xs={6}>
               <Typography variant="h4" align="center" style={{ paddingBottom: "2vh" }}>
                  Info
               </Typography>
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["modele"].hasError}
                  errorText={validForm["modele"].errorMessage}
                  placeholder="Modèle"
                  options={autocomplete["modeles"] as Array<string>}
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
                  options={autocomplete["accessoires"] as Array<string>}
                  onChange={e => onChange(accessoires, e)}
                  multiple
               />
            </Grid>
            <Grid item xs={6}>
               <CheckBoxComponent
                  value={isReceived.current}
                  placeholder="Cash"
                  onChange={(e: any) => onChange(isCash, e)}
               />
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
               <Typography variant="h4" align="center" style={{ paddingTop: "5vh", paddingBottom: "2vh" }}>
                  Chantier
               </Typography>
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["societe"].hasError}
                  errorText={validForm["societe"].errorMessage}
                  placeholder="Société"
                  onChange={e => onChange(societe, e)}
                  options={autocomplete["societes"] as Array<string>}
               />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
               <TextComponent
                  hasError={validForm["address"].hasError}
                  errorText={validForm["address"].errorMessage}
                  placeholder="Adresse"
                  options={autocomplete["addresses"] as Array<string>}
                  onChange={e => onChange(address, e)}
                  customClass={{ paddingLeft: "5%", width: "85%", paddingRight: "10%" }}
               />
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["societe"].hasError}
                  errorText={validForm["societe"].errorMessage}
                  placeholder="N° de Chantier"
                  onChange={e => onChange(societe, e)}
                  options={autocomplete["societes"] as Array<string>}
               />
            </Grid>
            <Grid item xs={6}></Grid>

            <Grid item xs={12}>
               <Typography variant="h4" align="center" style={{ paddingTop: "5vh", paddingBottom: "2vh" }}>
                  Client
               </Typography>
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["nom"].hasError}
                  errorText={validForm["nom"].errorMessage}
                  placeholder="Nom"
                  options={autocomplete["noms"] as Array<string>}
                  onChange={e => onChange(nom, e)}
               />
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["prenom"].hasError}
                  errorText={validForm["prenom"].errorMessage}
                  placeholder="Prénom"
                  options={autocomplete["prenoms"] as Array<string>}
                  onChange={e => onChange(prenom, e)}
               />
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["gsm"].hasError}
                  errorText={validForm["gsm"].errorMessage}
                  placeholder="Téléphone"
                  options={autocomplete["gsms"] as Array<string>}
                  onChange={e => onChange(gsm, e)}
               />
            </Grid>
            <Grid item xs={6}>
               <TextComponent
                  hasError={validForm["email"].hasError}
                  errorText={validForm["email"].errorMessage}
                  placeholder="Email"
                  options={autocomplete["emails"] as Array<string>}
                  onChange={e => onChange(email, e)}
               />
            </Grid>
            <Grid item xs={12}>
               <Grid container justify="space-evenly">
                  <Button
                     variant="contained"
                     type="button"
                     className={classes.submit}
                     onClick={e => onSubmit("reserver")}
                     style={{ background: "#5FBE7D" }}
                  >
                     <Typography variant="h6">A LIVRER</Typography>
                  </Button>
                  <Button
                     variant="contained"
                     type="button"
                     className={classes.submit}
                     onClick={e => onSubmit("chercher")}
                     style={{ background: "#674F78" }}
                  >
                     <Typography variant="h6">Vient Chercher</Typography>
                  </Button>
               </Grid>
            </Grid>
         </Grid>
      );
   }

   return (
      <Grid container alignContent="flex-start">
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Date:</Typography>
            <DateComponent placeholder="Début" onChange={(e: any) => onChange(startDate, e)} />
            <SquareButtons
               iconLeft={<DoneIcon />}
               iconRight={<ClearIcon />}
               labelLeft="Date de fin"
               labelRight="aucune date"
               value={hasEndDate}
               onClick={value => setHasEndDate(value)}
            />
            {hasEndDate && <DateComponent placeholder="Fin" onChange={(e: any) => onChange(endDate, e)} />}
            <Typography variant="h4" style={{ paddingTop: "25px" }}>
               Caution:
            </Typography>
            <EuroComponent placeholder="Montant" onChange={(e: any) => onChange(montant, e)} />
            <SquareButtons
               iconLeft={<AttachMoneyIcon />}
               iconRight={<PaymentIcon />}
               labelLeft="Cash"
               labelRight="Bancontact"
               value={false}
               onClick={value => console.log(value)}
            />
            <SquareButtons
               iconLeft={<DoneIcon />}
               iconRight={<ClearIcon />}
               labelLeft="Reçu"
               labelRight="Pas Reçu"
               value={false}
               onClick={value => console.log(value)}
            />
         </Grid>
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Machine:</Typography>
            <TextComponent
               hasError={validForm["modele"].hasError}
               errorText={validForm["modele"].errorMessage}
               placeholder="Modèle"
               options={autocomplete["modeles"] as Array<string>}
               onChange={e => onChange(modele, e)}
            />
            <TextComponent
               hasError={validForm["accessoires"].hasError}
               errorText={validForm["accessoires"].errorMessage}
               placeholder="Accessoires"
               options={autocomplete["accessoires"] as Array<string>}
               onChange={e => onChange(accessoires, e)}
               multiple
            />
            <Typography variant="h4" style={{ paddingTop: "25px" }}>
               Chantier:
            </Typography>
            <SquareButtons
               iconLeft={<LocalShippingIcon />}
               iconRight={<ArrowDownwardIcon />}
               labelLeft="A Livrer"
               labelRight="Vient Chercher"
               value={false}
               onClick={value => console.log(value)}
            />
            <TextComponent
               hasError={validForm["societe"].hasError}
               errorText={validForm["societe"].errorMessage}
               placeholder="Rue"
               onChange={e => onChange(societe, e)}
               options={autocomplete["societes"] as Array<string>}
            />
            <Grid container>
               <Grid item xs={4} style={{ paddingRight: "25px" }}>
                  <TextComponent
                     hasError={validForm["societe"].hasError}
                     errorText={validForm["societe"].errorMessage}
                     placeholder="Code Postal"
                     onChange={e => onChange(societe, e)}
                     options={autocomplete["societes"] as Array<string>}
                  />
               </Grid>
               <Grid item xs={8}>
                  <TextComponent
                     hasError={validForm["societe"].hasError}
                     errorText={validForm["societe"].errorMessage}
                     placeholder="Ville"
                     onChange={e => onChange(societe, e)}
                     options={autocomplete["societes"] as Array<string>}
                  />
               </Grid>
            </Grid>
            <TextComponent
               hasError={validForm["societe"].hasError}
               errorText={validForm["societe"].errorMessage}
               placeholder="N° de Chantier"
               onChange={e => onChange(societe, e)}
               options={autocomplete["societes"] as Array<string>}
            />
         </Grid>
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Client:</Typography>
            <SquareButtons
               iconLeft={<PersonIcon />}
               iconRight={<BusinessIcon />}
               labelLeft="Particulier"
               labelRight="Société"
               value={false}
               onClick={value => console.log(value)}
            />
            <SquareButtons
               iconLeft={<ArchiveIcon />}
               iconRight={<ClearIcon />}
               labelLeft="Enregistrer"
               labelRight="Pas Enregistrer"
               value={false}
               onClick={value => console.log(value)}
            />
            <TextComponent
               hasError={validForm["societe"].hasError}
               errorText={validForm["societe"].errorMessage}
               placeholder="Société"
               onChange={e => onChange(societe, e)}
               options={autocomplete["societes"] as Array<string>}
            />
            <Grid container>
               <Grid item xs={6} style={{ paddingRight: "25px" }}>
                  <TextComponent
                     hasError={validForm["nom"].hasError}
                     errorText={validForm["nom"].errorMessage}
                     placeholder="Nom"
                     options={autocomplete["noms"] as Array<string>}
                     onChange={e => onChange(nom, e)}
                  />
               </Grid>
               <Grid item xs={6}>
                  <TextComponent
                     hasError={validForm["prenom"].hasError}
                     errorText={validForm["prenom"].errorMessage}
                     placeholder="Prénom"
                     options={autocomplete["prenoms"] as Array<string>}
                     onChange={e => onChange(prenom, e)}
                  />
               </Grid>
            </Grid>

            <TextComponent
               hasError={validForm["gsm"].hasError}
               errorText={validForm["gsm"].errorMessage}
               placeholder="Téléphone"
               options={autocomplete["gsms"] as Array<string>}
               onChange={e => onChange(gsm, e)}
            />

            <TextComponent
               hasError={validForm["email"].hasError}
               errorText={validForm["email"].errorMessage}
               placeholder="Email"
               options={autocomplete["emails"] as Array<string>}
               onChange={e => onChange(email, e)}
            />
         </Grid>
         <Grid item xs={12} style={{ padding: "25px" }}>
            <Grid container>
               <Grid item xs={6}>
                  <TextareaAutosize
                     rowsMax={4}
                     rowsMin={4}
                     style={{
                        borderRadius: "5px",
                        fontSize: "16px",
                        backgroundColor: "#E7EAED",
                        marginTop: "-25px",
                        width: "90%",
                     }}
                     placeholder="Notes"
                  />
               </Grid>
               <Grid item xs={6}>
                  <Button variant="contained" color="secondary" className={classes.submit}>
                     RESERVER
                  </Button>
               </Grid>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default ReservationForm;
