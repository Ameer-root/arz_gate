// app/actions/updateApplicationStatus.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect }      from "@/database/mongoose";
import { Application }    from "@/database/models/Application";
import { getUserRole }    from "./getUserRole";        // الدالة التي كتبتها سابقًا
import type { Role }      from "@/lib/types";

type AllowedStatus = "معلّق" | "مقبول" | "مرفوض";

export async function updateApplicationStatus(
  appId: string,
  newStatus: AllowedStatus,
) {
  // ➊ تحقّق الدور
  const role: Role | null = await getUserRole();
  if (role !== "admin" && role !== "superadmin") {
    throw new Error("Unauthorized");
  }

  // ➋ حدّث الوثيقة
  await dbConnect();
  const updated = await Application.findByIdAndUpdate(
    appId,
    { status: newStatus },
    { new: true, select: "_id status" },
  ).lean();

  if (!updated) throw new Error("Application not found");

  // ➌ أعد تفعيل مسار لوحة التحكم
  revalidatePath("/dashboard");
  return { ok: true };
}
