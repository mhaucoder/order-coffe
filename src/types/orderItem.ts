import { Drink } from "./drink";
import { Member } from "./member";

export default interface OrderItem {
  drink: Drink;
  member: Member;
  note?: string;
}
