import { Schema, model, Document, Types } from "mongoose";

export interface IEvent extends Document {
  id: string;
  organizer: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity?: number;
  attendees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, min: 1 },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual ID getter to match our standard
eventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export default model<IEvent>("Event", eventSchema);
