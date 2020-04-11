import React, { useState } from "react";
import { Moment } from "moment";
import { Grid, Typography, Button, Dialog, makeStyles, createStyles } from "@material-ui/core";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import { DatePicker, MuiPickersUtilsProvider, Calendar } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { isFunction } from "../../Utils";

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

interface CalendarNavigationProps {
   currentDate: Moment;
   onChangeDate: (newDate: Moment) => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({ currentDate, onChangeDate }) => {
   const classes = useStyles();

   const monday = currentDate.clone().day(1).date();
   const sunday = currentDate.clone().day(7).date();
   const month = currentDate.format("MMMM");
   const fullWeek = `${monday}-${sunday} ${month}`;

   const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

   const onNextWeek = () => {
      const newDate = currentDate.clone().add(7, "day");

      onChangeDate(newDate);
   };

   const onPreviousWeek = () => {
      const newDate = currentDate.clone().subtract(7, "day");

      onChangeDate(newDate);
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
            <Typography align="center" variant="h5">
               Calendrier Antoine SPRL
            </Typography>
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
                  <Calendar
                     date={currentDate}
                     allowKeyboardControl
                     onChange={date => {
                        console.log(date);
                        setCalendarOpen(false);
                     }}
                  />
               </MuiPickersUtilsProvider>
            </Dialog>
         )}
      </Grid>
   );
};

export default CalendarNavigation;