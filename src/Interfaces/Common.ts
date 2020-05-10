export type Nullable<T> = null | T;

export type Optional<T> = undefined | T;

export type CalendarType = "livraison" | "preparation" | "livre";

export type ReservationType = "Preparation" | "Livraison" | "Livre" | "Retour" | "Fini";

export const typeColors: Record<ReservationType, string> = {
   Preparation: "#E09494",
   Livraison: "#D7E6CB",
   Livre: "#DEE3F1",
   Retour: "#DEE3F1",
   Fini: "#00000",
};
