import MomentUtils from "@date-io/moment";
import { Box } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment, { Moment } from "moment";
import "moment/locale/fr";
import React, { FunctionComponent, useState } from "react";

moment.locale("fr");

interface DateProps {
   onChange: (date: MaterialUiPickersDate) => void;
   placeholder: string;
   value?: Moment;
}

const DateComponent: FunctionComponent<DateProps> = ({ onChange: onChange_, placeholder, value = moment() }) => {
   const [selectedDate, handleDateChange] = useState<MaterialUiPickersDate>(value);

   const onChange = (date: MaterialUiPickersDate) => {
      handleDateChange(date);
      onChange_(date);
   };

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
