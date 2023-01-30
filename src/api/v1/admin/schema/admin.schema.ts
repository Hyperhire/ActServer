import { Schema, model } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  id: { type: String, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AdminModel = model(ModelNames.Admin, schema);

export { AdminModel };
