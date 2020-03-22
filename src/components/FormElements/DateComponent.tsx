import React, { useState, FunctionComponent } from "react";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment";
import "moment/locale/fr";
import { Box } from "@material-ui/core";

moment.locale("fr");

interface DateProps {
   onChange: (date: MaterialUiPickersDate) => void;
   placeholder: string;
}

const DateComponent: FunctionComponent<DateProps> = ({ onChange: onChange_, placeholder }) => {
   const [selectedDate, handleDateChange] = useState<MaterialUiPickersDate>();

   const onChange = (date: MaterialUiPickersDate) => {
      handleDateChange(date);
      onChange_(date);
   };

   return (
      <Box paddingY="10px" width="100%">
         <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
               autoOk
               format="LL"
               disableToolbar
               variant="inline"
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