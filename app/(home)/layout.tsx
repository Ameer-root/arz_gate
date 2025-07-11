
import localFont from 'next/font/local'
import { Toaster } from 'sonner';

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import "../globals.css";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navigation/navbar";
import LeftSidebar from "@/components/navigation/LeftSideBar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from '@/app/actions/getUserRole';




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { userId } = await auth();
  if (!userId) {
    redirect("/");       // غير مسجّل → ارجعه للصفحة الرئيسية
  }
    const role = await getUserRole();     // ← استدعاء واحد
  return (
   <>

            {/* <main className="flex min-h-screen flex-col items-center justify-center px-4"> */}

           
    <main className="realtive">
               <Navbar role={role} />
              <div className="flex" dir="rtl">
               <LeftSidebar role={role} />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        </div>
       
       </main>

    {/* </main> */}
 </>
  );
 
}
