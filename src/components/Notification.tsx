import { Snackbar } from "@material-ui/core";
import React, { useState } from "react";

interface NotificationProps {
   message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
   const [open, setOpen] = useState<boolean>(true);

   const handleClose = () => {
      setOpen(false);
   };
   return (
      <Snackbar
         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
         open={open}
         onClose={() => handleClose()}
         message={message}
      />
   );
};

export default Notification;
