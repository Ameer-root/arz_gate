// database/models/Application.ts
import { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    // بدلاً من تخزين معرف Clerk كسلسلة،
    // نستخدم ObjectId مع ref:"User" لنتمكن من populate لاحقاً
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // الإجابات كما كانت (كائن Mixed)
    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },
      status: {
      type: String,
      enum: ["معلّق", "مقبول", "مرفوض"],
      default: "معلّق",
      index: true,
    },
  },
  {
    collection: "applications",
    timestamps: true,   // يضيف createdAt وupdatedAt تلقائياً
  }
);
ApplicationSchema.index({ createdAt: -1 });
export const Application =
  models.Application || model("Application", ApplicationSchema);
