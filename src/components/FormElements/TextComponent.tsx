import React, { useEffect, FunctionComponent, ReactElement, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles, createStyles } from "@material-ui/core";
import { getFirebaseElementsAsync } from "Firebase/Firebase.Utils";

const useStyles = makeStyles(() =>
   createStyles({
      textbox: {
         backgroundColor: "#E7EAED",
      },
      autocomplete: {
         width: "90%",
      },
      grid: {},
   })
);

interface TextProps {
   placeholder: string;
   onChange: (e: string) => void;
   options?: Array<string>;
   url?: string;
   sortBy?: string;
   multiple?: boolean;
}

const TextComponent: FunctionComponent<TextProps> = ({
   placeholder,
   options: options_ = [],
   url,
   onChange,
   sortBy,
   multiple = false,
}): ReactElement => {
   const classes = useStyles();
   const [options, setOptions] = useState<Array<string>>(options_);

   const onBlur = (event: any) => {
      if (event) {
         const newValue = event.target.value;
         onChange(newValue);
         console.log(newValue);
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
      <Autocomplete
         className={classes.autocomplete}
         multiple={multiple}
         freeSolo
         disableClearable
         options={options.sort((a, b) => -b.charAt(0).localeCompare(a.charAt(0)))}
         groupBy={option => option.charAt(0).toUpperCase()}
         renderInput={params => (
            <TextField
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
      />
   );
};

export default TextComponent;
