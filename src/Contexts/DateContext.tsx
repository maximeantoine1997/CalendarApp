import moment, { Moment } from "moment";
import React, { createContext, ReactElement, ReactNode, useContext, useState } from "react";
import { HashMap, CalendarType } from "../Utils";
import { Reservation } from "../components/reservation_form";

interface IDateContext {
   date: Moment;
   setDate: React.Dispatch<React.SetStateAction<Moment>>;
   reservations: HashMap<Reservation>;
   updateReservations: (date: string, newReservations: Array<Reservation>) => void;
   setReservations: React.Dispatch<React.SetStateAction<HashMap<Reservation>>>;
   calendarType: CalendarType;
   setCalendarType: React.Dispatch<React.SetStateAction<CalendarType>>;
}

export const DateContext = createContext<IDateContext>({
   date: moment(),
   setDate: () => {},
   reservations: {},
   updateReservations: () => {},
   setReservations: () => {},
   calendarType: "general",
   setCalendarType: () => {},
});

export const DateContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [date, setDate] = useState<Moment>(moment());
   const [calendarType, setCalendarType] = useState<CalendarType>("general");
   const [reservations, setReservations] = useState<HashMap<Reservation>>({});

   const updateReservations = (date: string, newReservations: Array<Reservation>) => {
      const newHash = { ...reservations };
      newHash[date] = newReservations;
      setReservations(newHash);
   };

   const dateContext = {
      date,
      setDate,
      updateReservations,
      reservations,
      setReservations,
      calendarType,
      setCalendarType,
   };
   return <DateContext.Provider value={dateContext}>{props.children}</DateContext.Provider>;
};

const useDateContext = (): IDateContext => {
   const context = useContext(DateContext);
   if (context === null) {
      throw new Error("DateContext is not provided");
   }
   return context;
};

export default useDateContext;
