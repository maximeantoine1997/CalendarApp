import { ReactNode } from "react";
import React from "react";
import { Fade } from "@material-ui/core";

interface TransitionProps {
   type: "fade" | "slide" | "slide-fade" | "zoom";
   children: ReactNode | Array<ReactNode>;
   direction?: "up" | "down" | "left" | "right";
   timeout?: {
      appear?: number;
      enter?: number;
      exit?: number;
   };
   start?: boolean;
}

const Transition: React.FC<TransitionProps> = ({ start, type, children, direction = "down", timeout }) => {
   switch (type) {
      case "fade":
         return (
            <Fade timeout={timeout} in={start}>
               {children}
            </Fade>
         );

      default:
         return <>{children}</>;
   }
};

export default Transition;
