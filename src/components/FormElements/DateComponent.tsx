import MomentUtils from "@date-io/moment";
import { Box, Grid, Typography } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment, { Moment } from "moment";
import "moment/locale/fr";
import React, { FunctionComponent, useState } from "react";

moment.locale("fr");

interface DateProps {
   isReadOnly?: boolean;
   onChange: (date: MaterialUiPickersDate) => void;
   placeholder: string;
   value?: Moment;
}

const DateComponent: FunctionComponent<DateProps> = ({
   onChange: onChange_,
   placeholder,
   value = moment().format("DD/MM/YYYY"),
   isReadOnly = false,
}) => {
   const [selectedDate, handleDateChange] = useState<MaterialUiPickersDate>(moment(value));

   const onChange = (date: MaterialUiPickersDate) => {
      handleDateChange(date);
      onChange_(date);
   };

   if (isReadOnly) {
      return (
         <Grid container style={{ paddingTop: "10px" }}>
            <Grid item xs={12}>
               <Typography style={{ color: "#7C7B77" }}>{placeholder}:</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography>{moment(value).format("DD/MM/YYYY")}</Typography>
            </Grid>
         </Grid>
      );
   }
   return (
      <Box width="100%">
         <MuiPickersUtilsProvider utils={MomentUtils} locale="fr">
            <KeyboardDatePicker
               disableToolbar
               variant="dialog"
               format="DD/MM/YYYY"
               margin="normal"
               label={placeholder}
               value={selectedDate}
               onChange={onChange}
               KeyboardButtonProps={{
                  "aria-label": "change date",
               }}
            />
         </MuiPickersUtilsProvider>
      </Box>
   );
};

export default DateComponent;
