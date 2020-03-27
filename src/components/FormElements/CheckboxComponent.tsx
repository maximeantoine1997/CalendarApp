import React, { FunctionComponent, ReactElement, useState } from "react";
import { FormControlLabel, Typography, Box, Checkbox, makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
   createStyles({
      checkboxComponent: {
         paddingLeft: "20%",
         paddingRight: "20%",
         width: "60%",
         height: "100%",
         alignItems: "center",
      },
   })
);

interface EuroProps {
   placeholder: string;
   onChange: (e: boolean) => void;
}

const CheckBoxComponent: FunctionComponent<EuroProps> = ({ placeholder, onChange }): ReactElement => {
   const classes = useStyles();

   const [checked, setChecked] = useState<boolean>(false);

   const onCheck = (event: any, newCheck: boolean) => {
      onChange(newCheck);
      console.log(newCheck);
      setChecked(newCheck);
   };

   return (
      <Box className={classes.checkboxComponent}>
         <FormControlLabel
            style={{ width: "100%", height: "100%" }}
            control={<Checkbox checked={checked} onChange={onCheck} name="Bancontact" color="primary" />}
            label={<Typography variant="h6">{placeholder}</Typography>}
         />
      </Box>
   );
};

export default CheckBoxComponent;
