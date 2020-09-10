import React, { createContext, ReactElement, ReactNode, useContext, useState } from "react";

interface INoteContext {
   isOpenModal: boolean;
   setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
   openModal: (date: string) => void;
   closeModal: () => void;
   modalDate: string;
}

export const NoteContext = createContext<INoteContext>({
   isOpenModal: false,
   setIsOpenModal: () => {},
   openModal: () => {},
   closeModal: () => {},
   modalDate: "",
});

export const NoteContextProvider = (props: { children: ReactNode }): ReactElement => {
   //#region MODAL
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalDate, setModalDate] = useState<string>("");

   const openModal = (date: string): void => {
      setIsOpenModal(true);
      setModalDate(date);
   };

   const closeModal = (): void => {
      setIsOpenModal(false);
      setModalDate("");
   };

   //#endregion

   const noteContext = {
      isOpenModal,
      setIsOpenModal,
      openModal,
      closeModal,
      modalDate,
   };
   return <NoteContext.Provider value={noteContext}>{props.children}</NoteContext.Provider>;
};

const useNoteContext = (): INoteContext => {
   const context = useContext(NoteContext);
   if (context === null) {
      throw new Error("NoteContext is not provided");
   }
   return context;
};

export default useNoteContext;
