import { Grid } from "@material-ui/core";
import "firebase/functions";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import useDateContext from "../../Contexts/DateContext";
import { getReservations, Fauna, convertToReservation } from "../../FaunaDB/Api";
import { getWeekDays, HashMap } from "../../Utils";
import { Reservation } from "../reservation_form";
import CalendarWeekTab from "./CalendarWeekTab";

const CalendarWeekView: React.FC = () => {
   const { date, setReservations } = useDateContext();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const getData = async () => {
         getReservations(getWeekDays(date)).then((newReservations: any) => {
            const hash: HashMap<Reservation> = {};
            newReservations.forEach((res: Fauna<Reservation>) => {
               const reservation: Reservation = convertToReservation(res);
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
         });
      };
      getData();
   }, [date, enqueueSnackbar, setReservations]);

   const weekDays = getWeekDays(date);

   return (
      <Grid container direction="row">
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
