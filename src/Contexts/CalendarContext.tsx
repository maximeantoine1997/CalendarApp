import moment, { Moment } from "moment";
import React, { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { Reservation } from "../components/reservation_form";
import {
   FDBconvertToNote,
   FDBconvertToReservation,
   Fauna,
   FDBcreateReservationAsync,
   FDBDeleteNotesAsync,
   FDBDeleteReservationAsync,
   FDBGetNotes,
   FDBgetReservationsAsync,
   FDBupdateNotesAsync,
   FDBupdateReservationAsync,
   FDBUpdateReservationsAsync,
   Note,
} from "../FaunaDB/Api";
import { getWeekDays, HashMap, IColumn, isNote, isReservation } from "../Utils";

interface ICalendarContext {
   date: Moment;
   setDate: React.Dispatch<React.SetStateAction<Moment>>;
   reservations: HashMap<Reservation>;
   addReservation: (newReservation: Reservation) => Promise<Reservation | undefined>;
   updateReservations: (newReservations: Array<Reservation>) => Promise<void>;
   updateReservation: (newReservation: Reservation) => Promise<void>;
   setReservations: React.Dispatch<React.SetStateAction<HashMap<Reservation>>>;
   notes: HashMap<Note>;
   setNotes: React.Dispatch<React.SetStateAction<HashMap<Note>>>;
   columns: HashMap<IColumn>;
   setColumns: React.Dispatch<React.SetStateAction<HashMap<IColumn>>>;
   getReservation: (ids: string) => Reservation | undefined;
   getReservations: (ids: Array<string>) => Array<Reservation>;
   deleteReservation: (reservation: Reservation) => Promise<void>;
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
   setNewReservationId: React.Dispatch<React.SetStateAction<string>>;
   setResUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CalendarContext = createContext<ICalendarContext>({
   date: moment(),
   setDate: () => {},
   reservations: {},
   addReservation: async () => undefined,
   updateReservation: async () => {},
   updateReservations: async () => {},
   setReservations: () => {},
   notes: {},
   setNotes: () => {},
   columns: {},
   setColumns: () => {},
   getReservation: () => undefined,
   getReservations: () => [],
   deleteReservation: async () => {},
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
   setNewReservationId: () => {},
   setResUpdate: () => {},
});

export const CalendarContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [date, setDate] = useState<Moment>(moment());
   const [reservations, setReservations] = useState<HashMap<Reservation>>({});
   const [notes, setNotes] = useState<HashMap<Note>>({});
   const [columns, setColumns] = useState<HashMap<IColumn>>({});

   const [newReservationId, setNewReservationId] = useState("");
   const [resUpdate, setResUpdate] = useState(false);

   // Whenever the date changes, get the data from DB & recreate the columns based on the new date
   useEffect(() => {
      console.log("getData TRIGGERED...");

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

      const fixOrdering = (
         ids: Array<string>,
         reservations: HashMap<Reservation>,
         notFoundIndex: number
      ): Array<string> => {
         const len = ids.length;

         const seen: HashMap<string> = {};

         // Find the wrong columnIndex and update the backend
         ids.every(id => {
            const res = reservations[id];
            const index = res.columnIndex!;
            console.log(id);

            // id outside the length of the array
            if (index >= len) {
               console.log("LEN  >=");
               reservations[id].columnIndex = notFoundIndex;
               //updateReservation(reservations[id]);
               return false;
            }

            // duplicate ID
            if (seen[index.toString()]) {
               console.log("Duplicate ID");
               reservations[id].columnIndex = notFoundIndex;
               //updateReservation(reservations[id]);
               return false;
            } else {
               console.log("NOT SEEN YET");
               seen[index] = "seen";
               return true;
            }
         });

         // Reorder the columnIndexes again
         const res = ids.map(id => reservations[id]);
         res.sort((a, b) => a.columnIndex! - b.columnIndex!);

         const orderedIds = res.map(r => r.id! as string);

         return orderedIds;
      };

      const reorderColumns = (cols: HashMap<IColumn>, reservations: HashMap<Reservation>): HashMap<IColumn> => {
         for (let i in cols) {
            console.log(i);
            const unorderedIds = [...cols[i].reservationIds];
            const orderedIds: Array<string> = [];
            let hasMissingId: null | number = null;

            if (unorderedIds.length === 0) continue;

            const firstId = unorderedIds.find(id => {
               const res = reservations[id];

               return res?.columnIndex === 0;
            });

            if (!firstId) continue;

            orderedIds.push(firstId);
            for (let i = 1; i < unorderedIds.length; i++) {
               const currId = unorderedIds.find(id => {
                  const res = reservations[id];

                  return res?.columnIndex === i;
               });

               if (!currId) {
                  hasMissingId = i;
                  console.error(`ID at index ${i} not found`);
                  break;
                  //throw Error(`ID at index ${i} not found`);
               }

               orderedIds.push(currId);
            }

            if (hasMissingId !== null) {
               console.log("HAS MISSING ID !!!");
               const fixedOrderedIds = fixOrdering(unorderedIds, reservations, hasMissingId);
               console.log("fixedOrderedIds: ", fixedOrderedIds);
               console.log(
                  "indexes: ",
                  fixedOrderedIds.map(id => reservations[id].columnIndex!)
               );
               cols[i].reservationIds = fixedOrderedIds;
            } else {
               cols[i].reservationIds = orderedIds;
            }
            hasMissingId = null;
         }
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
               res.push(id as unknown as string);
            }
            if (isNote(element)) {
               const day = element.date;
               const res = cols[day].noteIds;
               res.push(id as string);
            }
         });

         // At least 1 item
         if (!items.length) return;

         const element: Reservation | Note = conversion(items[0]);
         if (isReservation(element)) {
            setReservations(hashElements as HashMap<Reservation>);

            const reorderedColumns = { ...reorderColumns(cols, hashElements as HashMap<Reservation>) };
            setColumns(reorderedColumns);
         }
         if (isNote(element)) {
            setNotes(hashElements as HashMap<Note>);
            setColumns(cols);
         }
      };
      const getData = async () => {
         // We first create the columns to store the items from the DB
         const cols = createColumns();

         // Get the elements from Fauna DB
         const newReservations: any = await FDBgetReservationsAsync(getWeekDays(date));
         const newNotes: any = await FDBGetNotes(getWeekDays(date));

         // If no elements => error => return
         if (!newReservations || !newNotes) return;
         // creates the different necessary hashs for the frontend
         populateHash(newNotes, FDBconvertToNote, cols);
         populateHash(newReservations, FDBconvertToReservation, cols);
      };

      getData();

      console.log("getData DONE");
   }, [date, newReservationId, resUpdate]);

   //#region RESERVATIONS

   const getReservation = (id: string): Reservation | undefined => {
      return reservations[id];
   };

   const getReservations = (ids: Array<string>): Array<Reservation> => {
      const res: Array<Reservation> = [];
      ids.forEach(id => {
         const element = getReservation(id);
         if (element) {
            res.push(element);
         }
      });
      return res;
   };

   const addReservation = async (newReservation: Reservation): Promise<Reservation | undefined> => {
      const newHash = { ...reservations };

      // Add the new Reservation in the DB
      // MUST BE DONE FIRST TO RETRIEVE ID
      const newDBRes = await FDBcreateReservationAsync({ ...newReservation });

      const id = newDBRes.id;
      if (!id) throw Error("No id found");
      newHash[id] = newDBRes;

      // Add the new Reservation in the hash
      setReservations(newHash);

      return newDBRes;
   };

   const updateReservation = async (newReservation: Reservation): Promise<void> => {
      console.log(newReservation);
      const newHash = { ...reservations };
      const id = newReservation.id;
      if (!id) return;
      newHash[id] = newReservation;

      // Update the modified Reservation in the hash
      setReservations(newHash);

      // Update the modified Reservation in the DB too
      await FDBupdateReservationAsync({ ...newReservation });
   };

   const updateReservations = async (newReservations: Array<Reservation>) => {
      // Update the modified Reservation in the hash
      setReservations(res => {
         const newHash = { ...res };
         newReservations.forEach(newReservation => {
            const id = newReservation.id;
            if (!id) return;
            newHash[id] = newReservation;
         });
         return newHash;
      });

      await FDBUpdateReservationsAsync(newReservations);
   };

   const deleteReservation = async (reservation: Reservation): Promise<void> => {
      if (!reservation.id) return;
      const newHash = { ...reservations };
      delete newHash[reservation.id];
      setReservations(newHash);

      await FDBDeleteReservationAsync(reservation);
   };

   //#endregion

   //#region MODAL
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalReservation, setModalReservation] = useState<Reservation | undefined>(undefined);

   const openModal = (reservation: Reservation): void => {
      console.log(reservation);
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
      getReservation,
      getReservations,
      addReservation,
      updateReservation,
      updateReservations,
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
      setNewReservationId,
      setResUpdate,
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
