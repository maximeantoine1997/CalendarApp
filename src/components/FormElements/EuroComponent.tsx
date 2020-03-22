import React, { FunctionComponent, ReactElement } from "react";
import TextField from "@material-ui/core/TextField";
import { Box, Grid, makeStyles, createStyles } from "@material-ui/core";
import EuroIcon from "@material-ui/icons/Euro";

const useStyles = makeStyles(() =>
   createStyles({
      color: {
         backgroundColor: "#E7EAED",
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
      <Box width="100%">
         <Grid container spacing={1} alignItems="center">
            <Grid item>
               <EuroIcon fontSize="large" />
            </Grid>
            <Grid item>
               <TextField
                  label={placeholder}
                  onBlur={onBlur}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  className={classes.color}
               />
            </Grid>
         </Grid>
      </Box>
   );
};

export default EuroComponent;
