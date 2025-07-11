// database/models/User.ts
import { ROLE_VALUES } from "@/lib/constants";
import { Schema, model, models } from "mongoose";


const UserSchema = new Schema(
  {
    clerkId:  { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email:    { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: "normal",
      required: true,
      index: true,
    },
  },
  {
    collection: "users",
    timestamps: true,     // ← يضيف createdAt و updatedAt أوتوماتيكياً
  }
);

export const User = models.User || model("User", UserSchema);
