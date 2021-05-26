import { useSnackbar } from "notistack";
import { Reservation } from "../components/reservation_form";
import useCalendarContext from "../Contexts/CalendarContext";
import { Fauna, FDBconvertToReservation, FDBgetReservationsAsync } from "../FaunaDB/Api";

export interface IDroppable {
   index: number;
   droppableId: string;
}
interface UseDragDropProps {
   updateDragDrop: (
      newIds: Array<string>,
      newOtherIds?: Array<string>,
      id?: string,
      newdate?: string,
      updateRes?: Reservation,
      finishElements?: Array<Reservation>
   ) => Promise<void>;
   addDragDrop: (newReservation: Reservation) => Promise<void>;
   deleteDragDrop: (reservation: Reservation) => Promise<void>;
}

const UseDragDrop = (): UseDragDropProps => {
   const { addReservation, updateReservations, getReservation, deleteReservation, setNewReservationId } =
      useCalendarContext();

   const { enqueueSnackbar } = useSnackbar();

   const updateDragDrop = async (
      newIds: Array<string>,
      newOtherIds?: Array<string>,
      toUpdateId?: string,
      newDate?: string,
      updateRes?: Reservation,
      finishElements?: Array<Reservation>
   ): Promise<void> => {
      const resToUpdate: Array<Reservation> = [];

      const getResa = (res: Array<Reservation>, id: string): Reservation => {
         const el = res.find(res => res.id === id) as Reservation;
         return el;
      };

      const updateIds = async (
         ids: Array<string>,
         isFinishelements?: boolean,
         newFinishElements?: Array<Reservation>
      ): Promise<void> => {
         ids.forEach((id, index) => {
            const res = !isFinishelements ? getReservation(id) : getResa(newFinishElements!, id);

            if (!res) {
               throw Error("No Reservation was found");
            }

            if (id === toUpdateId && updateRes) {
               // Update to new column date if moved to another column
               if (id === toUpdateId && newDate) {
                  updateRes.startDate = newDate;
               }
               updateRes.columnIndex = index;
               console.log("new element: ");
               console.log(updateRes.id, updateRes.columnIndex);
               resToUpdate.push(updateRes);
            } else {
               // Update to new column date if moved to another column
               if (id === toUpdateId && newDate) {
                  res.startDate = newDate;
               }

               res.columnIndex = index;
               console.log("new element: ");
               console.log(res.modele, res.columnIndex);
               resToUpdate.push(res);
            }
         });
      };
      updateIds(newIds);
      if (newOtherIds) {
         if (finishElements) {
            console.log("In FinishElements");
            updateIds(newOtherIds, true, [...finishElements, updateRes!]);
         } else {
            updateIds(newOtherIds);
         }
      }

      await updateReservations(resToUpdate).then(() => {
         enqueueSnackbar("Modifié", { variant: "success" });
      });
   };

   const addDragDrop = async (newReservation: Reservation): Promise<void> => {
      const data: Array<Fauna<Reservation>> = (await FDBgetReservationsAsync([newReservation.startDate])) as Array<
         Fauna<Reservation>
      >;
      if (!data) {
         // it doesn't exist so => No reservations on that day
         newReservation.columnIndex = 0;
         await addReservation(newReservation);
         enqueueSnackbar("Ajouté", { variant: "success" });
         return;
      }

      newReservation.columnIndex = data.length;
      await addReservation(newReservation);

      setNewReservationId(newReservation.id as string);

      enqueueSnackbar("Ajouté", { variant: "success" });
   };

   const deleteDragDrop = async (reservation: Reservation) => {
      const data: Array<Fauna<Reservation>> = (await FDBgetReservationsAsync([reservation.startDate])) as Array<
         Fauna<Reservation>
      >;
      if (!data) throw Error("No Reservation(s) found on that day");

      const reservations = data.map(element => FDBconvertToReservation(element));

      const nextIndex = reservation.columnIndex! + 1;

      if (nextIndex === reservations.length) {
         // It's the last one in the array => so just remove it
         await deleteReservation(reservation).then(() => {
            enqueueSnackbar("Supprimé", { variant: "success" });
         });
         return;
      }

      const resToUpdate: Array<Reservation> = [];

      for (let i = nextIndex; i < reservations.length; i++) {
         const nextRes = reservations.find(res => res.columnIndex === i);

         if (!nextRes) throw Error("No next reservation found");

         nextRes.columnIndex = i - 1;

         resToUpdate.push(nextRes);
      }

      await updateReservations(resToUpdate);

      await deleteReservation(reservation).then(() => {
         enqueueSnackbar("Supprimé", { variant: "success" });
      });
   };

   return { updateDragDrop, addDragDrop, deleteDragDrop };
};

export default UseDragDrop;
