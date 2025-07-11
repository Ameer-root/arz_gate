// app/actions/getApplicationById.ts
"use server";
import { dbConnect } from "@/database/mongoose";
import { Application } from "@/database/models/Application";

export async function getApplicationById(id: string) {
  await dbConnect();
  const doc = await Application.findById(id)
    .populate("userId", "fullName email")
    .lean<{ answers: any; userId: { fullName: string; email: string } }>()
    .exec();
  if (!doc) throw new Error("Application not found");
  return {
    name:   doc.userId.fullName,
    email:  doc.userId.email,
    answers: doc.answers,     // ما كتبَه في الفورم
  };
}
