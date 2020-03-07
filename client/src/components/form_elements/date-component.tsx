import React, { useState } from "react";
import MomentUtils from "@date-io/moment";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment";
import "moment/locale/fr";
import { Box, FormControl, InputLabel } from "@material-ui/core";

moment.locale("fr");

interface DateProps {
  onChange: (date: MaterialUiPickersDate) => void;
  label: string;
}

const DateComponent = (props: DateProps) => {
  const [selectedDate, handleDateChange] = useState();

  const onChange = (date: MaterialUiPickersDate) => {
    handleDateChange(date);
    props.onChange(date);
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
          id="date-picker-inline"
          label={props.label}
          value={selectedDate}
          onChange={onChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
    </Box>
  );
};

export default DateComponent;
