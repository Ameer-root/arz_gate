"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { PublicForm } from "@/lib/validate";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import ROUTES, { ARABIC_COUNTRIES } from "@/lib/constants";
import { submitApplication } from "@/app/actions/submitApplication";
import { useRouter }     from "next/navigation";
import { Spinner } from "./Spinner";

/**
 * ---------------------------------------------------------------------------
 * ⚠️  ملاحظة
 * هذا الملف يجمّع جميع الحقول الـ 25 ( 25 سؤال تكتيكي)
 * ويتبع مخطط Zod الموجود في `PublicForm` داخل validate.ts.
 * إذا غيّرت أسماء المفاتيح في المخطط، تأكد من تعديلها هنا أيضاً.
 * ---------------------------------------------------------------------------
 */

type ApplyFields = z.infer<typeof PublicForm>;

const Apply = () => {
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [shake, setShake] = useState(false);

 const router = useRouter();  


// ,isLoaded: isUserLoaded
  //   // ————— Upsert user to DB on first successful login —————
  // useEffect(() => {
  //   if (!isUserLoaded  || !user) return;
  //   // نرسل سجل upsert للمستخدم
  //   fetch("/api/users/upsert", {
  //     method:  "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       clerkId:  user.id,
  //       fullName: user.fullName,
  //       username: user.username,
  //       email:    user.emailAddresses?.[0]?.emailAddress ?? "",
  //     }),
  //   }).catch((err) => {
  //     console.error("Upsert user failed:", err);
  //   });
  // }, [isUserLoaded, user]);
  const defaultValues: ApplyFields = {
    /* التعريف العام */
    fullName: "",
    discordTag: "",
    age: 18,
    timezone: "" as ApplyFields["timezone"],

    /* 1-25 أسئلة التكتيك */
    gameLevel: 5,
    gameLevelReason: "",
    hoursPerWeek: 10,
    similarModes: "",
    joinReason: "",
    preferPhase: "التخطيط",
    preferPhaseReason: "",
    roleRequested: "الدعم",
    acceptYoungerLeader: false,
    disagreeMission: "",
    ambushFirstStep: "",
    openFieldTactics: "",
    teammateRevealed: "",
    missionVsTeam: "السلامة قبل المهمة",
    silentMissionNoise: "",
    trainNewbies: "أدربهم",
    buildingEntry: "",
    commsScore: 5,
    ordersScore: 5,
    pressureScore: 5,
    teamworkScore: 5,
    weaknesses: "",
    strengths: "",
    commitment: true,
    kickedBefore: "لا",
    kickReason: "",
    freeSpace: "",
  };

  useEffect(() => {
    if (!isLoaded || !user) return;

    const acc = user.externalAccounts?.find(
      (a) => a.provider === "discord"
    ) as { label?: string; username?: string } | undefined;

    const tag =
      acc?.label?.includes("#") ? acc.label : acc?.username ?? "";

    form.reset({
      ...form.getValues(),
      fullName: user.fullName ?? "",
      discordTag: tag,
    });
  }, [isLoaded, user]);

  const form = useForm<ApplyFields>({
      mode: "onChange",
    resolver: zodResolver(PublicForm),
    defaultValues,
  });
  const {
    formState: { errors, submitCount, isSubmitting },
    watch,
  } = form;

useEffect(() => {
  const errKeys = Object.keys(errors);
  if (submitCount > 0 && errKeys.length > 0) {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 1000);

    if (errKeys.length === 1) {
      // خطأ واحد: عرض رسالة هذا الحقل
      const key = errKeys[0];
      const message = (errors as any)[key]?.message;
      if (typeof message === "string") {
        toast.error(message);
      } else {
        toast.error("فشل إرسال النموذج، تحقق من الحقل.");
      }
    } else {
      // أكثر من خطأ: الرسالة العامة
      toast.error("فشل إرسال النموذج، تأكد من تعبئة كل الحقول المطلوبة");
    }

    return () => clearTimeout(timer);
  }
}, [submitCount, errors]);


  const kickedBeforeWatch = watch("kickedBefore");

  const onSubmit = async(data: ApplyFields) => {
    try {
      // ننادي الـ Server Action مباشرة بالكائن values
      await submitApplication(data);
            toast.success("تم إرسال النموذج بنجاح!");

      // إذا احتجت توجه المستخدم:
      router.push(ROUTES.RULES);
    } catch (err) {
      // console.error("Failed to submit", err);
            toast.error("فشل إرسال النموذج، حاول مجدداً.");

    }
    console.log("بيانات النموذج ⬇️", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`
          grid gap-6 bg-zinc-900 p-3.5 rounded-md
          ${shake ? "animate-shake" : ""}
        `}
        dir="rtl"
      >
        {/* Progress Bar */}
        <Progress value={(step / 5) * 100} className="mb-4 bg-zinc-300 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-fuchsia-500 transform -scale-x-100" />
        <div className="text-white font-medium mb-4">
          الخطوة {step} من 5
        </div>

        {/* -------- Step 1: التعريف العام -------- */}
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="اسمك الثلاثي"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discordTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    اسم مستخدم ديسكورد مع الرقم{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      placeholder="Example#1234"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    العمر <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

 <FormField
  control={form.control}
  name="timezone"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-white">الدولة <span className="text-red-500">*</span></FormLabel>
      <FormControl>
        <Select
          onValueChange={field.onChange}
          value={field.value}
        >
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
            <SelectValue placeholder="اختر دولتك" />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="bg-zinc-800 text-white border-z-inc-700"
          >
            {ARABIC_COUNTRIES.map(({ label, value }) => (
              <SelectItem key={value} value={value} dir="rtl">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription>
        اختر دولتك ليتم استخدام المنطقة الزمنية الصحيحة
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

          </>
        )}

        {/* -------- Step 2: معلومات اللعب -------- */}
        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="gameLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">مستواك (1-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gameLevelReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    سبب التقييم
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="اختصر سبب التقييم"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoursPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    عدد الساعات أسبوعياً
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={168}
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="similarModes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    أطوار مشابهة جربتها
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أسماء الأطوار وخبرتك فيها"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joinReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    سبب رغبتك في الانضمام
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب السبب باختصار"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* -------- Step 3: تفضيلات واستراتيجيات -------- */}
        {step === 3 && (
          <>
            <FormField
              control={form.control}
              name="preferPhase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    تفضيلك (التخطيط / التنفيذ)
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-white border-zinc-700" align="end">
                        <SelectItem value="التخطيط" dir="rtl">
                          التخطيط
                        </SelectItem>
                        <SelectItem value="التنفيذ" dir="rtl">
                          التنفيذ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferPhaseReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    سبب التفضيل
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="اذكر السبب بإيجاز"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleRequested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">تخصصك</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-white border-zinc-700" align="end">
                        <SelectItem value="قناص" dir="rtl">قناص</SelectItem>
                        <SelectItem value="الدعم" dir="rtl">دعم</SelectItem>
                        <SelectItem value="قائد" dir="rtl">قائد</SelectItem>
                        <SelectItem value="مهندس" dir="rtl">مهندس</SelectItem>
                        <SelectItem value="استكشاف" dir="rtl">استكشاف</SelectItem>
                        <SelectItem value="أخرى" dir="rtl">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptYoungerLeader"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 rounded border border-purple-600
                            data-[state=checked]:bg-purple-600
                            focus-visible:ring-2 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      أستطيع العمل تحت قيادة شخص أصغر أو أقل خبرة
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disagreeMission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    تصرفك إذا كُلّفت بمهمة ضد رأيك
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="صف ما ستفعل"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* -------- Step 4: أسئلة تكتيكية متقدمة -------- */}
        {step === 4 && (
          <>
            <FormField
              control={form.control}
              name="ambushFirstStep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    أول خطوة في حالة الكمين
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="صف الخطوة الأولى"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openFieldTactics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    تكتيكك في خريطة مفتوحة ضد قناصين
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اشرح باختصار"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teammateRevealed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    تصرفك مع لاعب كشف الموقع
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اشرح التصرف"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="missionVsTeam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    ما الأولوية؟
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-white border-zinc-700" align="end">
                        <SelectItem value="السلامة قبل المهمة" dir="rtl">
                          السلامة قبل المهمة
                        </SelectItem>
                        <SelectItem value="إنجاز المهمة اولاً" dir="rtl">
                          إنجاز المهمة أولاً
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="silentMissionNoise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    تصرفك مع زميل مزعج
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اشرح التصرف"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainNewbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    التعامل مع لاعبين أقل خبرة
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-white border-zinc-700" align="end">
                        <SelectItem value="أدربهم" dir="rtl">أدربهم</SelectItem>
                        <SelectItem value="أفضل نفس المستوى" dir="rtl">
                          أفضل نفس المستوى
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildingEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    خطة دخول مبنى مشبوه
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اشرح خطتك بإيجاز"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* -------- Step 5: التقييم الذاتي والملاحظات -------- */}
        {step === 5 && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="commsScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      التواصل (1-10)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ordersScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      تنفيذ الأوامر (1-10)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pressureScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      اتخاذ القرار (1-10)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamworkScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      العمل الجماعي (1-10)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="weaknesses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    نقاط الضعف
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اذكر نقاط ضعفك"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    نقاط القوة
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اذكر نقاط قوتك"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commitment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 rounded border border-purple-600
                            data-[state=checked]:bg-purple-600
                            focus-visible:ring-2 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      أتعهد بالالتزام بجداول التدريب والفعاليات
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kickedBefore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    هل سبق وتم طردك؟
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-white border-zinc-700" align="end">
                        <SelectItem value="لا" dir="rtl">لا</SelectItem>
                        <SelectItem value="نعم" dir="rtl">نعم</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {kickedBeforeWatch === "نعم" && (
              <FormField
                control={form.control}
                name="kickReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      سبب الطرد
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="فصّل سبب الطرد السابق"
                        className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="freeSpace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    مساحة حرّة
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب أي شيء يميزك كلاعب أو كعضو فريق"
                      className="bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-1 text-sm text-zinc-400">
                    اختياري
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

            {/* -------- Navigation Buttons -------- */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setStep(step - 1);
              }}
              className="bg-zinc-300 cursor-pointer"
            >
              السابق
            </Button>
          )}

          {step < 5 ? (
            <Button
              type="button"
              className="bg-purple-600 text-zinc-100 hover:bg-purple-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setStep(step + 1);
              }}
            >
              التالي
            </Button>
          ) : (
  isSubmitting ? (
    <Button
      disabled
      className="bg-zinc-700 text-zinc-300 cursor-wait flex items-center justify-center gap-3"
    >
      من فضلك انتظر…
     
      {Spinner()}
    </Button>
  ) : (
    <Button
      type="submit"
      className="bg-purple-600 text-zinc-100 hover:bg-purple-500 cursor-pointer"
    >
      تقديم الطلب
    </Button>
  )
)}
        </div>
      </form>
    </Form>
  );
};

export default Apply;