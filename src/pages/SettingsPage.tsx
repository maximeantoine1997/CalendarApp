import { Button, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { Reservation } from "../components/reservation_form";
import { Fauna, FDBconvertToReservation, FDBGetAllReservations, FDBUpdateReservationsAsync } from "../FaunaDB/Api";
import { HashMap } from "../Utils";

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

   const onClick = async () => {
      const data: { data: Array<Fauna<Reservation>> } = (await FDBGetAllReservations()) as {
         data: Array<Fauna<Reservation>>;
      };
      console.log(data);
      if (!data) return;
      const hash: HashMap<Array<Reservation>> = {};
      // store all reservations in a hash
      data.data.forEach(async fReservation => {
         const reservation = FDBconvertToReservation(fReservation);
         const date = reservation.startDate;
         // add new element to existing array
         if (hash[date]) {
            const newHash = Array.from(hash[date]);
            newHash.push(reservation);
            hash[date] = newHash;
            return;
         }
         // hash has nothing stored yet so create array
         hash[date] = [reservation];
      });
      for (let date in hash) {
         const res = hash[date];
         const resToUpdate: Array<Reservation> = [];
         for (let i = 0; i < res.length; i++) {
            const currentReservation = res[i];
            currentReservation.columnIndex = i;

            resToUpdate.push(currentReservation);
         }
         console.log(resToUpdate);
         await FDBUpdateReservationsAsync(resToUpdate);
      }
      console.log("DONE");
   };

   return (
      <Grid container justify="center">
         <Button onClick={onClick} variant="contained" color="primary">
            Fix Calendrier
         </Button>
      </Grid>
   );
};

export default SettingsPage;
