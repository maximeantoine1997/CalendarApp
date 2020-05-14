import { Menu, MenuItem, Divider } from "@material-ui/core";
import React, { useState } from "react";
import { typeColors, ReservationType } from "../../../Interfaces/Common";
import { Reservation } from "../../reservation_form";
import ColorBlock from "../Blocks/ColorBlock";
import { updateReservationAsync, deleteReservationAsync } from "../../../Firebase/Firebase.Utils";
import { useSnackbar } from "notistack";
import DeleteModal from "./DeleteModal";

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
            <MenuItem onClick={() => onClick("Preparation")}>
               <ColorBlock label="Préparation" color={typeColors["Preparation"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Livraison")}>
               <ColorBlock label="Livraison" color={typeColors["Livraison"]} />
            </MenuItem>
            <MenuItem onClick={() => onClick("Livre")}>
               <ColorBlock label="Livré" color={typeColors["Livre"]} />
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
