import { useSnackbar } from "notistack";
import { Reservation } from "../components/reservation_form";
import useCalendarContext from "../Contexts/CalendarContext";
import { convertToReservation, Fauna, FDBGetReservationWith } from "../FaunaDB/Api";

export interface IDroppable {
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
      updateReservations,
      getReservation,
      deleteReservation,
      columns,
   } = useCalendarContext();

   const { enqueueSnackbar } = useSnackbar();

   const updateDragDrop = async (source: IDroppable, destination: IDroppable, draggableId: string): Promise<void> => {
       console.log(source)
       console.log(destination)
      const reservation = getReservation(draggableId);
      if (!reservation?.previous || !reservation?.next) return;

      const sourcePrevious = getReservation(reservation.previous);
      const sourceNext = getReservation(reservation.next);

      // For the destination
      const destinationIds = columns[destination.droppableId].reservationIds;
      let destinationCurrent = getReservation(destinationIds[destination.index]);

      // Came back to the same place, don't do anything
      if (reservation.id === destinationCurrent?.id) return;

      // ON SAME COLUMN
      if (source.droppableId === destination.droppableId) {
         console.log("source", source.index);
         console.log("destination", destination.index);
         console.log(destinationIds.length);

         const resToUpdate: Array<Reservation> = [];

         switch (destination.index) {
            case 0:
               console.log("first one");
               if (sourcePrevious) {
                  sourcePrevious.next = reservation.next;
                  resToUpdate.push(sourcePrevious);
               }
               if (sourceNext) {
                  sourceNext.previous = reservation.previous;
                  resToUpdate.push(sourceNext);
               }

               reservation.next = destinationIds[0];

               reservation.previous = "FIRST";
               destinationCurrent!.previous = draggableId;
               resToUpdate.push(destinationCurrent!);
               break;
            case destinationIds.length - 1:
               console.log("last one");
               if (sourcePrevious) {
                  sourcePrevious.next = reservation.next;
                  resToUpdate.push(sourcePrevious);
               }
               if (sourceNext) {
                  sourceNext.previous = reservation.previous;
                  resToUpdate.push(sourceNext);
               }

               reservation.next = "LAST";
               reservation.previous = destinationIds[destinationIds.length - 1];
               destinationCurrent!.next = (reservation.id as unknown) as string;
               resToUpdate.push(destinationCurrent!);
               break;
            case source.index + 1:
               console.log("under him");
               const oldPrev_1 = reservation.previous;
               const oldNext_1 = destinationCurrent!.next;
               reservation.previous = destinationIds[destination.index];
               reservation.next = destinationCurrent!.next;

               const reservationPrevious = getReservation(oldPrev_1!);
               // So if Previous != FIRST
               if (reservationPrevious) {
                  reservationPrevious.next = destinationIds[destination.index];
                  resToUpdate.push(reservationPrevious);
               }

               const destinationNext = getReservation(oldNext_1!);
               // So if Previous != LAST
               if (destinationNext) {
                  destinationNext.previous = draggableId;
                  resToUpdate.push(destinationNext);
               }

               destinationCurrent!.previous = oldPrev_1;
               destinationCurrent!.next = (reservation.id as unknown) as string;
               resToUpdate.push(destinationCurrent!);
               break;
            case source.index - 1:
               console.log("above him");
               const oldNext_2 = reservation.next;
               const oldPrev_2 = destinationCurrent!.previous;
               reservation.previous = destinationCurrent!.previous;
               reservation.next = destinationIds[destination.index];

               const destinationPrevious = getReservation(oldPrev_2!);
               // So if Previous != FIRST
               if (destinationPrevious) {
                  destinationPrevious.next = draggableId;
                  resToUpdate.push(destinationPrevious);
               }

               const reservationNext = getReservation(oldNext_2!);
               // So if Previous != LAST
               if (reservationNext) {
                  reservationNext.previous = destinationIds[destination.index];
                  resToUpdate.push(reservationNext);
               }

               destinationCurrent!.previous = (reservation.id as unknown) as string;
               destinationCurrent!.next = oldNext_2;
               resToUpdate.push(destinationCurrent!);
               break;

            default:
               console.log("default");
               let currentDestinationindex = destination.index;
               if (destination.index > source.index) {
                  currentDestinationindex = destination.index + 1;
                  destinationCurrent = getReservation(destinationIds[currentDestinationindex]);
               }
               if (sourcePrevious) {
                  sourcePrevious.next = reservation.next;
                  resToUpdate.push(sourcePrevious);
               }
               if (sourceNext) {
                  sourceNext.previous = reservation.previous;
                  resToUpdate.push(sourceNext);
               }
               reservation.previous = destinationCurrent!.previous;

               const destinationPrevious_2 = getReservation(destinationCurrent!.previous!);
               // So if Previous != FIRST
               if (destinationPrevious_2) {
                  destinationPrevious_2.next = draggableId;
                  resToUpdate.push(destinationPrevious_2);
               }

               reservation.next = destinationIds[currentDestinationindex];
               destinationCurrent!.previous = (reservation.id as unknown) as string;
               resToUpdate.push(destinationCurrent!);
         }
         resToUpdate.push(reservation);
         await updateReservations(resToUpdate).then(() => {
            enqueueSnackbar("Modifié", { variant: "success" });
         });
      }
      // TO DIFFERENT COLUMN
      else {
        const sourceIds = columns[source.droppableId].reservationIds;
        const resToUpdate: Array<Reservation> = [];

        // SOURCE
        switch(source.index){
            // From First
            case 0: {
                console.log("From First")
                if (sourceNext) {
                    sourceNext.previous = "FIRST";
                    resToUpdate.push(sourceNext);
                }
                break;
            }
            // From Last
            case sourceIds.length - 1: {
                console.log("From Last")
                if (sourcePrevious) {
                    sourcePrevious.next = "LAST";
                    resToUpdate.push(sourcePrevious);
                }
                break;
            }
            // From Middle
            default: {
                console.log("From Middle")
                if (sourcePrevious) {
                    sourcePrevious.next = reservation.next;
                    resToUpdate.push(sourcePrevious);
                }
                if (sourceNext) {
                    sourceNext.previous = reservation.previous;
                    resToUpdate.push(sourceNext);
                }
                break;
            }
        }

        // DESTINATION
        switch(destination.index){
            // To First
            case 0: {
                console.log("To First")
                reservation.previous = "FIRST"
                if (destinationCurrent) {
                    reservation.next = destinationCurrent.id as unknown as string
                    destinationCurrent.previous = draggableId
                    resToUpdate.push(destinationCurrent)
                } else {
                    // No destinationCurrent so no reservations on that day
                    reservation.next = "LAST"
                }
                break;
            }
            // To Last
            case destinationIds.length: {
                console.log("To Last")
                // destinationCurr is undefined here so we need
                // to find it manually
                const last = getReservation(destinationIds[destinationIds.length - 1]);
                reservation.next = "LAST"
                if (last) {
                    reservation.previous = last.id as unknown as string
                    last.next = draggableId;
                    resToUpdate.push(last)
                }
                break;
            }
            // To Middle
            default: {
                console.log("To Middle")
                if(destinationCurrent?.previous) {
                    const destinationPrevious = getReservation(destinationCurrent.previous)
                    if (destinationPrevious) {
                        destinationPrevious.next = draggableId;
                        reservation.previous = destinationPrevious.id as unknown as string;
                        resToUpdate.push(destinationPrevious)
                    }
                }
                if (destinationCurrent){
                    destinationCurrent.previous = draggableId;
                    reservation.next = destinationCurrent.id as unknown as string;
                    resToUpdate.push(destinationCurrent)
                }
                break;
            }
        }
        // Update startdate reservation
        reservation.startDate = destination.droppableId
        resToUpdate.push(reservation);
        await updateReservations(resToUpdate).then(() => {
            enqueueSnackbar("Modifié", { variant: "success" });
         });
      }
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
