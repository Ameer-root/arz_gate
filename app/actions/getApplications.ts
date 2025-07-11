// app/actions/getApplications.ts
"use server";

import { Types }       from "mongoose";
import { dbConnect }   from "@/database/mongoose";
import { Application } from "@/database/models/Application";

/* صفّ واحد في الجدول */
export interface AppRow {
  id: string;
   userId:   string; 
  name: string;
  email: string;
  status: "معلّق" | "مقبول" | "مرفوض";
}

/* نتيجة مع الصفحة */
export interface PaginatedApps {
  total: number;     // ← لإظهار عدد الصفحات
  data:  AppRow[];
}

/* نفس Lean type كما كان */
interface LeanApplication {
  _id:    Types.ObjectId;                 // معرّف الطلب
  status: AppRow["status"];
  userId: {
    _id:      Types.ObjectId;             // ← أضِف هذا السطر
    fullName: string;
    email:    string;
  };
}


/**
 * جلب الطلبات مقسّمة صفحات.
 * @param page  رقم الصفحة (1-based)
 * @param limit عدد العناصر في الصفحة
 */
export async function getApplications(
  page  = 1,
  limit = 15
): Promise<PaginatedApps> {
  await dbConnect();

  const skip = (page - 1) * limit;

  /* اجلب العدد الكلي والدفعة المطلوبة معاً */
  const [total, docs] = await Promise.all([
    Application.estimatedDocumentCount(),               // ← سريع لأنك مفهرِس
    Application.find()
      .sort({ createdAt: -1 })                          // الأحدث أولاً
      .skip(skip)
      .limit(limit)
      .select("status userId")
      .populate("userId", "fullName email")
      .lean<LeanApplication[]>(),
  ]);

  const data: AppRow[] = docs.map(({ _id, status, userId }) => ({
    id: _id.toString(),
    userId: userId._id.toString(),
    name: userId.fullName,
    email: userId.email,
    status,
  }));

  return { total, data };
}
