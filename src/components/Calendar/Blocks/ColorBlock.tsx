import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";

interface ColorBlockProps {
   /**
    * The color of the block.
    */
   color: "red" | "green" | "blue";

   /**
    * The type of Reservation.
    */
   label: string;
}

const ColorBlock: React.FunctionComponent<ColorBlockProps> = ({ color, label }) => {
   return (
      <Grid container alignItems="center" justify="flex-start" style={{ padding: "5px" }}>
         <Grid item>
            <Box width="15px" height="15px" marginRight="5px" style={{ backgroundColor: `${color}` }}></Box>
         </Grid>
         <Grid item>
            <Typography>{label}</Typography>
         </Grid>
      </Grid>
   );
};

export default ColorBlock;
