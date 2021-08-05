import { Button, createStyles, Grid, makeStyles, Switch, Theme, Typography } from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BusinessIcon from "@material-ui/icons/Business";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import PaymentIcon from "@material-ui/icons/Payment";
import PersonIcon from "@material-ui/icons/Person";
import moment, { Moment } from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Autocomplete, Fauna, getAutoCompelteAsync, updateAutoCompleteAsync } from "../FaunaDB/Api";
import { autocompleteMapping } from "../FaunaDB/FaunaDB.Utils";
import UseDragDrop from "../Hooks/UseDragDrop";
import { HashMap, ReservationType } from "../Utils";
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
   | "amount"
   | "isReceived"
   | "isCash"
   | "modele"
   | "accessoires"
   | "isToBeDelivered"
   | "street"
   | "city"
   | "sitePhone"
   | "isCompany"
   | "toSave"
   | "company"
   | "firstname"
   | "name"
   | "phone"
   | "email"
   | "VATNumber"
   | "facturationAddress";

export interface Reservation {
   // Date:
   startDate: string;

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
   city: string;
   sitePhone: string;

   // Client:
   isCompany: boolean;
   toSave: boolean;
   company?: string;
   name: string;
   facturationAddress?: string;
   VATNumber?: string;
   phone?: string;
   email?: string;

   // Extra:
   id?: number | string;
   varyNumber?: string;
   type: ReservationType;
   notes?: string;

   columnIndex?: number;

   // Drag & Drop
   previous?: string;
   next?: string;
}

export type KVReservation = {
   [key in keyof Reservation]: any;
};

