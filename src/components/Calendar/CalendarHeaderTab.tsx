import { Box, Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import moment, { Moment } from "moment";
import React, { useState } from "react";
import useCalendarContext from "../../Contexts/CalendarContext";
import { Note } from "../../FaunaDB/Api";
import NoteModal from "./Notes/NoteModal";

const useStyles = makeStyles(() =>
   createStyles({
      dateBox: {
         border: "1px solid #F4F4F4",
         width: "100%",
         background: "#F8F8F8",
         paddingTop: "10px",

         fontFamily: "Arial",
         fontWeight: "bold",
         height: "13vh",
      },
      date: {
         paddingLeft: "20px",
      },
      dateNumber: {
         fontSize: "2em",
      },
      addIcon: {
         "cursor": "pointer",
         "color": "#F8F8F8",
         "fontSize": "1.5em",
         "fontFamily": "arial",
         "transition": "0.3s",
         "&:hover": {
            transition: "0.3s",
            color: "black",
         },
      },
      notes: {
         backgroundColor: "#F5AD0B",
         color: "white",
         cursor: "pointer",
      },
   })
);

interface CalendarHeaderTabProps {
   day: Moment;
}

const CalendarHeaderTab: React.FunctionComponent<CalendarHeaderTabProps> = ({ day }) => {
   const classes = useStyles();
   const { notes } = useCalendarContext();

   const [open, setOpen] = useState(false);

   const dayName = day.format("dddd").substring(0, 2).toUpperCase();
   const dayDate = day.date();
   const dayNotes = notes[day.format("YYYY-MM-DD")];

   const onClose = () => {
      setOpen(false);
   };

   const onOpen = () => {
      setOpen(true);
   };

   const renderNotes = dayNotes?.length ? (
      <Box
         onClick={onOpen}
         textOverflow="ellipsis"
         overflow="hidden"
         fontSize="0.8em"
         className={classes.notes}
         paddingLeft="10px"
         paddingTop="5px"
         paddingBottom="5px"
      >
         {dayNotes?.map((note, index) => (dayNotes.length === index + 1 ? ` ${note.name}` : ` ${note.name},`))}
      </Box>
   ) : (
      <Box paddingLeft="20px" onClick={onOpen} className={classes.addIcon} style={{}}>
         +
      </Box>
   );

   return (
      <>
         <Grid
            item
            style={{ color: day.isSame(moment(), "date") ? "red" : "black" }}
            className={classes.dateBox}
            onDoubleClick={() => (window.location.href = `/reservation?date=${day.format("YYYY-MM-DD")}`)}
         >
            <Grid container direction="column" className={classes.date}>
               {dayName}
               <Box className={classes.dateNumber}>{dayDate}</Box>
            </Grid>
            <Box paddingTop="5px" minHeight="20px">
               {renderNotes}
            </Box>
         </Grid>
         <NoteModal open={open} onClose={onClose} day={day.format("YYYY-MM-DD")} />
      </>
   );
};

export default CalendarHeaderTab;
