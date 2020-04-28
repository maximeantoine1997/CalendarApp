import { Box, createStyles, makeStyles } from "@material-ui/core";
import "firebase/functions";
import React, { useState } from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";
import { DateContextProvider } from "../Contexts/DateContext";
import { CalendarType } from "../Interfaces/Common";

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

   const [calendarType, setCalendarType] = useState<CalendarType>("preparation");

   const onChangeCalendarType = (type: CalendarType) => {
      setCalendarType(type);
   };

   return (
      <DateContextProvider>
         <Box className={classes.grid}>
            <CalendarNavigation onChangeCalendarType={onChangeCalendarType} calendarType={calendarType} />
            <CalendarWeekView calendarType={calendarType} />
         </Box>
      </DateContextProvider>
   );

   //    return <Redirect to="/" />;
};

export default CalendarPage;
