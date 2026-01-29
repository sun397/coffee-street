export type ReservationItemDto = {
  name: string;
  item: string;
  time: string;
  status: "ready" | "pending";
};

export type InventoryItemDto = {
  label: string;
  percent: number;
  color: string;
};
