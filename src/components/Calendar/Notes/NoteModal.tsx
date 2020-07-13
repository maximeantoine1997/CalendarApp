import { Button, Dialog, DialogActions, DialogContent, Divider, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { ReactNode, useEffect, useState } from "react";
import useCalendarContext from "../../../Contexts/CalendarContext";
import { convertToNote, Fauna, FDBcreateNotesAsync, FDBupdateNotesAsync, Note } from "../../../FaunaDB/Api";
import TextComponent from "../../FormElements/TextComponent";
interface NoteModalProps {
   open: boolean;
   onClose: () => void;
   day: string;
}

const NoteModal: React.FunctionComponent<NoteModalProps> = ({ open: open_, onClose: onClose_, day: day_ }) => {
   const { enqueueSnackbar } = useSnackbar();
   const { notes: notes_, setNotes: setNotes_ } = useCalendarContext();

   const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
   const [notes, setNotes] = useState<Array<Note>>(notes_[day_] || []);

   const onModify = () => {
      setIsReadOnly(false);
   };

   const onAdd = async () => {
      const newNote: Note = { id: "", date: day_, name: "", type: "", note: "" };
      const faunaNote: Fauna<Note> = (await FDBcreateNotesAsync(newNote)) as Fauna<Note>;
      const note = convertToNote(faunaNote);
      setNotes(prev => [...prev, note]);
   };

   const onSave = () => {
      notes.forEach(note => {
         FDBupdateNotesAsync(note);
      });
      setNotes_(prev => {
         prev[day_] = notes;
         return prev;
      });
      enqueueSnackbar("Modifié", { variant: "success" });
      setIsReadOnly(true);
   };

   const onChange = (key: keyof Note, value: any, id: string) => {
      const index = notes.findIndex(element => element.id === id);

      if (index < 0) return;
      const note = notes[index];

      note[key] = value;

      setNotes(prev => {
         prev[index] = note;
         return prev;
      });
   };

   useEffect(() => {
      if (notes_[day_]) {
         setNotes(notes_[day_]);
      }
   }, [day_, notes_]);

   const renderNote = (note: Note): ReactNode => {
      return (
         <Grid key={note.id} container justify="space-around">
            <Grid item xs={3}>
               <TextComponent
                  placeholder="Nom"
                  onChange={e => onChange("name", e, note.id as string)}
                  isRequired
                  value={note.name}
                  isReadOnly={isReadOnly}
               />
            </Grid>
            <Grid item xs={3}>
               <TextComponent
                  placeholder="Raison"
                  onChange={e => onChange("type", e, note.id as string)}
                  isRequired
                  value={note.type}
                  isReadOnly={isReadOnly}
               />
            </Grid>
            <Grid item xs={3}>
               <TextComponent
                  placeholder="Description"
                  onChange={e => onChange("note", e, note.id as string)}
                  value={note.note}
                  isReadOnly={isReadOnly}
               />
            </Grid>
         </Grid>
      );
   };

   return (
      <>
         <Dialog open={open_} onClose={onClose_} fullWidth maxWidth="md" scroll="paper">
            <DialogContent>
               {notes?.map(note => renderNote(note))}
               {!isReadOnly && (
                  <Button variant="outlined" color="secondary" onClick={onAdd}>
                     Add +
                  </Button>
               )}
            </DialogContent>
            <Divider />
            <DialogActions>
               {isReadOnly && (
                  <>
                     <Button onClick={onModify} variant="outlined" color="secondary">
                        Modifier
                     </Button>
                  </>
               )}
               {!isReadOnly && (
                  <Button onClick={onSave} variant="outlined">
                     Enregistrer
                  </Button>
               )}
            </DialogActions>
         </Dialog>
      </>
   );
};

export default NoteModal;
