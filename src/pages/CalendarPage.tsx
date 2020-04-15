import { Box, createStyles, makeStyles } from "@material-ui/core";
import "firebase/functions";
import moment, { Moment } from "moment";
import React, { useState } from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";
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

   const [date, setDate] = useState<Moment>(moment());
   const [calendarType, setCalendarType] = useState<CalendarType>(CalendarType.preparation);

   const onChangeDate = (newDate: Moment) => {
      setDate(newDate);
   };

   const onChangeCalendarType = (type: CalendarType) => {
      setCalendarType(type);
   };

   return (
      <Box className={classes.grid}>
         <CalendarNavigation
            currentDate={date}
            onChangeDate={onChangeDate}
            onChangeCalendarType={onChangeCalendarType}
         />
         <CalendarWeekView currentDate={date} calendarType={calendarType} />
      </Box>
   );

   //    return <Redirect to="/" />;
};

export default CalendarPage;
