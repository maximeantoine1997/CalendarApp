import {
   Box,
   Button,
   createStyles,
   Dialog,
   DialogActions,
   DialogContent,
   Divider,
   Grid,
   makeStyles,
   Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";
import React, { ReactNode, useEffect, useState } from "react";
import useCalendarContext from "../../../Contexts/CalendarContext";
import useNoteContext from "../../../Contexts/NoteContext";
import { convertToNote, Fauna, FDBcreateNotesAsync, Note } from "../../../FaunaDB/Api";
import TextComponent from "../../FormElements/TextComponent";

const useStyles = makeStyles(() =>
   createStyles({
      delete: {
         paddingTop: "15px",
         cursor: "pointer",
      },
   })
);

interface NoteModalProps {}

const NoteModal: React.FunctionComponent<NoteModalProps> = () => {
   const classes = useStyles();
   const { enqueueSnackbar } = useSnackbar();
   const { getNotes, updateNote, deleteNote, columns } = useCalendarContext();
   const { modalDate, closeModal, isOpenModal } = useNoteContext();

   const [isReadOnly, setIsReadOnly] = useState<boolean>(true);

   // get the array of notes specific from that day
   const [notes, setNotes] = useState<Array<Note>>([]);
   console.log("NOTES", notes);
   const onModify = async () => {
      if (!notes.length) {
         await onAdd();
      }
      setIsReadOnly(false);
   };

   const onAdd = async () => {
      const newNote: Note = { id: "", date: modalDate, name: "", type: "", note: "" };
      const faunaNote: Fauna<Note> = (await FDBcreateNotesAsync(newNote)) as Fauna<Note>;
      const note = convertToNote(faunaNote);
      setNotes(prev => [...prev, note]);
   };

   const onSave = () => {
      // Update notes from DB
      notes.forEach(note => {
         updateNote(note);
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

   const onDelete = async (note: Note) => {
      const index = notes.findIndex(element => element.id === note.id);
      if (index < 0) return;
      // Remove note from DB & Context
      deleteNote(note);

      // Remove note from array
      setNotes(prev => {
         prev.splice(index, 1);
         return [...prev];
      });

      enqueueSnackbar("Supprimé", { variant: "success" });
   };

   const onClose = () => {
      setIsReadOnly(true);
      closeModal();
   };

   useEffect(() => {
      if (modalDate) {
         const newNotes = getNotes(columns[modalDate].noteIds);
         setNotes(newNotes);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [modalDate]);

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
                  <DeleteIcon className={classes.delete} onClick={() => onDelete(note)} />
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
         <Dialog open={isOpenModal} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
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
