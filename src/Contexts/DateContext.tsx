import moment, { Moment } from "moment";
import React, { createContext, ReactElement, ReactNode, useContext, useState } from "react";

interface IDateContext {
   date: Moment;
   setDate: React.Dispatch<React.SetStateAction<Moment>>;
}

export const DateContext = createContext<IDateContext>({
   date: moment(),
   setDate: () => {
      return;
   },
});

export const DateContextProvider = (props: { children: ReactNode }): ReactElement => {
   const [date, setDate] = useState<Moment>(moment());

   const dateContext = { date, setDate };
   return <DateContext.Provider value={dateContext}>{props.children}</DateContext.Provider>;
};

const useDateContext = (): IDateContext => {
   const context = useContext(DateContext);
   if (context === null) {
      throw new Error("DateContext is not provided");
   }
   return context;
};

export default useDateContext;
