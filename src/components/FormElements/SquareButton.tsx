import { Button, Grid } from "@material-ui/core";
import React, { ReactElement, useState } from "react";

interface SquareButtonProps {
   /**
    * The icon of the left button.
    */
   iconLeft: ReactElement;

   /**
    * The icon of the right button.
    */
   iconRight: ReactElement;

   /**
    * The label of the left button.
    */
   labelLeft: string;

   /**
    * The label of the right button.
    */
   labelRight: string;

   onClick: (value: boolean) => void;

   value: boolean;
}

const SquareButtons: React.FunctionComponent<SquareButtonProps> = ({
   iconLeft,
   labelLeft,
   iconRight,
   labelRight,
   onClick: onClick_,
   value,
}) => {
   const [isActive, setIsActive] = useState<boolean>(value);

   const onClick = (newValue: boolean, button: number) => {
      if ((newValue && button === 2) || (!newValue && button === 1)) {
         const newIsActive = !newValue;
         console.log("newIsActive is: ", newIsActive);
         onClick_(newIsActive);
         setIsActive(newIsActive);
      }
   };
   return (
      <Grid container justify="flex-start" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
         <Button
            variant="outlined"
            color={isActive ? "secondary" : "default"}
            onClick={() => onClick(isActive, 1)}
            style={{ marginRight: "20px" }}
         >
            <Grid container justify="center">
               <Grid item xs={12}>
                  {iconLeft}
               </Grid>
               <Grid item xs={12}>
                  {labelLeft}
               </Grid>
            </Grid>
         </Button>

         <Button variant="outlined" color={isActive ? "default" : "secondary"} onClick={() => onClick(isActive, 2)}>
            <Grid container justify="center">
               <Grid item xs={12}>
                  {iconRight}
               </Grid>
               <Grid item xs={12}>
                  {labelRight}
               </Grid>
            </Grid>
         </Button>
      </Grid>
   );
};

export default SquareButtons;
