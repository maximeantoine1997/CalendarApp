import { Reservation } from "../components/reservation_form";
import { HashMap } from "./../Utils";
import { client, q } from "./Database";
import { autocompleteReverseMapping } from "./FaunaDB.Utils";

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

export interface Note {
   id: number | string;
   date: string;
   name: string;
   type: string;
   note: string;
}

//#region CONVERSION

export const FDBconvertToReservation = (item: Fauna<Reservation>): Reservation => {
   const res = item.data;
   res["id"] = item.ref.id;

   return res;
};

export const FDBconvertToNote = (item: Fauna<Note>): Note => {
   const res = item.data;
   res["id"] = item.ref.id;

   return res;
};

//#endregion

//#region  LOGIN

export const FDBLogin = async (email: string, password: string) => {
   return client.query(q.Login(q.Match(q.Index("users_by_email"), email), { password })).then(res => res);
};

export const FDBLogout = async () => {
   return client.query(q.Logout(true));
};

export const FDBGetUser = async (id: string) => {
   return client.query(q.Get(q.Ref(q.Collection("posts"), id)));
};

//#endregion

//#region AUTOCOMPLETE

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

export const updateAutoCompleteAsync = async (autocomplete: HashMap<Array<string>>) => {
   const categories = Object.keys(autocomplete);
   categories.forEach(category => {
      if (autocomplete[category].length) {
         const id = autocompleteReverseMapping[category];
         const uniqueItems = Array.from(new Set(autocomplete[category]));
         const items = { items: uniqueItems };
         client.query(q.Update(q.Ref(q.Collection("autocomplete"), id), { data: items }));
      }
   });
};

//#endregion

//#region RESERVATION

export const FDBgetReservationsAsync = async (dates: Array<string>) =>
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

export const FDBGetAllReservations = async () =>
   client.query(
      q.Map(
         q.Paginate(q.Match(q.Index("all_reservations")), { size: 2000 }),
         q.Lambda(x => q.Get(x))
      )
   );

export const FDBcreateReservationAsync = async (reservation: Reservation) => {
   const newReservation = (await create(reservation, "reservations")) as Fauna<Reservation>;

   // Return the newly created reservation with its ID
   return FDBconvertToReservation(newReservation);
};

export const FDBupdateReservationAsync = async (reservation: Reservation) => {
   await update(reservation, "reservations");
};

export const FDBUpdateReservationsAsync = async (reservations: Array<Reservation>) => {
   return Promise.all(
      reservations.map(reservation => {
         update(reservation, "reservations");
         return "";
      })
   ).then(() => console.log("DONE WITH FDB UPDATES"));
};

export const FDBDeleteReservationAsync = async (reservation: Reservation) => {
   await remove(reservation, "reservations");
};

export const FDBGetReservationWith = async (date: string, index: string, value: string) => {
   return client.query(
      q.Map(
         q.Paginate(
            q.Intersection(q.Match(q.Index(index), value), q.Match(q.Index("reservations_by_startDate"), date))
         ),
         q.Lambda(x => q.Get(x))
      )
   );
};

export const FDBGetReservationsV2 = async (date: string): Promise<Array<Reservation>> => {
   const data: Array<Fauna<Reservation>> = ((await FDBgetReservationsAsync([date])) as Array<Fauna<Reservation>>) || [];

   return data.map(fReservation => FDBconvertToReservation(fReservation));
};

export const FDBGetReservationIdsV2 = async (date: string): Promise<Array<string>> => {
   const reservations = (await FDBGetReservationsV2(date)) || [];
   return reservations.map(res => res.id as string);
};
//#endregion
// ------------------------------------------------------

//#region NOTES
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

//#endregion

// ------------------------------------------------------

const create = async (element: any, collection: string) => {
   return await client.query(q.Create(q.Collection(collection), { data: element }));
};

const update = async (element: any, collection: string) => {
   client.query(q.Update(q.Ref(q.Collection(collection), element.id), { data: element }));
};

const remove = async (element: any, collection: string) => {
   await client.query(q.Delete(q.Ref(q.Collection(collection), element.id)));
};
