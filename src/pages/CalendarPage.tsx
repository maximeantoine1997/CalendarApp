import { Box, createStyles, makeStyles } from "@material-ui/core";
import "firebase/functions";
import React from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";
import { DateContextProvider } from "../Contexts/CalendarContext";

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
      <DateContextProvider>
         <Box className={classes.grid}>
            <CalendarNavigation />
            <CalendarWeekView />
         </Box>
      </DateContextProvider>
   );
};

export default CalendarPage;
