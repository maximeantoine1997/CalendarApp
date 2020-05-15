import { Menu, MenuItem, Divider } from "@material-ui/core";
import React, { useState } from "react";
import { Reservation } from "../../reservation_form";
import { updateReservationAsync, deleteReservationAsync } from "../../../Firebase/Firebase.Utils";
import { useSnackbar } from "notistack";
import DeleteModal from "./DeleteModal";
import { ReservationType, typeColors } from "../../../Utils";
import ColorBlock from "../Blocks/ColorBlock";

interface CalendarMenuProps {
   reservation: Reservation;
   anchorEl: null | HTMLElement;
   handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
   handleClose: () => void;
   handleDelete: () => void;
}

const CalendarMenu: React.FunctionComponent<CalendarMenuProps> = ({
   reservation,
   anchorEl,
   handleClick,
   handleClose,
   handleDelete,
}) => {
   const { enqueueSnackbar } = useSnackbar();

   const [openModal, setOpenModal] = useState<boolean>(false);

   const onClick = (newType: ReservationType) => {
      reservation.type = newType;
      try {
         updateReservationAsync(reservation);
         enqueueSnackbar("Succes", { variant: "success" });
      } catch {
         enqueueSnackbar("Erreur", { variant: "error" });
      }

      handleClose();
   };

   const deleteReservation = () => {
      try {
         deleteReservationAsync(reservation);
         enqueueSnackbar("Succes", { variant: "success" });
         setOpenModal(false);
      } catch {
         enqueueSnackbar("Erreur", { variant: "error" });
      }

      handleDelete();
   };

   return (
      <>
         <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onContextMenu={e => {
               e.preventDefault();
               handleClose();
            }}
         >
            <MenuItem onClick={() => setOpenModal(true)}>Supprimer </MenuItem>
            <Divider />
            <MenuItem onClick={() => onClick("A Livrer")}>
               <ColorBlock label="A Livrer" color={typeColors["A Livrer"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Annulé")}>
               <ColorBlock label="Annulé" color={typeColors["Annulé"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Attente Caution")}>
               <ColorBlock label="Attente Caution" color={typeColors["Attente Caution"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Client Vient Chercher")}>
               <ColorBlock label="Client Vient Chercher" color={typeColors["Client Vient Chercher"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Dépannage")}>
               <ColorBlock label="Dépannage" color={typeColors["Dépannage"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Divers")}>
               <ColorBlock label="Divers" color={typeColors["Divers"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Doit Confirmer")}>
               <ColorBlock label="Doit Confirmer" color={typeColors["Doit Confirmer"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Livraison par Transporteur")}>
               <ColorBlock label="Livraison par Transporteur" color={typeColors["Livraison par Transporteur"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Livré / Venu Chercher")}>
               <ColorBlock label="Livré / Venu Chercher" color={typeColors["Livré / Venu Chercher"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Rendez-vous")}>
               <ColorBlock label="Rendez-vous" color={typeColors["Rendez-vous"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Retour")}>
               <ColorBlock label="Retour" color={typeColors["Retour"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Transport")}>
               <ColorBlock label="Transport" color={typeColors["Transport"]} />
            </MenuItem>
         </Menu>
         <DeleteModal
            onClose={() => {
               setOpenModal(false);
               handleDelete();
            }}
            onDelete={deleteReservation}
            open={openModal}
         />
      </>
   );
};

export default CalendarMenu;
