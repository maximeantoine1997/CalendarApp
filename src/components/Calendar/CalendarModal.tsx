import {
   Button,
   Chip,
   createStyles,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Divider,
   Grid,
   makeStyles,
   MenuItem,
   Select,
   Typography,
} from "@material-ui/core";
import React, { ReactElement, useRef, useState } from "react";
import { updateReservationAsync } from "../../Firebase/Firebase.Utils";
import { CalendarType } from "../../Interfaces/Common";
import TextComponent from "../FormElements/TextComponent";
import { Reservation } from "../reservation_form";
import ColorBlock from "./Blocks/ColorBlock";

const useStyles = makeStyles(() =>
   createStyles({
      dialog: {
         height: "50vh",
      },
      title: {
         paddingTop: "20px",
         fontFamily: "Arial",
         fontSize: "1.3em",
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

   const [type, setType] = useState<string>(reservation.current.type);
   const onChangeSelect = (value: CalendarType) => {
      setType(value);
      updateReservation("type", value);
   };

   const renderAccessoires: Array<ReactElement> = reservation.current.accessoires
      ? reservation.current.accessoires.map((accessoire, index) => {
           return <Chip label={accessoire} variant="outlined" color="secondary" size="medium" key={index} />;
        })
      : [];

   if (editMode && editReservation.current) {
      return (
         <Dialog open={open} onClose={onClose_} fullWidth scroll="paper">
            <DialogTitle>Reservation</DialogTitle>
            <Divider />
            <DialogContent>
               <Grid container className={classes.dialog} direction="row" justify="space-between">
                  <Grid item xs={12}>
                     <Select value={type} onChange={e => onChangeSelect(e.target.value as CalendarType)}>
                        <MenuItem value="Livraison">
                           <ColorBlock color="red" label="Livraison" />
                        </MenuItem>
                        <MenuItem value="Preparation">
                           <ColorBlock color="green" label="Preparation" />
                        </MenuItem>
                        <MenuItem value="Livre">
                           <ColorBlock color="blue" label="Livré" />
                        </MenuItem>
                     </Select>
                  </Grid>
                  <Grid item xs={12}>
                     <TextComponent
                        placeholder="Dossier Vary"
                        onChange={e => updateReservation("reservationNumber", e)}
                        value={editReservation.current.reservationNumber}
                        variant="standard"
                        customClass={{ width: "50%" }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextComponent
                        placeholder="Societé"
                        onChange={e => updateReservation("societe", e)}
                        value={editReservation.current.societe}
                        variant="standard"
                        customClass={{ width: "50%" }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextComponent
                        placeholder="Machine"
                        onChange={e => updateReservation("modele", e)}
                        value={editReservation.current.modele}
                        variant="standard"
                        customClass={{ width: "50%" }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextComponent
                        placeholder="Accessoires"
                        multiple
                        onChange={e => updateReservation("accessoires", e)}
                        value={editReservation.current.accessoires}
                        variant="standard"
                        customClass={{ width: "90%" }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextComponent
                        placeholder="Addresse"
                        onChange={e => updateReservation("address", e)}
                        value={editReservation.current.address}
                        variant="standard"
                        customClass={{ width: "50%" }}
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
      <Dialog open={open} onClose={onClose_} fullWidth scroll="paper">
         <DialogTitle>Reservation</DialogTitle>
         <Divider />
         <DialogContent>
            <Grid container className={classes.dialog}>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Societé:</Typography>
                  <Typography>{reservation.current.societe}</Typography>
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Dossier Vary:</Typography>
                  <Typography>{reservation.current.reservationNumber}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography className={classes.title}>Adresse:</Typography>
                  <Typography>{reservation.current.address}</Typography>
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Machine:</Typography>
                  <Typography>{reservation.current.modele}</Typography>
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Accessoires:</Typography>
                  {renderAccessoires}
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Prénom:</Typography>
                  <Typography>{reservation.current.prenom}</Typography>
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Nom:</Typography>
                  <Typography>{reservation.current.nom}</Typography>
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Téléphone:</Typography>
                  <Typography>{reservation.current.gsm}</Typography>
               </Grid>
               <Grid item xs={6}>
                  <Typography className={classes.title}>Email:</Typography>
                  <Typography>{reservation.current.email}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography className={classes.title}>type:</Typography>
                  <Typography>{reservation.current.type}</Typography>
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
