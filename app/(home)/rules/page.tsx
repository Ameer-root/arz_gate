// app/apply/page.tsx
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";



export const metadata: Metadata = {
  title: "بوابة عرب زون - القوانين",
  description: "قوانين وسياسات استخدام بوابة عرب زون",
};

export default async function Rules() {

  // // 2) جلب بيانات الـ Clerk
  // const clerkUser = await currentUser();
  // if (!clerkUser) {
  //   redirect("/");       // جلسة منتهية ربما
  // }



  // 5) عرض النموذج
  return (
    <Card className="w-full py-10 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-white">
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
      </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
           <Accordion
      type="single"
      collapsible
      className="w-full text-zinc-300"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer">Product Information</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Our flagship product combines cutting-edge technology with sleek
            design. Built with premium materials, it offers unparalleled
            performance and reliability.
          </p>
          <p>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and experts.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="cursor-pointer">Shipping Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </p>
          <p>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="cursor-pointer">Return Policy</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
      </CardContent>
    </Card>
  );
}
