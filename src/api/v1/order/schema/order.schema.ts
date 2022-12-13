import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Order {
  userId: Types.ObjectId;
  donationId: Types.ObjectId;
  pgStatus: string;
  method: string;
  paidStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Order>({
    userId: { type: Schema.Types.ObjectId },
    donationId: { type: Schema.Types.ObjectId },
    pgStatus: { type: String },
    method: { type: String },
    paidStatus: { type: String },  // ["notyet", "cancel", "complete"]
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
const OrderModel = model<Order>(ModelNames.Order, schema);

export { OrderModel };
