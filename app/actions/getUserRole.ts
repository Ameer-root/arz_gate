// app/actions/getUserRole.ts
"use server";

import { cache }       from "react";                 // ← يضمن استدعاءً واحدًا
import { currentUser } from "@clerk/nextjs/server";
import { dbConnect }   from "@/database/mongoose";
import { User }        from "@/database/models/User";
import type { Role }   from "@/lib/types";

/** تُرجِع دور المستخدم الحالي أو null إن لم يكن مسجَّل دخول */
async function _getUserRole(): Promise<Role | null> {
  const clerk = await currentUser();
  if (!clerk) return null;          // زائر

  await dbConnect();

  const doc = await User
    .findOne({ clerkId: clerk.id }, { role: 1, _id: 0 })
    .lean<{ role: Role }>()
    .exec();

  return doc?.role ?? "normal";     // وثيقة مفقودة = "normal"
}

/* يَمنع ضربَي DB في الطلب الواحد، ويُفرَّغ بعد انتهاء الاستجابة */
export const getUserRole = cache(_getUserRole);


// // app/actions/getUserRole.ts
// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import { dbConnect }   from "@/database/mongoose";
// import { User }        from "@/database/models/User";
// import type { Role}   from "@/lib/types";     // ← نفس المصدر الذي نُقلت إليه ROLE_VALUES

// export async function getUserRole(): Promise<Role | null> {
//   const clerk = await currentUser();
//   if (!clerk) return null;        // ← زائر غير مسجَّل

//   await dbConnect();

//   const user = await User
//     .findOne({ clerkId: clerk.id }, { role: 1, _id: 0 })
//     .lean<{ role: Role }>()
//     .exec();

//   // إن لم توجد وثيقة (احتمال نادر) نُعاملها كـ "normal"
//   return user?.role ?? "normal";
// }
