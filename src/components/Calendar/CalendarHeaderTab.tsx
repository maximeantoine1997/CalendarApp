import React, { useState } from "react";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core";
import moment, { Moment } from "moment";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() =>
   createStyles({
      date: {
         border: "1px solid #F4F4F4",
         width: "100%",
         background: "#F8F8F8",
         paddingTop: "10px",
         paddingLeft: "20px",
         fontFamily: "Arial",
         fontWeight: "bold",
         height: "13vh",
      },
      dateNumber: {
         fontSize: "2em",
      },
   })
);

interface CalendarHeaderTabProps {
   day: Moment;
}

const CalendarHeaderTab: React.FunctionComponent<CalendarHeaderTabProps> = ({ day }) => {
   const classes = useStyles();

   const dayName = day.format("dddd").substring(0, 2).toUpperCase();
   const dayDate = day.date();

   const [hover, setHover] = useState(false);

   return (
      <Grid
         item
         style={{ color: day.isSame(moment(), "date") ? "red" : "black" }}
         className={classes.date}
         onDoubleClick={() => (window.location.href = `/reservation?date=${day.format("YYYY-MM-DD")}`)}
      >
         <Grid container direction="column">
            {dayName}
            <Box className={classes.dateNumber}>{dayDate}</Box>
            <Box
               paddingTop="5px"
               minHeight="20px"
               onMouseEnter={() => setHover(true)}
               onMouseLeave={() => setHover(false)}
            >
               {hover && <AddIcon style={{ cursor: "pointer", color: "#636363" }} />}
            </Box>
         </Grid>
      </Grid>
   );
};

export default CalendarHeaderTab;
