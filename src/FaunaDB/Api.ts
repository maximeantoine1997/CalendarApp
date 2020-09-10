import { Reservation } from "../components/reservation_form";
import { client, q } from "./Database";

export interface Fauna<T> {
   ref: {
      id: number;
   };
   data: T;
}

export interface Account {
   email: string;
   username: string;
}

export interface Autocomplete {
   items: Array<string>;
}

export const convertToReservation = (item: Fauna<Reservation>): Reservation => {
   const res = item.data;
   res["id"] = item.ref.id;

   return res;
};

export interface Note {
   id: number | string;
   date: string;
   name: string;
   type: string;
   note: string;
}

export const convertToNote = (item: Fauna<Note>): Note => {
   const res = item.data;
   res["id"] = item.ref.id;

   return res;
};

export const FDBLogin = async (email: string, password: string) => {
   return client.query(q.Login(q.Match(q.Index("users_by_email"), email), { password })).then(res => res);
};

export const FDBLogout = async () => {
   return client.query(q.Logout(true));
};

export const getAutoCompelteAsync = async () =>
   client.query(q.Paginate(q.Match(q.Index("all_autocomplete")))).then((response: any) => {
      const refs = response.data;
      // create new query out of notes refs.
      const getAllProductDataQuery = refs.map((ref: any) => {
         return q.Get(ref);
      });
      // query the refs
      return client.query(getAllProductDataQuery).then(data => data);
   });

export const FDBGetUser = async (id: string) => {
   return client.query(q.Get(q.Ref(q.Collection("posts"), id)));
};

// RESERVATION

export const FDBgetReservations = (dates: Array<string>) =>
   client
      .query(
         q.Paginate(
            q.Union(
               dates.map(date => {
                  return q.Match(q.Index("reservations_by_startDate"), date);
               })
            ),
            {
               size: 200,
            }
         )
      )
      .then((response: any) => {
         const refs = response.data;
         // create new query out of notes refs.
         const getAllProductDataQuery = refs.map((ref: any) => {
            return q.Get(ref);
         });
         // query the refs
         return client.query(getAllProductDataQuery).then(data => data);
      })
      .catch(error => console.warn("error", error.message));

export const FDBcreateReservationAsync = async (reservation: Reservation) => {
   await create(reservation, "reservations");
};

export const FDBupdateReservationAsync = async (reservation: Reservation) => {
   await update(reservation, "reservations");
};

export const FDBDeleteReservationAsync = async (reservation: Reservation) => {
   await remove(reservation, "reservations");
};

// ------------------------------------------------------

// NOTES
export const FDBGetNotes = (dates: Array<string>) =>
   client
      .query(
         q.Paginate(
            q.Union(
               dates.map(date => {
                  return q.Match(q.Index("notes_by_dates"), date);
               })
            ),
            {
               size: 200,
            }
         )
      )
      .then((response: any) => {
         const refs = response.data;
         // create new query out of notes refs.
         const getAllProductDataQuery = refs.map((ref: any) => {
            return q.Get(ref);
         });
         // query the refs
         return client.query(getAllProductDataQuery).then(data => data);
      })
      .catch(error => console.warn("error", error.message));

export const FDBcreateNotesAsync = async (note: Note) => {
   return await create(note, "notes");
};

export const FDBupdateNotesAsync = async (note: Note) => {
   await update(note, "notes");
};

export const FDBDeleteNotesAsync = async (note: Note) => {
   await remove(note, "notes");
};

// ------------------------------------------------------

const create = async (element: any, collection: string) => {
   return await client.query(q.Create(q.Collection(collection), { data: element }));
};

const update = async (element: any, collection: string) => {
   await client.query(q.Update(q.Ref(q.Collection(collection), element.id), { data: element }));
};

const remove = async (element: any, collection: string) => {
   await client.query(q.Delete(q.Ref(q.Collection(collection), element.id)));
};
