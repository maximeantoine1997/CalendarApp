import { createStyles, Grid, makeStyles } from "@material-ui/core";
import React, { useRef } from "react";
import TextComponent from "../components/FormElements/TextComponent";
import TextBox from "../components/FormElements/TextBox";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "5vh",
      },
   })
);

const NotePage = () => {
   const classes = useStyles();

   const titre = useRef<string>("");
   const description = useRef<string>("");

   return (
      <Grid
         container
         justify="center"
         alignContent="center"
         alignItems="center"
         className={classes.grid}
         style={{ border: "1px solid black" }}
      >
         <Grid item xs={12}>
            <TextComponent
               placeholder="Titre"
               onChange={e => {
                  if (typeof e === "string") {
                     titre.current = e;
                  }
               }}
               value={titre.current}
            />
         </Grid>
         <Grid item xs={12}>
            <TextBox
               placeholder="Notes"
               onChange={e => {
                  if (typeof e === "string") {
                     description.current = e;
                  }
               }}
            />
         </Grid>
      </Grid>
   );
};

export default NotePage;
