import { Grid } from "@material-ui/core";
import "firebase/functions";
import React, { useState, useEffect } from "react";
import { CalendarType } from "../../Interfaces/Common";
import { Reservation } from "../reservation_form";

import useDateContext from "../../Contexts/DateContext";
import { getReservationsAsync } from "../../Firebase/Firebase.Utils";
import { useSnackbar } from "notistack";
import { IHash } from "../../Utils";
import CalendarWeekTab from "./CalendarWeekTab";

interface CalendarWeekViewProps {
   calendarType: CalendarType;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ calendarType }) => {
   const { date } = useDateContext();
   const { enqueueSnackbar } = useSnackbar();

   const [reservations, setReservations] = useState<IHash<Reservation>>({});

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
         console.log(hash);
         setReservations(hash);
      };
      getData();
   }, [date, enqueueSnackbar]);

   const getWeekDays = (): Array<string> => {
      const days: Array<string> = [];
      for (let i = 1; i < 8; i++) {
         days.push(date.clone().day(i).format("YYYY-MM-DD"));
      }
      return days;
   };
   const weekDays = getWeekDays();

   return (
      <Grid container justify="center" alignContent="space-around" direction="row">
         {weekDays.map((value, index) => {
            const data = reservations[value] || [];
            return (
               <Grid item key={index}>
                  <CalendarWeekTab data={[...data]} day={date.clone().day(index + 1)} key={index} type={calendarType} />
               </Grid>
            );
         })}
      </Grid>
   );
};

export default CalendarWeekView;
