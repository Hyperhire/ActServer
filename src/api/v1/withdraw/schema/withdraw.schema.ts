import { Schema, model, Types } from "mongoose";
import { WithdrawStatus } from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  orgId: { type: Types.ObjectId, required: true },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enums: Object.values(WithdrawStatus),
    default: WithdrawStatus.PENDING
  },
  orders: { type: [Types.ObjectId] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WithdrawModel = model(ModelNames.Withdraw, schema);

export { WithdrawModel };
