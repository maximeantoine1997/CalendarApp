import { Button, Dialog, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => ({
   container: {
      paddingTop: "25px",
      paddingBottom: "25px",
   },
   buttonLeft: {
      marginRight: "10px",
   },
   buttonRight: {
      marginLeft: "10px",
   },
}));

interface DeleteModalProps {
   open: boolean;
   onDelete: () => void;
   onClose: () => void;
}

const DeleteModal: React.FunctionComponent<DeleteModalProps> = ({ open, onDelete, onClose }) => {
   const classes = useStyles();

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <Grid container className={classes.container}>
            <Grid xs={12} style={{ paddingBottom: "30px" }}>
               <Typography variant="h5" align="center">
                  Êtes-vous certain de vouloir supprimer cette réservation?
               </Typography>
            </Grid>
            <Grid container justify="space-evenly">
               <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={onClose}
                  className={classes.buttonLeft}
               >
                  Annuler
               </Button>
               <Button size="large" variant="outlined" onClick={onDelete} className={classes.buttonRight}>
                  Supprimer
               </Button>
            </Grid>
         </Grid>
      </Dialog>
   );
};

export default DeleteModal;
