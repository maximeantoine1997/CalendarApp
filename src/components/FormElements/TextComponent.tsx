import { createStyles, makeStyles, Typography, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { FunctionComponent, ReactElement, useState } from "react";

const useStyles = makeStyles(() =>
   createStyles({
      textbox: {
         backgroundColor: "#E7EAED",
      },
      autocomplete: {
         width: "100%",
      },
      errorText: {
         width: "100%",
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
   isReadOnly?: boolean;
   isRequired?: boolean;
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
   isReadOnly = false,
   isRequired = false,
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

   if (isReadOnly) {
      if (value) {
         if (multiple) {
            return (
               <Grid container style={{ paddingTop: "25px" }}>
                  <Grid item xs={12}>
                     <Typography style={{ color: "#7C7B77" }}>{placeholder}:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                     {value.map((val: string) => {
                        return <Typography>{val}</Typography>;
                     })}
                  </Grid>
               </Grid>
            );
         }
         return (
            <Grid container style={{ paddingTop: "10px" }}>
               <Grid item xs={12}>
                  <Typography style={{ color: "#7C7B77" }}>{placeholder}:</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography>{value}</Typography>
               </Grid>
            </Grid>
         );
      }

      return <></>;
   }

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
                  label={isRequired ? `${placeholder} *` : placeholder}
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
