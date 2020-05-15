import { Grid } from "@material-ui/core";
import "firebase/functions";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import useDateContext from "../../Contexts/DateContext";
import { getReservationsAsync } from "../../Firebase/Firebase.Utils";
import { IHash } from "../../Utils";
import { Reservation } from "../reservation_form";
import CalendarWeekTab from "./CalendarWeekTab";

const CalendarWeekView: React.FC = () => {
   const { date, setReservations } = useDateContext();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const getData = async () => {
         enqueueSnackbar("Chargement...");
         const newReservations: Array<Reservation> = await getReservationsAsync(date.format("YYYY-MM-DD"));
         console.log("reservations are: ", newReservations);
         const hash: IHash<Reservation> = {};
         newReservations.forEach(reservation => {
            const start = reservation.startDate;

            const startData = hash[start];
            if (startData) {
               startData.push(reservation);
               hash[start] = startData;
            } else {
               hash[start] = [reservation];
            }
         });

         setReservations(hash);
      };
      getData();
   }, [date, enqueueSnackbar, setReservations]);

   const getWeekDays = (): Array<string> => {
      const days: Array<string> = [];
      for (let i = 1; i < 8; i++) {
         days.push(date.clone().day(i).format("YYYY-MM-DD"));
      }
      return days;
   };
   const weekDays = getWeekDays();

   console.log("Weekview rendering...");

   return (
      <Grid container justify="center" alignContent="space-around" direction="row">
         {weekDays.map((value, index) => {
            return (
               <Grid item key={index}>
                  <CalendarWeekTab day={date.clone().day(index + 1)} key={index} />
               </Grid>
            );
         })}
      </Grid>
   );
};

export default CalendarWeekView;
