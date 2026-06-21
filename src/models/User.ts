import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  bio: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  avatar: string;
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      select: false, // Hides password
    },
    bio: { type: String, default: "", maxlength: 250 },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// Method to verify passwords during login
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Virtual getter to convert id into STRING
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export default model<IUser>("User", userSchema);
