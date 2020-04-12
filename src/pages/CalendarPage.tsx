import { Box, createStyles, makeStyles } from "@material-ui/core";
import "firebase/functions";
import moment, { Moment } from "moment";
import React, { useState } from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";

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

   const onChangeDate = (newDate: Moment) => {
      setDate(newDate);
   };

   return (
      <Box className={classes.grid}>
         <CalendarNavigation currentDate={date} onChangeDate={onChangeDate} />
         <CalendarWeekView currentDate={date} />
      </Box>
   );

   //    return <Redirect to="/" />;
};

export default CalendarPage;
