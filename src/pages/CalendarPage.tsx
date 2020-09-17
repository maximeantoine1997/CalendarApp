import { Box, createStyles, makeStyles } from "@material-ui/core";
import "firebase/functions";
import React from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarView from "../components/Calendar/CalendarView";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "92vh",
         paddingTop: "3vh",
      },
   })
);

const CalendarPage: React.FC = () => {
   const classes = useStyles();

   return (
      <Box className={classes.grid}>
         <CalendarNavigation />
         <CalendarView />
      </Box>
   );
};

export default CalendarPage;
