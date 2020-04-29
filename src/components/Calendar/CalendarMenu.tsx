import { Menu, MenuItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Reservation } from "../reservation_form";
import ColorBlock from "./Blocks/ColorBlock";

const useStyles = makeStyles(() => ({
   default: {},
}));

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
   const classes = useStyles();

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
         <MenuItem onClick={handleClose}>
            <ColorBlock label="Préparation" color="red" />
         </MenuItem>
         <MenuItem onClick={handleClose}>
            <ColorBlock label="Livraison" color="green" />
         </MenuItem>
         <MenuItem onClick={handleClose}>
            <ColorBlock label="Livré" color="blue" />
         </MenuItem>
      </Menu>
   );
};

export default CalendarMenu;
