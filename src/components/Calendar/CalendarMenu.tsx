import { Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { typeColors, ReservationType } from "../../Interfaces/Common";
import { Reservation } from "../reservation_form";
import ColorBlock from "./Blocks/ColorBlock";
import { updateReservationAsync } from "../../Firebase/Firebase.Utils";
import { useSnackbar } from "notistack";

interface CalendarMenuProps {
   reservation: Reservation;
   anchorEl: null | HTMLElement;
   handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
   handleClose: () => void;
}

const CalendarMenu: React.FunctionComponent<CalendarMenuProps> = ({
   reservation,
   anchorEl,
   handleClick,
   handleClose,
}) => {
   const { enqueueSnackbar } = useSnackbar();

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

   return (
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
   );
};

export default CalendarMenu;
