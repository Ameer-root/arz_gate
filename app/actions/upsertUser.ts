// app/actions/upsertUser.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { dbConnect }   from "@/database/mongoose";
import { User }        from "@/database/models/User";

export async function upsertUser() {
  const clerk = await currentUser();
  if (!clerk) throw new Error("Unauthorized");

  await dbConnect();

  const email = clerk.emailAddresses?.[0]?.emailAddress ?? "";

  /* ➊ ابحث بالـ clerkId مباشرة */
  let user = await User.findOne({ clerkId: clerk.id });

  /* ➋ إن لم يوجد، ابحث بالحقل الفريد (email) لدمج الحساب القديم */
  if (!user) {
    user = await User.findOne({ email });
  }

  /* ➌ إذا وجدنا وثيقة ماضية: حدِّث الحقول */
  if (user) {
    user.clerkId  = clerk.id;               // لو كان null سابقًا
    user.fullName = clerk.fullName ?? "";
    user.username = clerk.username ?? "";
    user.email    = email;
    await user.save();
    return user;
  }

  /* ➍ وإلّا: أنشئ وثيقة جديدة تمامًا */
  const newUser = await User.create({
    clerkId:  clerk.id,
    fullName: clerk.fullName ?? "",
    username: clerk.username ?? "",
    email,
  });

  return newUser;
}


// // app/actions/upsertUser.ts
// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import { dbConnect }   from "@/database/mongoose";
// import { User }        from "@/database/models/User";

// export async function upsertUser() {
//   const clerk = await currentUser();
//   if (!clerk) throw new Error("Unauthorized");

//   await dbConnect();
//   // ➊: حاول تجيب المستخدم الموجود مسبقًا
//   const existing = await User.findOne({ clerkId: clerk.id });
//   if (existing) {
//     // موجود، فارجع الوثيقة كما هي من دون تعديل
//     return existing;
//   }
//   // نفّذ الـ upsert مرة واحدة هنا
//   const saved = await User.findOneAndUpdate(
//     { clerkId: clerk.id },
//     {
//       clerkId:  clerk.id,
//       fullName: clerk.fullName  ?? "",
//       username: clerk.username  ?? "",
//       email:    clerk.emailAddresses?.[0]?.emailAddress ?? "",
//       // updatedAt: new Date(),
//     },
//     { upsert: true, new: true, setDefaultsOnInsert: true }
//   );

//   return saved;
// }
