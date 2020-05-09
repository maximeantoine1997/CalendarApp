import {
   Button,
   Chip,
   createStyles,
   Dialog,
   DialogActions,
   DialogContent,
   Divider,
   Grid,
   makeStyles,
   Typography,
   Checkbox,
} from "@material-ui/core";
import React, { ReactElement, useRef, useState } from "react";
import { updateReservationAsync } from "../../Firebase/Firebase.Utils";
import TextComponent from "../FormElements/TextComponent";
import { Reservation } from "../reservation_form";
import CheckBoxComponent from "../FormElements/CheckboxComponent";
import EuroComponent from "../FormElements/EuroComponent";

const useStyles = makeStyles(() =>
   createStyles({
      dialog: {
         height: "70vh",
      },
      subtitle: {
         paddingTop: "10px",
         paddingBottom: "5px",
         fontFamily: "helvetica",
         fontSize: "1.5em",
      },
      title: {
         paddingTop: "20px",
         fontFamily: "helvetica",
         fontSize: "1.8em",
         fontWeight: "bold",
      },
   })
);
interface CalendarModalProps {
   reservation: Reservation;
   open: boolean;
   onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ reservation: reservation_, open, onClose: onClose_ }) => {
   const classes = useStyles();

   const [editMode, setEditMode] = useState<boolean>(false);

   const reservation = useRef<Reservation>(reservation_);

   const editReservation = useRef<Reservation>(reservation_);

   const updateReservation = (type: string, newValue: any) => {
      const newReservation = { ...editReservation.current };

      //! Add start date and end date changes
      switch (type) {
         case "accessoires":
            newReservation.accessoires = newValue;
            break;
         case "address":
            newReservation.address = newValue;
            break;
         case "email":
            newReservation.email = newValue;
            break;
         case "gsm":
            newReservation.gsm = newValue;
            break;
         case "isBancontact":
            newReservation.isBancontact = newValue;
            break;
         case "isReceived":
            newReservation.isReceived = newValue;
            break;
         case "modele":
            newReservation.modele = newValue;
            break;
         case "montant":
            newReservation.montant = newValue;
            break;
         case "nom":
            newReservation.nom = newValue;
            break;
         case "prenom":
            newReservation.prenom = newValue;
            break;
         case "reservationNumber":
            newReservation.reservationNumber = newValue;
            break;
         case "societe":
            newReservation.societe = newValue;
            break;
         case "type":
            newReservation.type = newValue;
            break;
         default:
            break;
      }
      editReservation.current = newReservation;
   };

   const updateReservationFirebase = (): void => {
      reservation.current = { ...editReservation.current };
      setEditMode(false);
      updateReservationAsync(reservation.current);
   };

   const toggleToEditMode = () => {
      setEditMode(true);
      editReservation.current = { ...reservation.current };
   };

   const renderAccessoires: Array<ReactElement> = reservation.current.accessoires
      ? reservation.current.accessoires.map((accessoire, index) => {
           return <Chip label={accessoire} variant="outlined" color="secondary" size="medium" key={index} />;
        })
      : [];

   if (editMode && editReservation.current) {
      return (
         <Dialog open={open} onClose={onClose_} fullWidth maxWidth="lg" scroll="paper">
            <DialogContent>
               <Grid container className={classes.dialog} direction="row" justify="space-between">
                  <Grid item xs={12}>
                     <Typography style={{ fontSize: "1.5em", fontWeight: "bold" }} variant="h5">
                        Machine:
                     </Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <TextComponent
                        placeholder="Machine"
                        onChange={e => updateReservation("modele", e)}
                        value={editReservation.current.modele}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <TextComponent
                        placeholder="Accessoires"
                        multiple
                        onChange={e => updateReservation("accessoires", e)}
                        value={editReservation.current.accessoires}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Typography className={classes.title} variant="h5">
                        Chantier:
                     </Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <TextComponent
                        placeholder="Societé"
                        onChange={e => updateReservation("societe", e)}
                        value={editReservation.current.societe}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <TextComponent
                        placeholder="Addresse"
                        onChange={e => updateReservation("address", e)}
                        value={editReservation.current.address}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Typography className={classes.title} variant="h5">
                        Client:
                     </Typography>
                  </Grid>
                  <Grid item xs={3}>
                     <TextComponent
                        placeholder="Prenom"
                        onChange={e => updateReservation("prenom", e)}
                        value={editReservation.current.prenom}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={3}>
                     <TextComponent
                        placeholder="Nom"
                        onChange={e => updateReservation("nom", e)}
                        value={editReservation.current.nom}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={3}>
                     <TextComponent
                        placeholder="Telephone"
                        onChange={e => updateReservation("gsm", e)}
                        value={editReservation.current.gsm}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={3}>
                     <TextComponent
                        placeholder="Email"
                        onChange={e => updateReservation("email", e)}
                        value={editReservation.current.email}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <Typography className={classes.title} variant="h5">
                        Info:
                     </Typography>
                  </Grid>
                  <Grid item xs={3}>
                     <TextComponent
                        placeholder="Dossier Vary"
                        onChange={e => updateReservation("reservationNumber", e)}
                        value={editReservation.current.reservationNumber}
                        variant="standard"
                        customClass={{ width: "75%" }}
                     />
                  </Grid>
                  <Grid item xs={3}>
                     <EuroComponent
                        variant="standard"
                        placeholder="Montant"
                        value={editReservation.current.montant}
                        onChange={e => updateReservation("montant", e)}
                     />
                  </Grid>
                  <Grid item xs={3}>
                     <CheckBoxComponent
                        placeholder="Bancontact"
                        value={editReservation.current.isBancontact}
                        onChange={e => updateReservation("isBancontact", e)}
                        color="secondary"
                     />
                  </Grid>
                  <Grid item xs={3}>
                     <CheckBoxComponent
                        placeholder="Reçu"
                        value={editReservation.current.isReceived}
                        onChange={e => updateReservation("isReceived", e)}
                        color="secondary"
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <Divider />
            <DialogActions>
               <Button onClick={() => setEditMode(false)} variant="outlined" color="secondary">
                  Retour
               </Button>
               <Button onClick={updateReservationFirebase} variant="outlined">
                  Enregistrer
               </Button>
            </DialogActions>
         </Dialog>
      );
   }

   return (
      <Dialog open={open} onClose={onClose_} fullWidth maxWidth="lg" scroll="paper">
         <DialogContent>
            <Grid container className={classes.dialog}>
               <Grid item xs={12}>
                  <Typography style={{ fontSize: "1.5em", fontWeight: "bold" }} variant="h5">
                     Machine:
                  </Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Machine:</Typography>
                  <Typography>{reservation.current.modele}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Accessoires:</Typography>
                  {renderAccessoires}
               </Grid>
               <Grid item xs={12}>
                  <Typography className={classes.title} variant="h5">
                     Chantier:
                  </Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Societé:</Typography>
                  <Typography>{reservation.current.societe}</Typography>
               </Grid>
               <Grid item xs={9}>
                  <Typography className={classes.subtitle}>Adresse:</Typography>
                  <Typography>{reservation.current.address}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography className={classes.title} variant="h5">
                     Client:
                  </Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Prénom:</Typography>
                  <Typography>{reservation.current.prenom}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Nom:</Typography>
                  <Typography>{reservation.current.nom}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Téléphone:</Typography>
                  <Typography>{reservation.current.gsm}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Email:</Typography>
                  <Typography>{reservation.current.email}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography className={classes.title} variant="h5">
                     Info:
                  </Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Dossier Vary:</Typography>
                  <Typography>{reservation.current.reservationNumber}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Montant:</Typography>
                  <Typography>€{reservation.current.montant}</Typography>
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Bancontact:</Typography>
                  <Checkbox checked={reservation.current.isBancontact} disableTouchRipple disableRipple />
               </Grid>
               <Grid item xs={3}>
                  <Typography className={classes.subtitle}>Reçu:</Typography>
                  <Checkbox checked={reservation.current.isReceived} disableTouchRipple disableRipple />
               </Grid>
            </Grid>
         </DialogContent>
         <Divider />
         <DialogActions>
            <Button onClick={toggleToEditMode} variant="outlined" color="secondary">
               Modifier
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default CalendarModal;
