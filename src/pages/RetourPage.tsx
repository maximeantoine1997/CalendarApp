import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CalendarNavigation from "../components/Calendar/CalendarNavigation";
import CalendarView from "../components/Calendar/CalendarView";

const useStyles = makeStyles(() => ({
   grid: {
      height: "92vh",
      paddingTop: "3vh",
   },
}));

interface RetourPageProps {
   /**
    * The identifier of the component.
    */
   identifier?: string;
}

const RetourPage: React.FunctionComponent<RetourPageProps> = ({ identifier }) => {
   const classes = useStyles();

   return (
      <Box className={classes.grid}>
         <CalendarNavigation />
         <CalendarView />
      </Box>
   );
};

export default RetourPage;
