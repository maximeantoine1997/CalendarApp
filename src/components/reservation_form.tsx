import { Button, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import ArchiveIcon from "@material-ui/icons/Archive";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BusinessIcon from "@material-ui/icons/Business";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import PaymentIcon from "@material-ui/icons/Payment";
import PersonIcon from "@material-ui/icons/Person";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { addReservationAsync, getAutocompleteAsync, updateAutocompleteAsync } from "../Firebase/Firebase.Utils";
import { IHash, ReservationType } from "../Utils";
import DateComponent from "./FormElements/DateComponent";
import SquareButtons from "./FormElements/SquareButton";
import TextBox from "./FormElements/TextBox";
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

export interface FormProps {
   id?: string;
   onChange?: (newValue: any) => void;
}

type ValidReservation = {
   [key in ReservationKeys]: {
      hasError: boolean;
      errorMessage: string;
   };
};

export type ReservationKeys =
   | "startDate"
   | "endDate"
   | "amount"
   | "isReceived"
   | "isCash"
   | "modele"
   | "accessoires"
   | "isToBeDelivered"
   | "street"
   | "postalCode"
   | "city"
   | "sitePhone"
   | "isCompany"
   | "toSave"
   | "company"
   | "firstname"
   | "lastname"
   | "phone"
   | "email";

export interface Reservation {
   // Date:
   startDate: string;
   endDate?: string;

   // Caution:
   amount: number;
   isReceived: boolean;
   isCash: boolean;

   // Machine:
   modele: string;
   accessoires: Array<string>;

   // Chantier:
   isToBeDelivered: boolean;
   street: string;
   postalCode: string;
   city: string;
   sitePhone: string;

   // Client:
   isCompany: boolean;
   toSave: boolean;
   company?: string;
   firstname?: string;
   lastname?: string;
   phone?: string;
   email?: string;

   // Extra:
   id?: string;
   varyNumber?: string;
   type: ReservationType;
   notes?: string;
}

export type KVReservation = {
   [key in keyof Reservation]: any;
};

const ReservationForm: React.FC<FormProps> = ({ onChange: onChange_ }) => {
   const classes = useStyles();
   const history = useHistory();

   const initValidForm: ValidReservation = {
      company: {
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
      phone: {
         hasError: false,
         errorMessage: "",
      },
      email: {
         hasError: false,
         errorMessage: "",
      },
      firstname: {
         hasError: false,
         errorMessage: "",
      },
      lastname: {
         hasError: false,
         errorMessage: "",
      },
      street: {
         hasError: false,
         errorMessage: "",
      },
      postalCode: {
         hasError: false,
         errorMessage: "",
      },
      city: {
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
      amount: {
         hasError: false,
         errorMessage: "",
      },
      isCash: {
         hasError: false,
         errorMessage: "",
      },
      isCompany: {
         hasError: false,
         errorMessage: "",
      },
      isReceived: {
         hasError: false,
         errorMessage: "",
      },
      isToBeDelivered: {
         hasError: false,
         errorMessage: "",
      },
      toSave: {
         hasError: false,
         errorMessage: "",
      },
      sitePhone: {
         hasError: false,
         errorMessage: "",
      },
   };

   const newReservation = useRef<KVReservation>({
      startDate: moment().format("YYYY-MM-DD"),
      amount: 0,
      isCash: true,
      isReceived: false,
      modele: "",
      accessoires: [],
      isToBeDelivered: true,
      street: "",
      postalCode: "",
      city: "",
      sitePhone: "",
      isCompany: true,
      toSave: true,
      type: "A Livrer",
   });

   const [validForm, setValidForm] = useState<ValidReservation>({ ...initValidForm });
   const [hasEndDate, setHasEndDate] = useState<boolean>(false);
   const [isCompany, setIsCompany] = useState<boolean>(true);
   const [toSave, setToSave] = useState<boolean>(true);
   const [autocomplete, setAutocomplete] = useState<IHash<unknown>>({});

   const onChange = (key: keyof Reservation, value: unknown) => {
      const res = newReservation.current;
      res[key] = value;
   };

   const addAutocompleteItem = (docName: ReservationKeys, newItem: unknown) => {
      const items = autocomplete[docName];
      items.push(newItem);
   };
   const addReservation = async (): Promise<void> => {
      const res = newReservation.current;

      if (!res.isToBeDelivered) {
         res.type = "Client Vient Chercher";
      }

      addAutocompleteItem("street", res.street);
      addAutocompleteItem("postalCode", res.postalCode);
      addAutocompleteItem("city", res.city);
      addAutocompleteItem("sitePhone", res.sitePhone);

      addAutocompleteItem("modele", res.modele);
      const items = autocomplete["accessoires"];
      res.accessoires.forEach((accessoire: string) => {
         items.push(accessoire);
      });

      if (isCompany) {
         addAutocompleteItem("company", res.company);
      } else {
         addAutocompleteItem("firstname", res.firstname);
         addAutocompleteItem("lastname", res.lastname);
      }
      if (toSave) {
         addAutocompleteItem("phone", res.phone);
         addAutocompleteItem("email", res.email);
      }

      updateAutocompleteAsync(autocomplete);

      await addReservationAsync({ ...newReservation.current });
      history.push("/calendrier");
   };

   /**
    * Checks if the form is valid. Validation logic is here.
    */
   const onSubmit = () => {
      let newValidForm = { ...initValidForm };

      const updateForm = (type: ReservationKeys, hasError: boolean, errorMessage: string) => {
         newValidForm[type].hasError = hasError;
         newValidForm[type].errorMessage = errorMessage;
      };

      const res = newReservation.current;

      // #region errors

      if (res["modele"]?.length < 1) {
         updateForm("modele", true, "Veuillez rentrer un modèle");
      }

      if (res["sitePhone"]?.length < 1) {
         updateForm("sitePhone", true, "Numéro non valide");
      }

      // Address
      if (res["street"]?.length < 1) {
         updateForm("street", true, "Rue non valide");
      }
      if (!res["postalCode"] || res["postalCode"]?.length < 1) {
         updateForm("postalCode", true, "Code postal non valide");
      }
      if (res["city"]?.length < 1) {
         updateForm("city", true, "Ville non valide");
      }
      if (isCompany) {
         if (!res["company"] || res["company"]?.length < 1) {
            updateForm("company", true, "Au moins un caractère");
         }
      } else {
         if (!res["firstname"] || res["firstname"]?.length < 1) {
            updateForm("firstname", true, "Au moins un caractère");
         }
         if (!res["lastname"] || res["lastname"]?.length < 1) {
            updateForm("lastname", true, "Au moins un caractère");
         }
      }
      if (toSave) {
         if (!res["phone"] || res["phone"]?.length < 1) {
            updateForm("phone", true, "Numéro non valide");
         }
         if (!res["email"] || res["email"]?.length < 1) {
            updateForm("email", true, "Veuillez rentrer un email valide");
         }
      }
      //   // startDate & endDate
      //   if (endDate.current && !startDate.current?.isSameOrBefore(endDate.current, "day")) {
      //      updateForm(
      //         "startDate",
      //         true,
      //         "la date de fin ne peut pas être avant celle du début, veuillez ajuster en conséquence"
      //      );
      //   }
      // #endregion

      const hasError = Object.values(newValidForm).find(value => {
         return value.hasError === true;
      });

      if (!hasError) {
         addReservation();
      }

      setValidForm({ ...newValidForm });
   };

   useEffect(() => {
      const getAutocomplete = async () => {
         const data = await getAutocompleteAsync();
         setAutocomplete(data);
      };
      getAutocomplete();
   }, []);

   return (
      <Grid container alignContent="flex-start">
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Date:</Typography>
            <DateComponent placeholder="Début" onChange={(e: any) => onChange("startDate", e)} />
            <SquareButtons
               iconLeft={<DoneIcon />}
               iconRight={<ClearIcon />}
               labelLeft="Date de fin"
               labelRight="aucune date"
               value={hasEndDate}
               onClick={value => setHasEndDate(value)}
            />
            {hasEndDate && <DateComponent placeholder="Fin" onChange={(e: any) => onChange("endDate", e)} />}
            <Typography variant="h4" style={{ paddingTop: "25px" }}>
               Caution:
            </Typography>
            <TextComponent placeholder="Montant" value="0" onChange={e => onChange("amount", e)} />
            <SquareButtons
               iconLeft={<AttachMoneyIcon />}
               iconRight={<PaymentIcon />}
               labelLeft="Cash"
               labelRight="Bancontact"
               value={newReservation.current["isCash"] as boolean}
               onClick={value => onChange("isCash", value)}
            />
            <SquareButtons
               iconLeft={<DoneIcon />}
               iconRight={<ClearIcon />}
               labelLeft="Reçu"
               labelRight="Pas Reçu"
               value={newReservation.current["isReceived"] as boolean}
               onClick={value => onChange("isReceived", value)}
            />
         </Grid>
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Machine:</Typography>
            <TextComponent
               hasError={validForm["modele"].hasError}
               errorText={validForm["modele"].errorMessage}
               placeholder="Modèle"
               options={autocomplete["modele"] as Array<string>}
               onChange={e => onChange("modele", e)}
            />
            <TextComponent
               hasError={validForm["accessoires"].hasError}
               errorText={validForm["accessoires"].errorMessage}
               placeholder="Accessoires"
               options={autocomplete["accessoires"] as Array<string>}
               onChange={e => onChange("accessoires", e)}
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
               value={newReservation.current["isToBeDelivered"] as boolean}
               onClick={value => onChange("isToBeDelivered", value)}
            />
            <TextComponent
               hasError={validForm["street"].hasError}
               errorText={validForm["street"].errorMessage}
               placeholder="Rue"
               onChange={e => onChange("street", e)}
               options={autocomplete["street"] as Array<string>}
            />
            <Grid container>
               <Grid item xs={4} style={{ paddingRight: "25px" }}>
                  <TextComponent
                     hasError={validForm["postalCode"].hasError}
                     errorText={validForm["postalCode"].errorMessage}
                     placeholder="Code Postal"
                     onChange={e => onChange("postalCode", e)}
                     options={autocomplete["postalCode"] as Array<string>}
                  />
               </Grid>
               <Grid item xs={8}>
                  <TextComponent
                     hasError={validForm["city"].hasError}
                     errorText={validForm["city"].errorMessage}
                     placeholder="Ville"
                     onChange={e => onChange("city", e)}
                     options={autocomplete["city"] as Array<string>}
                  />
               </Grid>
            </Grid>
            <TextComponent
               hasError={validForm["sitePhone"].hasError}
               errorText={validForm["sitePhone"].errorMessage}
               placeholder="N° de Chantier"
               onChange={e => onChange("sitePhone", e)}
               options={autocomplete["sitePhone"] as Array<string>}
            />
         </Grid>
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Client:</Typography>
            <SquareButtons
               iconRight={<PersonIcon />}
               iconLeft={<BusinessIcon />}
               labelRight="Particulier"
               labelLeft="Société"
               value={isCompany}
               onClick={value => {
                  onChange("isCompany", value);
                  setIsCompany(value);
               }}
            />
            <SquareButtons
               iconLeft={<ArchiveIcon />}
               iconRight={<ClearIcon />}
               labelLeft="Enregistrer"
               labelRight="Pas Enregistrer"
               value={toSave}
               onClick={value => setToSave(value)}
            />
            {isCompany && (
               <TextComponent
                  hasError={validForm["company"].hasError}
                  errorText={validForm["company"].errorMessage}
                  placeholder="Société"
                  onChange={e => onChange("company", e)}
                  options={autocomplete["company"] as Array<string>}
               />
            )}
            {!isCompany && (
               <Grid container>
                  <Grid item xs={6} style={{ paddingRight: "25px" }}>
                     <TextComponent
                        hasError={validForm["lastname"].hasError}
                        errorText={validForm["lastname"].errorMessage}
                        placeholder="Nom"
                        options={autocomplete["lastname"] as Array<string>}
                        onChange={e => onChange("lastname", e)}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <TextComponent
                        hasError={validForm["firstname"].hasError}
                        errorText={validForm["firstname"].errorMessage}
                        placeholder="Prénom"
                        options={autocomplete["firstname"] as Array<string>}
                        onChange={e => onChange("firstname", e)}
                     />
                  </Grid>
               </Grid>
            )}
            {toSave && (
               <Grid>
                  <TextComponent
                     hasError={validForm["phone"].hasError}
                     errorText={validForm["phone"].errorMessage}
                     placeholder="Téléphone"
                     options={autocomplete["phone"] as Array<string>}
                     onChange={e => onChange("phone", e)}
                  />
                  <TextComponent
                     hasError={validForm["email"].hasError}
                     errorText={validForm["email"].errorMessage}
                     placeholder="Email"
                     options={autocomplete["email"] as Array<string>}
                     onChange={e => onChange("email", e)}
                  />
               </Grid>
            )}
         </Grid>
         <Grid item xs={12} style={{ padding: "25px" }}>
            <Grid container>
               <Grid item xs={6}>
                  <TextBox placeholder="Notes" onChange={e => onChange("notes", e)} />
               </Grid>
               <Grid item xs={6}>
                  <Button variant="contained" color="secondary" className={classes.submit} onClick={() => onSubmit()}>
                     RESERVER
                  </Button>
               </Grid>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default ReservationForm;
