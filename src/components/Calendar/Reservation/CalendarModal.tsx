import {
   Button,
   createStyles,
   Dialog,
   DialogActions,
   DialogContent,
   Divider,
   Grid,
   makeStyles,
   Typography,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import PaymentIcon from "@material-ui/icons/Payment";
import React, { useRef, useState } from "react";
import SquareButtons from "../../FormElements/SquareButton";
import TextBox from "../../FormElements/TextBox";
import TextComponent from "../../FormElements/TextComponent";
import { KVReservation, Reservation } from "../../reservation_form";
import { updateReservationAsync } from "../../../Firebase/Firebase.Utils";

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
   onClose: (reservation: Reservation | null) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ reservation: reservation_, open, onClose: onClose_ }) => {
   const classes = useStyles();
   const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
   const reservation = useRef<KVReservation>({ ...reservation_ });

   const modifiedReservation = useRef<KVReservation>({ ...reservation_ });

   const onModify = () => {
      modifiedReservation.current = { ...reservation.current };
      setIsReadOnly(false);
   };

   const onCancel = () => {
      setIsReadOnly(true);
   };

   const onSave = () => {
      reservation.current = { ...modifiedReservation.current };
      setIsReadOnly(true);
      updateReservationAsync({ ...modifiedReservation.current });
   };

   const onChange = (key: keyof Reservation, value: unknown) => {
      const res = modifiedReservation.current;
      res[key] = value;
   };

   return (
      <Dialog open={open} onClose={() => onClose_(reservation.current)} fullWidth maxWidth="lg" scroll="paper">
         <DialogContent>
            <Grid container>
               <Grid container className={classes.dialog} direction="row" justify="space-between">
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography style={{ fontSize: "1.5em", fontWeight: "bold" }} variant="h5">
                           Machine:
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Machine"
                           onChange={e => onChange("modele", e)}
                           value={reservation.current.modele}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Accessoires"
                           multiple
                           onChange={e => onChange("accessoires", e)}
                           value={reservation.current.accessoires}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                  </Grid>
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography variant="h5">Chantier:</Typography>
                     </Grid>
                     <SquareButtons
                        iconLeft={<LocalShippingIcon />}
                        iconRight={<ArrowDownwardIcon />}
                        labelLeft="A Livrer"
                        labelRight="Vient Chercher"
                        value={reservation.current["isToBeDelivered"] as boolean}
                        onClick={value => onChange("isToBeDelivered", value)}
                        isReadOnly={isReadOnly}
                     />
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Rue"
                           onChange={e => onChange("street", e)}
                           value={reservation.current.street}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Ville"
                           onChange={e => onChange("city", e)}
                           value={reservation.current.city}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                  </Grid>
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography variant="h5">Client:</Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Société"
                           onChange={e => onChange("company", e)}
                           value={reservation.current.company}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Prenom"
                           onChange={e => onChange("name", e)}
                           value={reservation.current.name}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Nom"
                           onChange={e => onChange("name", e)}
                           value={reservation.current.name}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Telephone"
                           onChange={e => onChange("phone", e)}
                           value={reservation.current.phone}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Email"
                           onChange={e => onChange("email", e)}
                           value={reservation.current.email}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                  </Grid>
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography variant="h5">Info:</Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Dossier Vary"
                           onChange={e => onChange("varyNumber", e)}
                           value={reservation.current.varyNumber}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextBox
                           isReadOnly={isReadOnly}
                           placeholder="Notes"
                           onChange={e => onChange("notes", e)}
                           value={reservation.current.notes}
                           variant="white"
                        />
                     </Grid>
                  </Grid>
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography variant="h5">Caution:</Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           variant="standard"
                           placeholder="Montant"
                           value={reservation.current.amount}
                           onChange={e => onChange("amount", e)}
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12} style={{ paddingTop: isReadOnly ? "10px" : "0px" }}>
                        <SquareButtons
                           iconLeft={<AttachMoneyIcon />}
                           iconRight={<PaymentIcon />}
                           labelLeft="Cash"
                           labelRight="Bancontact"
                           value={reservation.current["isCash"] as boolean}
                           onClick={value => onChange("isCash", value)}
                           isReadOnly={isReadOnly}
                        />
                     </Grid>
                     <Grid item xs={12} style={{ paddingTop: isReadOnly ? "20px" : "0px" }}>
                        <SquareButtons
                           iconLeft={<DoneIcon />}
                           iconRight={<ClearIcon />}
                           labelLeft="Reçu"
                           labelRight="Pas Reçu"
                           value={reservation.current["isReceived"] as boolean}
                           onClick={value => onChange("isReceived", value)}
                           isReadOnly={isReadOnly}
                        />
                     </Grid>
                  </Grid>
                  <Grid item xs={4}></Grid>
               </Grid>
            </Grid>
         </DialogContent>
         <Divider />
         <DialogActions>
            {isReadOnly && (
               <Button onClick={onModify} variant="outlined" color="secondary">
                  Modifier
               </Button>
            )}
            {!isReadOnly && (
               <>
                  <Button onClick={onCancel} variant="outlined" color="secondary">
                     Retour
                  </Button>
                  <Button onClick={onSave} variant="outlined">
                     Enregistrer
                  </Button>
               </>
            )}
         </DialogActions>
      </Dialog>
   );
};

export default CalendarModal;
