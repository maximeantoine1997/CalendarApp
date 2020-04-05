import React, { useEffect, FunctionComponent, ReactElement, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles, Typography } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { getFirebaseElementsAsync } from "../../Firebase/Firebase.Utils";

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
   url?: string;
   sortBy?: string;
   multiple?: boolean;
   hasError?: boolean;
   errorText?: string;
}

const TextComponent: FunctionComponent<TextProps> = ({
   placeholder,
   options: options_ = [],
   url,
   onChange,
   sortBy,
   multiple = false,
   hasError,
   errorText,
}): ReactElement => {
   const classes = useStyles();
   const [options, setOptions] = useState<Array<string>>(options_);

   const onBlur = (event: any) => {
      if (event) {
         const newValue = event.target.value;
         onChange(newValue);
      }
   };

   const onChangeMultiple = (value: any) => {
      if (multiple) {
         onChange(value);
         console.log(value);
      }
   };

   useEffect(() => {
      const getData = async () => {
         if (!options.length && url) {
            const elements = await getFirebaseElementsAsync(url);
            if (sortBy) {
               const sorted: Array<string> = [];

               elements.forEach(element => {
                  sorted.push(element[sortBy]);
               });
               return setOptions(sorted);
            }
            return setOptions(elements as Array<string>);
         }
      };
      getData();
   }, [options.length, options_, sortBy, url]);

   return (
      <>
         <Autocomplete
            className={classes.autocomplete}
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
                  variant="outlined"
                  InputProps={{ ...params.InputProps, type: "search" }}
                  className={classes.textbox}
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
