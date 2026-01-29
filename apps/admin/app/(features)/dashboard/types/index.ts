export type ReservationItemDto = {
  name: string;
  item: string;
  time: string;
  status: "ready" | "pending";
};
