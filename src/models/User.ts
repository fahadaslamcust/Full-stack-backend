import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

// Email Verification for Authentic EMAIL REGISTRATION
import crypto from "crypto";

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

  // Email Verification for Authentic EMAIL REGISTRATION
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createEmailVerificationToken(): string;
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

    // Email Verification for Authentic EMAIL REGISTRATION
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
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

// Email Verification for Authentic EMAIL REGISTRATION
userSchema.methods.createEmailVerificationToken = function () {
  // 1. Generate a random 32-character string
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash it before saving to the database (Security best practice)
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // 3. Set expiration (e.g., 24 hours from now)
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // 4. Return the unhashed token to send via email
  return verificationToken;
};

export default model<IUser>("User", userSchema);
