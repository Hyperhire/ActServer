import { Schema, model } from "mongoose";
import { PostStatus } from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: { type: [String], default: [] },
  orgId: { type: Schema.Types.ObjectId, ref: ModelNames.Org },
  status: {
    type: String,
    enum: Object.values(PostStatus),
    default: PostStatus.PENDING_APPROVAL
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const NewsModel = model(ModelNames.News, schema);

export { NewsModel };
