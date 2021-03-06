import { Grid } from "@material-ui/core";
import "firebase/functions";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import useCalendarContext from "../../Contexts/CalendarContext";
import { NoteContextProvider } from "../../Contexts/NoteContext";
import UseDragDrop from "../../Hooks/UseDragDrop";
import { getWeekDays, HashMap, IColumn } from "../../Utils";
import CalendarColumn from "../Calendar/CalendarColumn";
import NoteModal from "../Calendar/Notes/NoteModal";
import CalendarMenu from "../Calendar/Reservation/CalendarMenu";
import CalendarModal from "../Calendar/Reservation/CalendarModal";

const CalendarView: React.FC = () => {
   const { date, columns, setColumns } = useCalendarContext();
   const { updateDragDrop } = UseDragDrop();

   const weekDays = getWeekDays(date);

   const onDragEnd = async (result: any) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;

      if (destination.droppableId === source.droppableId && destination.index === source.index) return;
      const start = columns[source.droppableId];
      const finish = columns[destination.droppableId];
      if (start === finish) {
         // Item changes position in the same column
         const reservationIds = Array.from(start.reservationIds);
         reservationIds.splice(source.index, 1);
         reservationIds.splice(destination.index, 0, draggableId);
         const newColumn: IColumn = {
            ...start,
            reservationIds: reservationIds,
         };
         const newColumns: HashMap<IColumn> = {
            ...columns,
            [newColumn.id]: newColumn,
         };
         setColumns(newColumns);
      }
    // await updateDragDrop(source, destination, draggableId);
   };

   if (Object.entries(columns).length === 0) return <> </>;
   return (
      <DragDropContext onDragEnd={onDragEnd}>
         <NoteContextProvider>
            <Grid container direction="row">
               {weekDays.map((day: string, index) => {
                  const column = columns[day];

                  return <CalendarColumn key={index} day={day} column={column} />;
               })}
               <CalendarModal />
               <CalendarMenu />
               <NoteModal />
            </Grid>
         </NoteContextProvider>
      </DragDropContext>
   );
};

export default CalendarView;
