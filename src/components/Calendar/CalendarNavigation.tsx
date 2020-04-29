import React, { useState } from "react";
import { Moment } from "moment";
import { Grid, Typography, Button, Dialog, makeStyles, createStyles } from "@material-ui/core";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import { MuiPickersUtilsProvider, Calendar } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { CalendarType } from "../../Interfaces/Common";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import useDateContext from "../../Contexts/DateContext";

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
   calendarType: CalendarType;
   onChangeCalendarType: (type: CalendarType) => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({ onChangeCalendarType, calendarType }) => {
   const classes = useStyles();

   const { date, setDate } = useDateContext();

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
            <Grid container justify="center">
               <ToggleButtonGroup value={calendarType} exclusive onChange={(_, v) => onChangeCalendarType(v)}>
                  <ToggleButton value="preparation">PREPARATION</ToggleButton>
                  <ToggleButton value="livraison">LIVRAISON</ToggleButton>
               </ToggleButtonGroup>
            </Grid>
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
