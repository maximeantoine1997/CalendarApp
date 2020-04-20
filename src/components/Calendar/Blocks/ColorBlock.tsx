import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
   default: {},
}));

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
   const classes = useStyles();

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
