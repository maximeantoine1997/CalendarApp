import { useSnackbar } from "notistack";
import { Reservation } from "../components/reservation_form";
import useCalendarContext from "../Contexts/CalendarContext";
import { convertToReservation, Fauna, FDBGetReservationWith } from "../FaunaDB/Api";

interface IDroppable {
   index: number;
   droppableId: string;
}
interface UseDragDropProps {
   updateDragDrop: (source: IDroppable, destination: IDroppable, draggableId: string) => Promise<void>;
   addDragDrop: (newReservation: Reservation) => Promise<void>;
   deleteDragDrop: (reservation: Reservation) => Promise<void>;
}

const UseDragDrop = (): UseDragDropProps => {
   const {
      setNewReservationId,
      addReservation,
      updateReservation,
      getReservation,
      deleteReservation,
      columns,
   } = useCalendarContext();

   const { enqueueSnackbar } = useSnackbar();

   const updateDragDrop = async (source: IDroppable, destination: IDroppable, draggableId: string): Promise<void> => {
      const reservation = getReservation(draggableId);
      if (!reservation?.previous || !reservation?.next) return;

      const sourcePrevious = getReservation(reservation.previous);
      const sourceNext = getReservation(reservation.next);

      // For the destination
      const destinationIds = columns[destination.droppableId].reservationIds;
      let destinationCurrent = getReservation(destinationIds[destination.index]);

      // Came back to the same place, don't do anything
      if (reservation.id === destinationCurrent?.id) return;

      // --------------------
      // SOURCE

      // For the source column
      if (reservation.previous === "FIRST" && reservation.next !== "LAST") {
         if (!sourceNext) throw Error("No sourceNext");
         sourceNext.previous = "FIRST";
         await updateReservation(sourceNext);
      } else if (reservation.next === "LAST" && reservation.previous !== "FIRST") {
         if (!sourcePrevious) throw Error("No sourcePrevious");
         sourcePrevious.next = "LAST";
         await updateReservation(sourcePrevious);
      } else if (reservation.next === "LAST" && reservation.previous === "FIRST") {
         // DO NOTHING
      } else {
         if (!sourcePrevious?.id || !sourceNext?.id) return;

         sourcePrevious.next = (sourceNext.id as unknown) as string;
         sourceNext.previous = (sourcePrevious.id as unknown) as string;
         await updateReservation(sourcePrevious);
         await updateReservation(sourceNext);
      }

      // --------------------
      // DESTINATION

      // No element in that column yet
      if (destinationIds.length === 0) {
         reservation.previous = "FIRST";
         reservation.next = "LAST";
      }
      // Reservation was dropped at bottom of column
      else if (!destinationCurrent && destinationIds.length === destination.index) {
         const lastDestination = getReservation(destinationIds[destinationIds.length - 1]);
         if (!lastDestination) throw Error("No last destination was found");

         lastDestination.next = draggableId;
         reservation.previous = (lastDestination.id as unknown) as string;
         reservation.next = "LAST";
         await updateReservation(lastDestination);
      }
      // There is just no destination Current (IMPOSSIBLE)
      else if (!destinationCurrent) {
         throw Error("No destination Current was found");
      }
      // Dropped reservation at the top (first one)
      else if (destination.index === 0) {
         if (!destinationCurrent) throw Error("No destination Current");
         destinationCurrent.previous = draggableId;
         reservation.next = (destinationCurrent.id as unknown) as string;
         reservation.previous = "FIRST";
         await updateReservation(destinationCurrent);
      }
      // Dropped reservation at the bottom (last one)
      else if (destination.index === destinationIds.length) {
         const destinationLast = getReservation(destinationIds[destinationIds.length - 1]);
         if (!destinationLast) throw Error("No destinationLast");
         destinationLast.next = draggableId;
         reservation.previous = (destinationLast.id as unknown) as string;
         reservation.next = "LAST";
         await updateReservation(destinationLast);
      }
      // Switched with the one under him
      else if (destinationCurrent.id === sourceNext?.id) {
         const oldNext = destinationCurrent.next;

         destinationCurrent.previous = reservation.previous;
         destinationCurrent.next = draggableId;

         const destinationNext = getReservation(oldNext!);
         // So if Next != LAST
         if (destinationNext) {
            destinationNext.previous = draggableId;
            await updateReservation(destinationNext);
         }

         reservation.previous = (destinationCurrent.id as unknown) as string;
         reservation.next = oldNext;
         await updateReservation(destinationCurrent);
      }
      // Switched with the one above him
      else if (destinationCurrent!.id === sourcePrevious?.id) {
         const oldNext = reservation.next;

         reservation.previous = destinationCurrent.previous;
         reservation.next = (destinationCurrent.id as unknown) as string;

         const destinationPrevious = getReservation(destinationCurrent.previous!);
         // So if Previous != FIRST
         if (destinationPrevious) {
            destinationPrevious.next = draggableId;
            await updateReservation(destinationPrevious);
         }

         destinationCurrent.previous = draggableId;
         destinationCurrent.next = oldNext;
         await updateReservation(destinationCurrent);
      } else {
         // Gets the reservation that is currently on the destination index

         // Destination and source are the same column, so update destinationCurrent to make it work
         if (source.droppableId === destination.droppableId && source.index < destination.index) {
            destinationCurrent = getReservation(destinationIds[destination.index + 1]);
         }
         if (!destinationCurrent) return;

         // The id of the previous of the destination current
         const destinationCurrPrevId = destinationCurrent.previous;
         if (!destinationCurrPrevId) return;

         // Previous of destination
         const destinationPrevious = getReservation(destinationCurrPrevId);
         if (!destinationPrevious) return;

         // His next becomes the moved item
         destinationPrevious.next = draggableId;

         destinationCurrent.previous = draggableId;

         reservation.previous = (destinationPrevious.id as unknown) as string;
         reservation.next = (destinationCurrent.id as unknown) as string;

         await updateReservation(destinationPrevious);
         await updateReservation(destinationCurrent);
      }
      // Update startDate if source != destination
      if (source.droppableId !== destination.droppableId) {
         reservation.startDate = destination.droppableId;
      }

      await updateReservation(reservation).then(() => {
         enqueueSnackbar("Modifié", { variant: "success" });
      });
   };

   const addDragDrop = async (newReservation: Reservation): Promise<void> => {
      const lastReservations = (await FDBGetReservationWith(
         newReservation.startDate,
         "reservation_by_next",
         "LAST"
      )) as any;
      if (!lastReservations.data.length) {
         // it doesn't exist so => No reservations on that day
         newReservation.previous = "FIRST";
         newReservation.next = "LAST";
         const reservation = await addReservation(newReservation);
         setNewReservationId((reservation!.id as unknown) as string);
      } else {
         const data = lastReservations.data as Array<Fauna<Reservation>>;
         if (!data) throw Error("No data found");
         if (data.length > 1) throw Error("More than 1 last reservation was found");

         const reservation = await addReservation(newReservation);
         if (!reservation) throw Error("No reservation returned");

         const lastReservation = convertToReservation(data[0]);

         lastReservation.next = (reservation.id as unknown) as string;

         reservation.previous = (lastReservation.id as unknown) as string;
         reservation.next = "LAST";

         // Update reservation to DB and to frontend
         await updateReservation(lastReservation);
         await updateReservation(reservation);

         setNewReservationId((reservation.id as unknown) as string);
         enqueueSnackbar("Ajouté", { variant: "success" });
      }
   };

   const deleteDragDrop = async (reservation: Reservation) => {
      const previousId = reservation.previous;
      const nextId = reservation.next;

      if (!previousId || !nextId) throw Error("No previous or next in reservation");

      const previousReservation = getReservation(previousId);
      const nextReservation = getReservation(nextId);

      // So if previous of curr != FIRST
      if (previousReservation) {
         previousReservation.next = nextId;
         updateReservation(previousReservation);
      }

      // So if next of curr != LAST
      if (nextReservation) {
         nextReservation.previous = previousId;
         updateReservation(nextReservation);
      }

      await deleteReservation(reservation).then(() => {
         enqueueSnackbar("Supprimé", { variant: "success" });
      });
   };

   return { updateDragDrop, addDragDrop, deleteDragDrop };
};

export default UseDragDrop;
