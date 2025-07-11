"use client";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignedIn, SignedOut, useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { Gamepad2, HeartCrack } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/lib/constants";
import { Spinner } from "./Spinner";

export default function LoginCard() {
  const { signIn, isLoaded} = useSignIn();
    // const { signUp, isLoaded } = useSignUp();
  const { signOut } = useClerk();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false); // ← حالة تسجيل الخروج
  const [isNavigating, setIsNavigating] = useState(false);



  const router = useRouter();

  const handleGoToApply = () => {
        setIsNavigating(true);
    router.push(ROUTES.APPLY);
  };
  async function handleDiscordLogin() {
    if (!isLoaded || isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_discord",
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/apply",
      });
            toast.success("تم تحويلك إلى Discord! 💖");

    } catch (err) {
      console.error("OAuth error", err);
            toast.error("فشل تسجيل الدخول، حاول مجدداً.");
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success("تم تسجيل الخروج بنجاح. 💔💔💔💔💔💔");  
      // هنا بإمكانك إعادة توجيه المستخدم أو غير ذلك
    } catch (err) {
      console.error("Sign-out error", err);
      toast.error("فشل تسجيل الخروج، حاول مجدداً."); 
      setIsSigningOut(false);
    }
  }


  return (
    <CardContent className="space-y-6 text-center" dir="rtl">
      {/* الشعار والعنوان */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="neon-image-wrapper">
          <Image
            src="/arz-logo.png"
            width={200}
            height={200}
            alt="arab zone logo"
            className="absolute bottom-14"
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          بوابة
          <span className="inline-block -rotate-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-4xl text-transparent leading-relaxed animated-arz-text">
            عرب زون
          </span>
        </h1>
      </div>

      <p className="text-zinc-400">
        بوابتك المُوحَّدة للتقديم في فعاليات السيرفر.
        <br />
        سجّل دخولك عبر&nbsp;Discord للبدء.
      </p>
               

      {/* 1) حالة تحميل أولية عند Refresh */}
      {!isLoaded ? (
        <Button
          disabled
          className="w-full bg-zinc-700 text-zinc-300 cursor-wait flex items-center justify-center gap-3"
        >
          جار التحميل…
          {Spinner()}
        </Button>
      ) : isSigningIn ? (
        /* 2) حالة تحميل عند النقر على زر تسجيل الدخول */
        <Button
          disabled
          className="w-full bg-zinc-700 text-zinc-300 cursor-wait flex items-center justify-center gap-3"
        >
          من فضلك انتظر قليلاً ولا تحمل الصفحة
          {Spinner()}
        </Button>
      ) : (
        /* 3) الأزرار العادية بعد التحميل */
        <>

          <SignedOut>
            <Button
              onClick={handleDiscordLogin}
              className="w-full bg-purple-600 hover:bg-purple-500 text-zinc-100 cursor-pointer"
            >
              تسجيل الدخول بـ Discord
            </Button>
          </SignedOut>

          <SignedIn>
            {isSigningOut ? (
              /* حالة تحميل عند تسجيل الخروج */
              <Button
                disabled
                className="w-full bg-zinc-700 text-zinc-300 cursor-wait flex items-center justify-center gap-3"
              >
                جار تسجيل الخروج…
                {Spinner()}
              </Button>
              
            ) : (
              <>
              <Button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 hover:bg-fuchsia-600 hover:opacity-90text-zinc-100 transition font-bold cursor-pointer"
              >
                تسجيل الخروج
                <HeartCrack
                  className="h-5 w-5 text-fuchsia-50"
                  strokeWidth={3}
                  aria-label="خروج"
                />
              </Button>

            {/* زرّ الانتقال إلى Apply */}
            {isNavigating ? (
              <Button disabled className="w-full bg-zinc-700 text-zinc-300 cursor-wait flex items-center justify-center gap-3">
                جارٍ الانتقال…
                <Spinner />
              </Button>
            ) : (
              <Button
                onClick={handleGoToApply}
                className="w-full bg-purple-600 hover:bg-purple-700 text-zinc-100 font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                رجعني
                <Gamepad2
                  className="h-5 w-5 text-fuchsia-50"
                  strokeWidth={3}
                  aria-label="رجعني"
                />
              </Button>
              )}
              </>
            )}
          </SignedIn>
        </>
      )}

      <p className="text-xs text-zinc-500">
        ملاحظة: يُشترَط أن تكون
        <span className="font-medium text-purple-400">
          <a href="https://discord.gg/arzc" target="_blank" className="font-bold">
            &nbsp;عضواً&nbsp;
          </a>
        </span>
        داخل سيرفر عرب زون.
      </p>
    </CardContent>
  );
}
