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
         width: "100%",
      },
   })
);

interface EuroProps {
   placeholder: string;
   onChange: (e: number) => void;
   value?: number;
   variant?: "filled" | "outlined" | "standard";
}

const EuroComponent: FunctionComponent<EuroProps> = ({
   placeholder,
   onChange,
   value,
   variant = "outlined",
}): ReactElement => {
   const classes = useStyles();
   const onBlur = (event: any) => {
      if (event) {
         const newValue = event.target.value;
         onChange(newValue);
      }
   };

   return (
      <Box className={classes.textComponent}>
         <TextField
            label={placeholder}
            onBlur={onBlur}
            variant={variant}
            value={value}
            fullWidth
            margin="normal"
            className={variant === "outlined" ? classes.color : undefined}
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
