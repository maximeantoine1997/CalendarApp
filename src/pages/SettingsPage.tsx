import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      grid: {
         height: "100%",
         // This makes sure that the content doesn't go under the navbar
         paddingTop: "5vh",
      },
   })
);

const SettingsPage = () => {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const classes = useStyles();

   return <></>;
};

export default SettingsPage;
