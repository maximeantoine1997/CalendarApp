import { createStyles, Grid, makeStyles } from "@material-ui/core";
import React, { useRef } from "react";
import TextComponent from "../components/FormElements/TextComponent";
import useUserContext from "../Contexts/UserContext";

const useStyles = makeStyles(() =>
   createStyles({
      grid: {
         height: "95vh",
         paddingTop: "5vh",
      },
   })
);

const AccountPage = () => {
   const classes = useStyles();

   const { user } = useUserContext();

   const email = useRef<string>(user?.email || "");
   const username = useRef<string>(user?.displayName || "");

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
               placeholder="Username"
               onChange={e => {
                  if (typeof e === "string") {
                     username.current = e;
                  }
               }}
               value={username.current}
               customClass={{ paddingLeft: "30%", width: "40%", paddingRight: "30%" }}
            />
         </Grid>
         <Grid item xs={12}>
            <TextComponent
               placeholder="Email"
               onChange={e => {
                  if (typeof e === "string") {
                     email.current = e;
                  }
               }}
               value={email.current}
               customClass={{ paddingLeft: "30%", width: "40%", paddingRight: "30%" }}
            />
         </Grid>
      </Grid>
   );
};

export default AccountPage;
