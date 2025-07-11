// app/apply/page.tsx
import Apply            from "@/components/ApplyForm";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { upsertUser } from "@/app/actions/upsertUser";



export default async function ApplyPage() {
  // // 1) مصادقة Clerk
  // const { userId } = await auth();
  // if (!userId) {
  //   redirect("/");       // غير مسجّل → ارجعه للصفحة الرئيسية
  // }

  // // 2) جلب بيانات الـ Clerk
  // const clerkUser = await currentUser();
  // if (!clerkUser) {
  //   redirect("/");       // جلسة منتهية ربما
  // }
   
  await upsertUser();

  // 5) عرض النموذج
  return (
    <Card className="w-full py-10 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-white">
          نموذج التقديم
        </CardTitle>
      </CardHeader>
      <CardContent>
              
        <Apply />
              
      </CardContent>
    </Card>
  );
}
