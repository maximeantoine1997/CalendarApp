import { createStyles, makeStyles, Theme } from "@material-ui/core";
import EventNoteIcon from "@material-ui/icons/EventNote";
import SpeedDial from "@material-ui/lab/SpeedDial/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon/SpeedDialIcon";
import React from "react";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      addButton: {
         position: "absolute",
         bottom: "2vh",
         right: "2vw",
         color: "white",
      },
   })
);

const AddButton: React.FC = () => {
   const classes = useStyles();
   const { pathname } = useLocation();

   const [open, setOpen] = React.useState(false);
   const hidden = pathname === "/reservation";

   const handleOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const goTo = (link: string): void => {
      handleClose();
      window.location.href = link;
   };

   return (
      <SpeedDial
         ariaLabel="SpeedDial openIcon example"
         hidden={hidden}
         className={classes.addButton}
         icon={<SpeedDialIcon openIcon={<EventNoteIcon />} />}
         onClose={handleClose}
         onOpen={handleOpen}
         onClick={() => goTo("/reservation")}
         open={open}
      ></SpeedDial>
   );
};

export default AddButton;
