import { createStyles, makeStyles, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { FunctionComponent, ReactElement, useState } from "react";

const useStyles = makeStyles(() =>
   createStyles({
      textbox: {
         backgroundColor: "#E7EAED",
      },
      autocomplete: {
         paddingLeft: "10%",
         paddingRight: "10%",
         width: "80%",
      },
      errorText: {
         paddingLeft: "10%",
         paddingRight: "10%",
         width: "80%",
         color: "red",
      },
   })
);

interface TextProps {
   placeholder: string;
   onChange: (e: string | Array<string>) => void;
   options?: Array<string>;
   multiple?: boolean;
   hasError?: boolean;
   errorText?: string;
   customClass?: any;
   value?: any;
   variant?: "filled" | "outlined" | "standard";
}

const TextComponent: FunctionComponent<TextProps> = ({
   placeholder,
   options = [],
   onChange,
   multiple = false,
   hasError,
   errorText,
   customClass,
   value = multiple ? [] : "",
   variant = "outlined",
}): ReactElement => {
   const classes = useStyles();

   const [multipleValue, setMultipleValue] = useState<Array<string>>(value);

   const onBlur = (event: any) => {
      if (event && !multiple) {
         const newValue = event.target.value;

         onChange(newValue);
      }
   };

   const onChangeMultiple = (value: any) => {
      if (multiple) {
         onChange(value);
         setMultipleValue(value);
      }
   };

   return (
      <>
         <Autocomplete
            className={customClass ? undefined : classes.autocomplete}
            value={multiple ? multipleValue : value}
            style={customClass}
            multiple={multiple}
            freeSolo
            disableClearable
            options={options.sort((a, b) => -b.charAt(0).localeCompare(a.charAt(0)))}
            groupBy={option => option.charAt(0).toUpperCase()}
            renderInput={params => (
               <TextField
                  error={hasError}
                  {...params}
                  label={placeholder}
                  fullWidth
                  margin="normal"
                  variant={variant}
                  InputProps={{ ...params.InputProps, type: "search" }}
                  className={variant === "outlined" ? classes.textbox : undefined}
               />
            )}
            onBlur={event => onBlur(event as any)}
            onChange={(event: object, value: any) => onChangeMultiple(value)}
         />
         {hasError && <Typography className={classes.errorText}>{errorText}</Typography>}
      </>
   );
};

export default TextComponent;
