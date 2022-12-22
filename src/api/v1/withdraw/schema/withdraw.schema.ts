import { Schema, model } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WithdrawModel = model(ModelNames.Withdraw, schema);

export { WithdrawModel };
