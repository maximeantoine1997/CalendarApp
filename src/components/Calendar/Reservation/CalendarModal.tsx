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
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import useCalendarContext from "../../../Contexts/CalendarContext";
import { FDBGetReservationsV2 } from "../../../FaunaDB/Api";
import UseDragDrop from "../../../Hooks/UseDragDrop";
import { IColumn } from "../../../Utils";
import DateComponent from "../../FormElements/DateComponent";
import SquareButtons from "../../FormElements/SquareButton";
import TextBox from "../../FormElements/TextBox";
import TextComponent from "../../FormElements/TextComponent";
import { KVReservation, Reservation } from "../../reservation_form";

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
interface CalendarModalProps {}

const CalendarModal: React.FC<CalendarModalProps> = () => {
   const classes = useStyles();
   const { closeModal, modalReservation, columns, setColumns, updateReservation } = useCalendarContext();
   const { updateDragDrop } = UseDragDrop();
   const { enqueueSnackbar } = useSnackbar();

   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
   const reservation = useRef<KVReservation>({ ...(modalReservation as Reservation) });
   const modifiedReservation = useRef<KVReservation>({ ...(modalReservation as Reservation) });

   const onModify = () => {
      modifiedReservation.current = { ...reservation.current };
      setIsReadOnly(false);
   };

   const onCancel = () => {
      setIsReadOnly(true);
   };

   const onSave = async () => {
      // If startDate is Moment object => change it to string
      if (typeof modifiedReservation.current.startDate !== "string") {
         modifiedReservation.current.startDate = modifiedReservation.current.startDate.format("YYYY-MM-DD");
      }

      const oldDate = reservation.current.startDate;
      const newDate = modifiedReservation.current.startDate;

      if (oldDate !== newDate) {
         const start = columns[oldDate];
         const finish: IColumn | undefined = columns[newDate];

         console.log(finish);
         let finishRes: Array<Reservation> = [];
         if (!finish) {
            finishRes = await FDBGetReservationsV2(newDate);
         }

         // Item moves to another column
         const startReservationIds = Array.from(start.reservationIds);

         // Removes element from start column
         const index = startReservationIds.indexOf(reservation.current.id!);

         if (index === -1) throw Error("ID not found");

         startReservationIds.splice(index, 1);

         const finishReservationIds = finish
            ? Array.from(finish.reservationIds)
            : finishRes.map(res => res.id as string);

         console.log("ids: ", finishReservationIds);
         // Places the id of the reservation at last index of new column
         finishReservationIds.splice(finishReservationIds.length, 0, reservation.current.id!);

         const newStart: IColumn = {
            ...start,
            reservationIds: startReservationIds,
         };

         const newColumns = { ...columns };

         if (finish) {
            const newFinish: IColumn = {
               ...finish,
               reservationIds: finishReservationIds,
            };

            newColumns[newStart.id] = newStart;
            newColumns[newFinish.id] = newFinish;
         } else {
            newColumns[newStart.id] = newStart;
         }

         // Update previous reservation with the new modified one
         reservation.current = { ...modifiedReservation.current };

         setColumns(newColumns);
         if (finish) {
            await updateDragDrop(
               startReservationIds,
               finishReservationIds,
               reservation.current.id!,
               newDate,
               reservation.current
            );
         } else {
            // No finish date in columns (so other week)
            await updateDragDrop(
               startReservationIds,
               finishReservationIds,
               reservation.current.id!,
               newDate,
               reservation.current,
               finishRes
            );
         }

         // Update previous reservation with the new modified one
         reservation.current = { ...modifiedReservation.current };

         // Make the Modal read-only again
         setIsReadOnly(true);

         onClose(reservation.current);

         return;
      }

      // Update previous reservation with the new modified one
      reservation.current = { ...modifiedReservation.current };

      // Make the Modal read-only again
      setIsReadOnly(true);

      updateReservation({ ...modifiedReservation.current });

      enqueueSnackbar("Modifié", { variant: "success" });

      onClose(reservation.current);
   };

   const onChange = (key: keyof Reservation, value: unknown) => {
      const res = modifiedReservation.current;
      res[key] = value;
   };

   const onClose = (reservation: Reservation) => {
      closeModal(reservation);
      setIsOpen(false);
   };

   useEffect(() => {
      if (modalReservation) {
         // Change reservation.current to the new modalReservation
         reservation.current = modalReservation;
         setIsOpen(true);
      }
   }, [modalReservation]);

   return (
      <Dialog open={isOpen} onClose={() => onClose(reservation.current)} fullWidth maxWidth="lg" scroll="paper">
         <DialogContent>
            <Grid container>
               <Grid container className={classes.dialog} direction="row" justify="center" alignContent="flex-start">
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography style={{ fontSize: "1.3em", fontWeight: "bold" }} variant="h5">
                           Date:
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <DateComponent
                           isReadOnly={isReadOnly}
                           placeholder="Début"
                           onChange={(e: any) => onChange("startDate", e)}
                           value={reservation.current.startDate}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <Typography style={{ fontSize: "1.3em", fontWeight: "bold", paddingTop: "10px" }} variant="h5">
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
                        <Typography style={{ fontSize: "1.3em", fontWeight: "bold" }} variant="h5">
                           Chantier:
                        </Typography>
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
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="N° Chantier"
                           onChange={e => onChange("sitePhone", e)}
                           value={reservation.current.sitePhone}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                  </Grid>
                  <Grid item xs={4}>
                     <Grid item xs={12}>
                        <Typography style={{ fontSize: "1.3em", fontWeight: "bold" }} variant="h5">
                           Client:
                        </Typography>
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
                           placeholder="N° TVA"
                           onChange={e => onChange("VATNumber", e)}
                           value={reservation.current.VATNumber}
                           variant="standard"
                           customClass={{ width: "90%" }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextComponent
                           isReadOnly={isReadOnly}
                           placeholder="Adresse de facturation"
                           onChange={e => onChange("facturationAddress", e)}
                           value={reservation.current.facturationAddress}
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
                        <Typography style={{ fontSize: "1.3em", fontWeight: "bold", paddingTop: "10px" }} variant="h5">
                           Info:
                        </Typography>
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
                     {(reservation.current.amount > 0 || !isReadOnly) && (
                        <>
                           <Grid item xs={12}>
                              <Typography
                                 style={{ fontSize: "1.3em", fontWeight: "bold", paddingTop: "10px" }}
                                 variant="h5"
                              >
                                 Caution:
                              </Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <TextComponent
                                 isReadOnly={isReadOnly}
                                 variant="standard"
                                 placeholder="Montant"
                                 value={reservation.current.amount || "0"}
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
                        </>
                     )}
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
