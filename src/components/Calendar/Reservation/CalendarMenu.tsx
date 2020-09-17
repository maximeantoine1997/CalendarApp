import { Divider, Menu, MenuItem } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import useCalendarContext from "../../../Contexts/CalendarContext";
import UseDragDrop from "../../../Hooks/UseDragDrop";
import { ReservationType, typeColors } from "../../../Utils";
import { Reservation } from "../../reservation_form";
import ColorBlock from "../Blocks/ColorBlock";
import DeleteModal from "./DeleteModal";

interface CalendarMenuProps {}

const CalendarMenu: React.FunctionComponent<CalendarMenuProps> = () => {
   const { enqueueSnackbar } = useSnackbar();
   const { updateReservation, closeMenu, menuReservation, anchorEl } = useCalendarContext();
   const { deleteDragDrop } = UseDragDrop();

   const [openModal, setOpenModal] = useState<boolean>(false);
   const [isopen, setIsOpen] = useState<boolean>(false);

   const onClick = (newType: ReservationType) => {
      const newReservation: Reservation = {
         ...(menuReservation as Reservation),
         type: newType,
      };

      try {
         updateReservation(newReservation);
         onClosMenu();
         enqueueSnackbar("Modifié", { variant: "success" });
      } catch {
         enqueueSnackbar("Erreur", { variant: "error" });
      }
   };

   const onDeleteReservation = async () => {
      await deleteDragDrop(menuReservation as Reservation).then(() => {
         enqueueSnackbar("Supprimé", { variant: "success" });
         onClosMenu();
      });
   };

   const onClosMenu = () => {
      setIsOpen(false);
      setOpenModal(false);
      console.log("CLOSE MENU");
      closeMenu();
   };

   useEffect(() => {
      if (anchorEl) {
         console.log("ANCHOR CHANGED");
         setIsOpen(Boolean(anchorEl));
      }
   }, [anchorEl]);

   return (
      <>
         <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={isopen}
            onClose={onClosMenu}
            onContextMenu={e => {
               e.preventDefault();
               onClosMenu();
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
            }}
            onDelete={onDeleteReservation}
            open={openModal}
         />
      </>
   );
};

export default CalendarMenu;
