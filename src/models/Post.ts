import { Schema, model, Document, Types } from "mongoose";

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default model<IPost>("Post", postSchema);
