// app/actions/submitApplication.ts
"use server";

import { Application }  from "@/database/models/Application";
import { PublicForm }   from "@/lib/validate";
import { upsertUser }   from "./upsertUser";

// غيّر التوقيع ليأخذ بيانات النموذج كـ أي كائن
export async function submitApplication(data: unknown) {
  // 1) صحّح/تحقّق البيانات مباشرةً
  const answers = PublicForm.parse(data);

  // 2) تأكد من وجود/تحديث سجل المستخدم
  const user = await upsertUser();


  // 3) احفظ الـ application وارجع بس الـ _id كنص
  const app = await Application.create({
    userId: user._id,
    answers,
  });

  return { id: app._id.toString() };
}
