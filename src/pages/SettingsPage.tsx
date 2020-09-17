import { Button, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { Reservation } from "../components/reservation_form";
import { convertToReservation, Fauna, FDBGetAllReservations, FDBupdateReservationAsync } from "../FaunaDB/Api";
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
      const reservations: any = await FDBGetAllReservations();

      if (!reservations) return;

      const hash: HashMap<Array<Reservation>> = {};

      const data = reservations.data as Array<Fauna<Reservation>>;

      // store all reservations in a hash
      data.forEach(fReservation => {
         const reservation = convertToReservation(fReservation);

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
         for (let i = 0; i < res.length - 1; i++) {
            const currentReservation = res[i];
            const nextReservation = res[i + 1];

            let previousId = (currentReservation.id as unknown) as string;
            let nextId = (nextReservation.id as unknown) as string;

            if (!previousId || !nextId) return;

            // Asign next ID to current item
            res[i] = {
               ...currentReservation,
               next: nextId,
            };

            // Assign previous ID to the next item
            res[i + 1] = {
               ...nextReservation,
               previous: previousId,
            };
         }

         res[0] = { ...res[0], previous: "FIRST" };
         res[res.length - 1] = { ...res[res.length - 1], next: "LAST" };

         res.forEach(element => {
            FDBupdateReservationAsync(element);
         });
      }
      console.log("DONE");
   };

   return (
      <Grid container justify="center">
         <Button onClick={onClick} variant="contained" color="primary">
            MAKE PREV AND NEXT
         </Button>
      </Grid>
   );
};

export default SettingsPage;
