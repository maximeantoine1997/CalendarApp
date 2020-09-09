import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   Divider,
   Grid,
   Typography,
   makeStyles,
   createStyles,
   Box,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { ReactNode, useEffect, useState } from "react";
import useCalendarContext from "../../../Contexts/CalendarContext";
import {
   convertToNote,
   Fauna,
   FDBcreateNotesAsync,
   FDBupdateNotesAsync,
   Note,
   FDBDeleteNotesAsync,
} from "../../../FaunaDB/Api";
import TextComponent from "../../FormElements/TextComponent";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(() =>
   createStyles({
      delete: {
         paddingTop: "15px",
         cursor: "pointer",
      },
   })
);

interface NoteModalProps {
   open: boolean;
   onClose: () => void;
   day: string;
}

const NoteModal: React.FunctionComponent<NoteModalProps> = ({ open: open_, onClose: onClose_, day: day_ }) => {
   const classes = useStyles();
   const { enqueueSnackbar } = useSnackbar();
   const { notes: notes_, setNotes: setNotes_ } = useCalendarContext();

   const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
   const [notes, setNotes] = useState<Array<Note>>(notes_[day_] || []);

   const onModify = async () => {
      if (!notes.length) {
         await onAdd();
      }
      setIsReadOnly(false);
   };

   const onAdd = async () => {
      const newNote: Note = { id: "", startDate: day_, name: "", type: "", note: "" };
      const faunaNote: Fauna<Note> = (await FDBcreateNotesAsync(newNote)) as Fauna<Note>;
      const note = convertToNote(faunaNote);
      setNotes(prev => [...prev, note]);
   };

   const onSave = () => {
      // Update notes from DB
      notes.forEach(note => {
         FDBupdateNotesAsync(note);
      });

      // Update notes from React Context
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

   const onDelete = async (id: string) => {
      const index = notes.findIndex(element => element.id === id);
      if (index < 0) return;
      // Remove note from DB
      await FDBDeleteNotesAsync(notes[index]);

      // Remove note from React
      setNotes(prev => {
         prev.splice(index, 1);
         return [...prev];
      });

      enqueueSnackbar("Supprimé", { variant: "success" });
   };

   const onClose = () => {
      setIsReadOnly(true);
      onClose_();
   };

   useEffect(() => {
      if (notes_[day_]) {
         setNotes(notes_[day_]);
      }
   }, [day_, notes_]);

   const renderNote = (note: Note): ReactNode => {
      return (
         <Grid key={note.id} container justify="space-evenly" alignItems="center">
            <Grid item xs={isReadOnly ? 4 : 3}>
               <TextComponent
                  customClass={{ width: "80%" }}
                  placeholder="Nom"
                  onChange={e => onChange("name", e, note.id as string)}
                  isRequired
                  value={note.name}
                  isReadOnly={isReadOnly}
                  noReadOnlyText
               />
            </Grid>
            <Grid item xs={isReadOnly ? 4 : 3}>
               <TextComponent
                  customClass={{ width: "80%" }}
                  placeholder="Raison"
                  onChange={e => onChange("type", e, note.id as string)}
                  isRequired
                  value={note.type}
                  isReadOnly={isReadOnly}
                  noReadOnlyText
               />
            </Grid>
            <Grid item xs={isReadOnly ? 4 : 3} style={{ width: "80%" }}>
               <TextComponent
                  customClass={{ width: "80%" }}
                  placeholder="Description"
                  onChange={e => onChange("note", e, note.id as string)}
                  value={note.note}
                  isReadOnly={isReadOnly}
                  noReadOnlyText
               />
            </Grid>
            {!isReadOnly && (
               <Grid item xs={1}>
                  <DeleteIcon className={classes.delete} onClick={() => onDelete(note.id as string)} />
               </Grid>
            )}
         </Grid>
      );
   };

   const renderNoteDescription = isReadOnly ? (
      <Grid container justify="space-evenly">
         <Grid item xs={isReadOnly ? 4 : 3}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
               Nom
            </Typography>
         </Grid>
         <Grid item xs={isReadOnly ? 4 : 3}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
               Raison
            </Typography>
         </Grid>
         <Grid item xs={isReadOnly ? 4 : 3}>
            <Typography variant="h6" style={{ width: "80%", fontWeight: "bold" }}>
               Description
            </Typography>
         </Grid>
         {!isReadOnly && <Grid item xs={1}></Grid>}
      </Grid>
   ) : null;

   return (
      <>
         <Dialog open={open_} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
            <DialogContent>
               {renderNoteDescription}
               {notes?.map((note, index) =>
                  index + 1 === notes.length ? (
                     renderNote(note)
                  ) : (
                     <Box key={note.id}>
                        {renderNote(note)} <Divider />
                     </Box>
                  )
               )}

               {!isReadOnly && (
                  <Grid container justify="flex-end">
                     <Button variant="outlined" color="secondary" onClick={onAdd}>
                        Ajouter +
                     </Button>
                  </Grid>
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
