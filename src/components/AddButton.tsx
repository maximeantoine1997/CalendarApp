import { ReactElement } from "react";
import React from "react";
import { Fab, Box, makeStyles, Theme, createStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link, useLocation } from "react-router-dom";
import useUserContext from "Contexts/UserContext";
import { checkIfConnected } from "Utils";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      addButton: {
         position: "absolute",
         bottom: "2vh",
         right: "2vw",
         background: "linear-gradient(to right, #606c88, #3f4c6b)",
         color: "white",
      },
   })
);

interface AddProps {
   children: ReactElement;
}

const AddButton: React.FC<AddProps> = ({ children }) => {
   const classes = useStyles();

   const { user } = useUserContext();

   const { pathname } = useLocation();

   if (pathname !== "/reservation") {
      return (
         <Box position="relative">
            {children}

            <Link to={checkIfConnected(user, "/reservation")}>
               <Fab variant="round" className={classes.addButton} onClick={() => console.log(pathname)}>
                  <AddIcon fontSize="large" />
               </Fab>
            </Link>
         </Box>
      );
   }

   return <>{children}</>;
};

export default AddButton;
