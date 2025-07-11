import type { Metadata } from "next";
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
import "./globals.css";
import { Card } from "@/components/ui/card";
import ROUTES from "@/lib/constants";


const noto = localFont({
  src: "./fonts/Noto-Regular.ttf",
  variable: "--font-noto",
});



export const metadata: Metadata = {
  title: "بوابة عرب زون",
  description: "بوابة عرب زون هي بوابة إلكترونية لتقديم الطلبات الخاصة بسناريوهات لعبة ارما ريفورجر في المناطق العربية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <ClerkProvider>
    <html lang="ar">
      <body
        className={`${noto.variable} bg-zinc-950`} suppressHydrationWarning
      >
      
          <div
          className="
            fixed inset-0
            pointer-events-none
            transform 
          "
          style={{
            backgroundImage: "url('/arz-logo-black.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "80px 80px",  /* هنا حجم الشعار */
            opacity: 0.58                 /* هنا شفافية الشعار */
          }}
        />
      
            
             <div id="clerk-captcha" style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }} />
           
        {children}
                   <Toaster
          position="top-center"
          toastOptions={{
            // لتطبيق لون خلفية ونص على كل التوستات
            style: {
              backgroundColor: "#27272a", // لون الخلفية (مثلاً zinc-900)
              color: "#f4f4f5",
              border: "1px solid #52525b",
              direction: "rtl",
            },
            // أو إضافة كلاسات Tailwind إضافية
          }}
        />
      
       
     
   
      </body>
    </html>
    </ClerkProvider>
  );
}
