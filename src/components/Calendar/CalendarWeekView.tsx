import { Grid } from "@material-ui/core";
import "firebase/functions";
import React, { useEffect } from "react";
import useCalendarContext from "../../Contexts/CalendarContext";
import { convertToNote, convertToReservation, Fauna, getNotes, getReservations, Note } from "../../FaunaDB/Api";
import { getWeekDays, HashMap } from "../../Utils";
import { Reservation } from "../reservation_form";
import CalendarWeekTab from "./CalendarWeekTab";

const CalendarWeekView: React.FC = () => {
   const { date, setReservations, setNotes } = useCalendarContext();

   useEffect(() => {
      const getData = async () => {
         const newReservations: any = await getReservations(getWeekDays(date));
         const newNotes: any = await getNotes(getWeekDays(date));
         if (!newReservations || !newNotes) return;
         const hasReservations: HashMap<Reservation> = {};
         const hashNotes: HashMap<Note> = {};
         newReservations.forEach((res: Fauna<Reservation>) => {
            const reservation: Reservation = convertToReservation(res);
            const start = reservation.startDate;
            const startData = hasReservations[start];

            if (startData) {
               startData.push(reservation);
               hasReservations[start] = startData;
            } else {
               hasReservations[start] = [reservation];
            }
         });
         newNotes.forEach((res: Fauna<Note>) => {
            const note: Note = convertToNote(res);
            const start = note.date;
            const startData = hashNotes[start];

            if (startData) {
               startData.push(note);
               hashNotes[start] = startData;
            } else {
               hashNotes[start] = [note];
            }
         });
         console.log(hashNotes);
         setReservations(hasReservations);
         setNotes(hashNotes);
      };
      getData();
   }, [date, setNotes, setReservations]);

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
