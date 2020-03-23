import React, { FunctionComponent, ReactElement, useState } from "react";
import { FormControlLabel, Typography, Switch, Box } from "@material-ui/core";

interface EuroProps {
   placeholder: string;
   onChange: (e: boolean) => void;
}

const CheckBoxComponent: FunctionComponent<EuroProps> = ({ placeholder, onChange }): ReactElement => {
   const [checked, setChecked] = useState<boolean>(false);

   const onCheck = (event: any, newCheck: boolean) => {
      onChange(newCheck);
      console.log(newCheck);
      setChecked(newCheck);
   };

   return (
      <Box width="100%">
         <FormControlLabel
            control={<Switch checked={checked} onChange={onCheck} name="Bancontact" color="primary" />}
            label={<Typography variant="h6">{placeholder}</Typography>}
            labelPlacement="start"
         />
      </Box>
   );
};

export default CheckBoxComponent;
