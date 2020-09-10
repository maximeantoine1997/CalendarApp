import moment, { Moment } from "moment";
import React, { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { Reservation } from "../components/reservation_form";
import {
   convertToNote,
   convertToReservation,
   Fauna,
   FDBDeleteNotesAsync,
   FDBDeleteReservationAsync,
   FDBGetNotes,
   FDBgetReservations,
   FDBupdateNotesAsync,
   FDBupdateReservationAsync,
   Note,
} from "../FaunaDB/Api";
import { getWeekDays, HashMap, IColumn, isNote, isReservation } from "../Utils";

interface ICalendarContext {
   date: Moment;
   setDate: React.Dispatch<React.SetStateAction<Moment>>;
   reservations: HashMap<Reservation>;
   updateReservation: (newReservation: Reservation) => void;
   setReservations: React.Dispatch<React.SetStateAction<HashMap<Reservation>>>;
   notes: HashMap<Note>;
   setNotes: React.Dispatch<React.SetStateAction<HashMap<Note>>>;
   columns: HashMap<IColumn>;
   setColumns: React.Dispatch<React.SetStateAction<HashMap<IColumn>>>;
   getReservations: (ids: Array<string>) => Array<Reservation>;
   deleteReservation: (reservation: Reservation) => void;
   isOpenModal: boolean;
   setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
   openModal: (reservation: Reservation) => void;
   closeModal: (reservation: Reservation) => void;
   modalReservation: Reservation | undefined;
   anchorEl: null | HTMLElement;
   menuReservation: Reservation | undefined;
   openMenu: (anchor: HTMLElement, reservation: Reservation) => void;
   closeMenu: () => void;
   getNotes: (ids: Array<string>) => Array<Note>;
   updateNote: (newNote: Note) => void;
   deleteNote: (note: Note) => void;
}

export const CalendarContext = createContext<ICalendarContext>({
   date: moment(),
   setDate: () => {},
   reservations: {},
   updateReservation: () => {},
   setReservations: () => {},
   notes: {},
   setNotes: () => {},
   columns: {},
   setColumns: () => {},
   getReservations: () => [],
   deleteReservation: () => {},
   isOpenModal: false,
   setIsOpenModal: () => {},
   openModal: () => {},
   closeModal: () => {},
   modalReservation: undefined,
   anchorEl: null,
   menuReservation: undefined,
   openMenu: () => {},
   closeMenu: () => {},
   getNotes: () => [],
   updateNote: () => {},
   deleteNote: () => {},
});

export const CalendarContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [date, setDate] = useState<Moment>(moment());
   const [reservations, setReservations] = useState<HashMap<Reservation>>({});
   const [notes, setNotes] = useState<HashMap<Note>>({});
   const [columns, setColumns] = useState<HashMap<IColumn>>({});

   // Whenever the date changes, get the data from DB & recreate the columns based on the new date
   useEffect(() => {
      const createColumns = (): HashMap<IColumn> => {
         const dates = getWeekDays(date);
         const cols: HashMap<IColumn> = {};
         dates.forEach(day => {
            cols[day] = {
               id: day,
               reservationIds: [],
               noteIds: [],
            };
         });
         return cols;
      };
      const populateHash = (
         items: Array<Fauna<Reservation | Note>>,
         conversion: Function,
         newColumns: HashMap<IColumn>
      ): void => {
         const hashElements: HashMap<Reservation | Note> = {};
         let cols = newColumns;
         items.forEach(item => {
            // Converts a Fauna DB item to a "normal" item
            const element: Reservation | Note = conversion(item);

            const id = element.id;
            if (!id) return;
            hashElements[id] = element;
            if (isReservation(element)) {
               const day = element.startDate;
               const res = cols[day].reservationIds;
               res.push((id as unknown) as string);
            }
            if (isNote(element)) {
               console.log(element);
               const day = element.date;
               const res = cols[day].noteIds;
               res.push(id as string);
            }
         });

         const element: Reservation | Note = conversion(items[0]);
         if (isReservation(element)) setReservations(hashElements as HashMap<Reservation>);
         if (isNote(element)) setNotes(hashElements as HashMap<Note>);
         setColumns(cols);
      };
      const getData = async () => {
         // We first create the columns to store the items from the DB
         const cols = createColumns();

         // Get the elements from Fauna DB
         const newReservations: any = await FDBgetReservations(getWeekDays(date));
         const newNotes: any = await FDBGetNotes(getWeekDays(date));

         // If no elements => error => return
         if (!newReservations || !newNotes) return;
         // creates the different necessary hashs for the frontend
         populateHash(newReservations, convertToReservation, cols);
         populateHash(newNotes, convertToNote, cols);
      };
      // We get the data from Fauna DB and push them in the respective columns
      getData();
      console.log("HASH POPULATION...");
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [date]);

   //#region RESERVATIONS
   const getReservations = (ids: Array<string>): Array<Reservation> => {
      const res: Array<Reservation> = [];
      ids.forEach(id => {
         const element = reservations[id];
         res.push(element);
      });
      return res;
   };
   const updateReservation = (newReservation: Reservation): void => {
      const newHash = { ...reservations };
      const id = newReservation.id;
      if (!id) return;
      newHash[id] = newReservation;

      // Update the modified Reservation in the hash
      setReservations(newHash);

      // Update the modified Reservation in the DB too
      try {
         FDBupdateReservationAsync({ ...newReservation });
      } catch (error) {
         console.log(error);
      }
   };

   const deleteReservation = (reservation: Reservation): void => {
      if (!reservation.id) return;
      delete reservations[reservation.id];

      FDBDeleteReservationAsync(reservation);
   };

   //#endregion

   //#region MODAL
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalReservation, setModalReservation] = useState<Reservation | undefined>(undefined);

   const openModal = (reservation: Reservation): void => {
      setIsOpenModal(true);
      setModalReservation(reservation);
   };

   const closeModal = (reservation: Reservation): void => {
      setIsOpenModal(false);
      setModalReservation(undefined);
   };

   //#endregion

   //#region RIGHT CLICK MENU

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [menuReservation, setMenuReservation] = useState<Reservation | undefined>(undefined);

   const openMenu = (anchor: HTMLElement, reservation: Reservation): void => {
      console.log("OPENING...", anchor, reservation);
      setAnchorEl(anchor);
      setMenuReservation(reservation);
   };

   const closeMenu = (): void => {
      setAnchorEl(null);
      setMenuReservation(undefined);
   };

   //#endregion

   //#region NOTES
   const getNotes = (ids: Array<string>): Array<Note> => {
      const res: Array<Note> = [];
      ids.forEach(id => {
         const element = notes[id];
         res.push(element);
      });
      return res;
   };

   const updateNote = (newNote: Note): void => {
      const newHash = { ...notes };
      const id = newNote.id;
      if (!id) return;
      newHash[id] = newNote;

      // Update the modified Reservation in the hash
      setNotes(newHash);

      // Update the modified Reservation in the DB too
      try {
         FDBupdateNotesAsync({ ...newNote });
      } catch (error) {
         console.log(error);
      }
   };

   const deleteNote = (note: Note): void => {
      if (!note.id) return;
      delete notes[note.id];

      FDBDeleteNotesAsync(note);
   };
   //#endregion
   const calendarContext = {
      date,
      setDate,
      notes,
      setNotes,
      columns,
      setColumns,
      reservations,
      setReservations,
      getReservations,
      updateReservation,
      deleteReservation,
      isOpenModal,
      setIsOpenModal,
      openModal,
      closeModal,
      modalReservation,
      anchorEl,
      openMenu,
      closeMenu,
      menuReservation,
      getNotes,
      updateNote,
      deleteNote,
   };
   return <CalendarContext.Provider value={calendarContext}>{props.children}</CalendarContext.Provider>;
};

const useCalendarContext = (): ICalendarContext => {
   const context = useContext(CalendarContext);
   if (context === null) {
      throw new Error("DateContext is not provided");
   }
   return context;
};

export default useCalendarContext;
