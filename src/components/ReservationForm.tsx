import { ReservationType } from "../Utils";

export interface Reservation {
   // Date:
   startDate: string;

   // Caution:
   amount: number;
   isReceived: boolean;
   isCash: boolean;

   // Machine:
   modele: string;
   accessoires: Array<string>;

   // Chantier:
   isToBeDelivered: boolean;
   street: string;
   city: string;
   sitePhone: string;

   // Client:
   isCompany: boolean;
   toSave: boolean;
   company?: string;
   name: string;
   facturationAddress?: string;
   VATNumber?: string;
   phone?: string;
   email?: string;

   // Extra:
   id?: number | string;
   varyNumber?: string;
   type: ReservationType;
   notes?: string;

   columnIndex?: number;

   // Drag & Drop
   previous?: string;
   next?: string;
}
