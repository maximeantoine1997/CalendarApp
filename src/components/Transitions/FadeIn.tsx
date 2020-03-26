import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeInProps {
   open?: boolean;
   children: ReactNode;
   offsetY?: number;
   offsetX?: number;
   transitionDelay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, open = true, offsetY = 25, offsetX = 0, transitionDelay = 0.3 }) => {
   const variants = {
      hidden: { y: offsetY, x: offsetX, opacity: 0 },
      show: {
         y: 0,
         x: 0,
         opacity: 1,
         transition: { delay: transitionDelay, ease: "easeOut" },
      },
   };
   return (
      <motion.div animate={open ? "show" : "hidden"} initial="hidden" variants={variants} exit="hidden">
         {children}
      </motion.div>
   );
};

export default FadeIn;
