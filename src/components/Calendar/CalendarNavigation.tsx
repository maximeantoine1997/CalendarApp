import MomentUtils from "@date-io/moment";
import { Button, createStyles, Dialog, Grid, makeStyles, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import { Calendar, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { Moment } from "moment";
import React, { useState } from "react";
import useCalendarContext from "../../Contexts/CalendarContext";

const useStyles = makeStyles(() =>
   createStyles({
      calendar: {
         padding: "25px",
         minHeight: "50vh",
      },
      button: {
         margin: "auto",
      },
      root: {
         padding: "10px",
      },
      pointer: {
         cursor: "pointer",
      },
   })
);

const CalendarNavigation: React.FC = () => {
   const classes = useStyles();

   const { date, setDate } = useCalendarContext();

   const monday = date.clone().day(1).date();
   const sunday = date.clone().day(7).date();
   const month = date.format("MMMM");
   const fullWeek = `${monday}-${sunday} ${month}`;

   const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

   const onNextWeek = () => {
      const newDate = date.clone().add(7, "day");

      setDate(newDate);
   };

   const onPreviousWeek = () => {
      const newDate = date.clone().subtract(7, "day");

      setDate(newDate);
   };

   const onChangeCalendar = (newDate: MaterialUiPickersDate) => {
      setCalendarOpen(false);
      setDate(newDate as Moment);
   };

   return (
      <Grid container className={classes.root} direction="row">
         <Grid item xs={4}>
            <Grid container direction="row" alignItems="center" justify="center" alignContent="stretch">
               <Grid item>
                  <ArrowBackIosIcon onClick={() => onPreviousWeek()} className={classes.pointer} />
               </Grid>
               <Grid item>
                  <Typography align="center" style={{ paddingLeft: "10px", paddingRight: "10px", minWidth: "120px" }}>
                     {fullWeek}
                  </Typography>
               </Grid>
               <Grid item>
                  <ArrowForwardIosIcon onClick={() => onNextWeek()} className={classes.pointer} />
               </Grid>
            </Grid>
         </Grid>
         <Grid item xs={4}>
            <Grid container justify="center"></Grid>
         </Grid>
         <Grid item xs={4}>
            <Grid container justify="center">
               <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<InsertInvitationIcon />}
                  onClick={() => setCalendarOpen(true)}
               >
                  Choisir Date
               </Button>
            </Grid>
         </Grid>
         {calendarOpen && (
            <Dialog open={calendarOpen} className={classes.calendar}>
               <MuiPickersUtilsProvider utils={MomentUtils} locale="fr">
                  <Calendar date={date} allowKeyboardControl onChange={onChangeCalendar} />
               </MuiPickersUtilsProvider>
            </Dialog>
         )}
      </Grid>
   );
};

export default CalendarNavigation;
