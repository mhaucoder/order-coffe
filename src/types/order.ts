import { Customer } from "./customer";
import { Drink } from "./drink";

export type OrderHistory = {
    _id: string;
    orderItem: OrderItem[];
    createdAt: string;
    updatedAt: string;
};

export type CreateOrderHistory = {
    orderItem: OrderItem[];
};

export default interface OrderItem {
    drink: Drink;
    customer?: Customer;
    note?: string;
  }
  