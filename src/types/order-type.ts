import type { ObjectId } from "mongodb";

export interface TOrder {
  _id?: ObjectId;
  userId: string;
  orderDate: Date;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }> | null;
  shippingAddress: string | null;
}