const ReservationForm: React.FC<FormProps> = ({ onChange: onChange_ }) => {
   const classes = useStyles();
   const history = useHistory();

   const { addDragDrop } = UseDragDrop();

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
      name: {
         hasError: false,
         errorMessage: "",
      },
      street: {
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
      facturationAddress: {
         hasError: false,
         errorMessage: "",
      },
      VATNumber: {
         hasError: false,
         errorMessage: "",
      },
   };

   const param = new URLSearchParams(window.location.search);

   const newReservation = useRef<KVReservation>({
      startDate: param.get("date") ? moment(param.get("date") as string) : moment(),
      amount: 0,
      isCash: true,
      isReceived: false,
      modele: "",
      accessoires: [],
      isToBeDelivered: true,
      street: "",
      name: "",
      city: "",
      sitePhone: "",
      isCompany: true,
      toSave: true,
      type: "A Livrer",
      varyNumber: "",
   });

   const [validForm, setValidForm] = useState<ValidReservation>({ ...initValidForm });
   const [isCompany, setIsCompany] = useState<boolean>(true);
   const [isToBeDelivered, setIsToBeDelivered] = useState<boolean>(true);
   const [hasCaution, setHasCaution] = useState<boolean>(false);
   const [autocomplete, setAutocomplete] = useState<HashMap<Array<string>>>({});

   const onChange = (key: keyof Reservation, value: unknown) => {
      const res = newReservation.current;
      res[key] = value;
   };

   const addAutocompleteItem = (docName: ReservationKeys, newItem: unknown) => {
      const items = (autocomplete[docName] as Array<string>) || [];
      items.push(newItem as string);
   };

   const addReservation = async (): Promise<void> => {
      const res = newReservation.current;

      const date = res.startDate as Moment;
      res.startDate = date.clone().format("YYYY-MM-DD");

      if (!res.isToBeDelivered) {
         res.type = "Client Vient Chercher";
      }

      // If "Caution" change type
      if (res.amount > 0) {
         res.type = "Attente Caution";
      }
      //#region Autocomplete

      addAutocompleteItem("street", res.street);
      addAutocompleteItem("city", res.city);
      if (res.sitePhone) addAutocompleteItem("sitePhone", res.sitePhone);

      addAutocompleteItem("modele", res.modele);
      const accItems = autocomplete["accessoires"];
      res.accessoires.forEach((accessoire: string) => {
         accItems.push(accessoire);
      });

      if (isCompany) {
         addAutocompleteItem("company", res.company);
         if (res.VATNumber) addAutocompleteItem("VATNumber", res.VATNumber);
      } else {
         addAutocompleteItem("name", res.name);
         addAutocompleteItem("facturationAddress", res.name);
      }
      updateAutoCompleteAsync(autocomplete);

      //#endregion

      // Will add the reservation and make it drag and droppable
      addDragDrop(res).then(() => {
         history.push("/calendrier");
      });
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

      // Address
      if (isToBeDelivered) {
         if (res["street"]?.length < 1) {
            updateForm("street", true, "Rue non valide");
         }
         if (res["city"]?.length < 1) {
            updateForm("city", true, "Ville non valide");
         }
      }
      if (!res["name"] || res["name"]?.length < 1) {
         updateForm("name", true, "Au moins un caractère");
      }
      if (isCompany) {
         if (!res["company"] || res["company"]?.length < 1) {
            updateForm("company", true, "Au moins un caractère");
         }
      } else {
         if (!res["facturationAddress"] || res["facturationAddress"]?.length < 1) {
            updateForm("facturationAddress", true, "Adresse non valide");
         }
      }

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
         const data = (await getAutoCompelteAsync()) as unknown as Array<Fauna<Autocomplete>>;
         const hash: HashMap<Array<string>> = {};
         data.forEach(item => {
            const name = autocompleteMapping[item.ref.id];
            hash[name] = item.data.items;
         });
         setAutocomplete(hash);
      };
      getAutocomplete();
   }, []);

   return (
      <Grid container alignContent="flex-start">
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Date:</Typography>
            <DateComponent
               placeholder="Début *"
               onChange={(e: any) => onChange("startDate", e)}
               value={newReservation.current.startDate}
            />
            <TextComponent placeholder="Dossier Vary" value="" onChange={e => onChange("varyNumber", e)} />
            <Grid container style={{ paddingTop: "25px" }} alignItems="center">
               <Grid item>
                  <Typography variant="h4">Caution:</Typography>
               </Grid>
               <Grid item style={{ paddingTop: "5px" }}>
                  <Switch
                     checked={hasCaution}
                     onChange={() => setHasCaution(prev => !prev)}
                     value="checkedCaution"
                     color="secondary"
                  />
               </Grid>
            </Grid>

            {hasCaution && (
               <>
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
               </>
            )}
         </Grid>
         <Grid item xs={4} style={{ padding: "25px" }}>
            <Typography variant="h4">Machine:</Typography>
            <TextComponent
               isRequired
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
               onClick={value => {
                  onChange("isToBeDelivered", value);
                  setIsToBeDelivered(value);
               }}
            />
            <TextComponent
               isRequired={isToBeDelivered}
               hasError={validForm["street"].hasError}
               errorText={validForm["street"].errorMessage}
               placeholder="Rue"
               onChange={e => onChange("street", e)}
               options={autocomplete["street"] as Array<string>}
            />
            <Grid item xs={12}>
               <TextComponent
                  isRequired={isToBeDelivered}
                  hasError={validForm["city"].hasError}
                  errorText={validForm["city"].errorMessage}
                  placeholder="Ville"
                  onChange={e => onChange("city", e)}
                  options={autocomplete["city"] as Array<string>}
               />
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
            {isCompany && (
               <>
                  <TextComponent
                     isRequired
                     hasError={validForm["company"].hasError}
                     errorText={validForm["company"].errorMessage}
                     placeholder="Société"
                     onChange={e => onChange("company", e)}
                     options={autocomplete["company"] as Array<string>}
                  />
                  <TextComponent
                     hasError={validForm["VATNumber"].hasError}
                     errorText={validForm["VATNumber"].errorMessage}
                     placeholder="N° TVA"
                     onChange={e => onChange("VATNumber", e)}
                     options={autocomplete["VATNumber"] as Array<string>}
                  />
                  <TextComponent
                     isRequired
                     hasError={validForm["name"].hasError}
                     errorText={validForm["name"].errorMessage}
                     placeholder="Personne de contact"
                     onChange={e => onChange("name", e)}
                     options={autocomplete["name"] as Array<string>}
                  />
               </>
            )}
            {!isCompany && (
               <>
                  <TextComponent
                     isRequired
                     hasError={validForm["name"].hasError}
                     errorText={validForm["name"].errorMessage}
                     placeholder="Nom"
                     options={autocomplete["name"] as Array<string>}
                     onChange={e => onChange("name", e)}
                  />
                  <TextComponent
                     isRequired
                     hasError={validForm["facturationAddress"].hasError}
                     errorText={validForm["facturationAddress"].errorMessage}
                     placeholder="Adresse de facturation"
                     options={autocomplete["facturationAddress"] as Array<string>}
                     onChange={e => onChange("facturationAddress", e)}
                  />
               </>
            )}

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
