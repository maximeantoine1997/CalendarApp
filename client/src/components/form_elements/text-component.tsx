import React, { useEffect, useState, FunctionComponent, ReactElement } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Box } from "@material-ui/core";

interface TextProps {
   placeholder: string;
   onChange: (e: string) => void;
   options?: Array<string>;
}

const TextComponent: FunctionComponent<TextProps> = ({ placeholder, options = [], ...props }): ReactElement => {
   const onBlur = (event: any) => {
      if (event) {
         props.onChange(event.target.value);
         console.log(event.target.value);
      }
   };

   useEffect(() => {
      const getInitData = () => {
         try {
         } catch (error) {
            throw new Error(error);
         }
      };
      getInitData();
   }, []);

   console.log("I'm rendering...");

   return (
      <Box width="75%">
         <Autocomplete
            freeSolo
            disableClearable
            options={options.sort((a, b) => -b.charAt(0).localeCompare(a.charAt(0)))}
            groupBy={option => option.charAt(0).toUpperCase()}
            renderInput={params => (
               <TextField
                  {...params}
                  label={placeholder}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ ...params.InputProps, type: "search" }}
                  fullWidth
               />
            )}
            onBlur={event => onBlur(event as any)}
         />
      </Box>
   );
};

export default TextComponent;
