export interface ReservationItemDto {
  name: string;
  item: string;
  time: string;
  status: "ready" | "pending";
};

export interface InventoryItemDto {
  label: string;
  percent: number;
  color: string;
};
