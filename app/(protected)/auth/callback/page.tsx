// app/auth/callback/page.tsx
import { RedirectWithCountdown } from "@/components/memes/RedirectWithCountdown";
import { Spinner } from "@/components/Spinner";
import ROUTES from "@/lib/constants";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link"; // أضف هذا السطر
import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default async function OAuthCallback() {
  const { userId } = await auth();

  // إذا كان المستخدم مسجل دخوله بالفعل
  if (userId) {
    // نعرض له مكون العد التنازلي وإعادة التوجيه
    return <RedirectWithCountdown />;
  }

  // إذا لم يكن المستخدم مسجل دخوله، سيكمل العملية بشكل طبيعي
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-zinc-100">
      {/* Spinner ثابت يظهر فوراً */}
      <Spinner />

      <p className="text-xl font-bold">
        لحظة من فضلك...
      </p>
      
      <AuthenticateWithRedirectCallback
        signInUrl={ROUTES.APPLY}
        signUpUrl={ROUTES.APPLY}
        /* أين تريد التوجيه بعد تسجيل الدخول (مستخدم قديم) */
        signInFallbackRedirectUrl={ROUTES.APPLY}
        /* أين تريد التوجيه بعد إنشاء حساب جديد */
        signUpFallbackRedirectUrl={ROUTES.APPLY}
      />
    </div>
  );
}