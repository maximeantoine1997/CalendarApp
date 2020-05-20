import { Box, Checkbox, createStyles, FormControlLabel, makeStyles } from "@material-ui/core";
import React, { FunctionComponent, ReactElement, useState } from "react";

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
   value: boolean;
   orientation?: "start" | "end";
   color?: "primary" | "secondary";
}

const CheckBoxComponent: FunctionComponent<EuroProps> = ({
   value,
   placeholder,
   onChange,
   orientation = "end",
   color = "primary",
}): ReactElement => {
   const classes = useStyles();

   const [checked, setChecked] = useState<boolean>(value);

   const onCheck = (event: any, newCheck: boolean) => {
      onChange(newCheck);
      setChecked(newCheck);
   };

   return (
      <Box className={classes.checkboxComponent}>
         <FormControlLabel
            control={<Checkbox checked={checked} onChange={onCheck} name="Bancontact" color={color} />}
            label={placeholder}
            labelPlacement={orientation}
         />
      </Box>
   );
};

export default CheckBoxComponent;
