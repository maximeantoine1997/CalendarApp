import React, { FunctionComponent, ReactElement } from "react";
import TextField from "@material-ui/core/TextField";
import { Box, makeStyles, createStyles, InputAdornment } from "@material-ui/core";
import EuroIcon from "@material-ui/icons/Euro";

const useStyles = makeStyles(() =>
   createStyles({
      color: {
         backgroundColor: "#E7EAED",
      },
      textComponent: {
         paddingLeft: "20%",
         paddingRight: "20%",
         width: "60%",
      },
   })
);

interface EuroProps {
   placeholder: string;
   onChange: (e: string) => void;
}

const EuroComponent: FunctionComponent<EuroProps> = ({ placeholder, onChange }): ReactElement => {
   const classes = useStyles();
   const onBlur = (event: any) => {
      if (event) {
         const newValue = event.target.value;
         onChange(newValue);
         console.log(newValue);
      }
   };

   return (
      <Box className={classes.textComponent}>
         <TextField
            label={placeholder}
            onBlur={onBlur}
            variant="outlined"
            fullWidth
            margin="normal"
            className={classes.color}
            InputProps={{
               startAdornment: (
                  <InputAdornment position="start">
                     <EuroIcon />
                  </InputAdornment>
               ),
            }}
         />
      </Box>
   );
};

export default EuroComponent;
