/* validate.ts
 * جميع تحقّقات النموذج في مكان واحد.
 * لا تحذف أي شيء موجود مسبقاً.
 * أضفت مخططاً جديداً باسم TacticalForm يغطي الأسئلة (1-25).
 --------------------------------------------------------------------- */

import { z } from "zod";
import { FIELD_TYPES } from "./types"; // ← الثابت الخاص بحقول البناء الديناميكي
import { ARABIC_COUNTRY_VALUES } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/* ❶ تحقّق حقول البناء الديناميكي – كما كانت                       */
/* ------------------------------------------------------------------ */
export const FieldZod = z.object({
  label: z.string().min(2, "أدخل تسمية"),
  placeholder: z.string().optional(),
  type: z.enum(FIELD_TYPES),
  required: z.boolean(),
});
export type FieldForm = z.infer<typeof FieldZod>;


/* ------------------------------------------------------------------ */
/* ❷ نموذج التعريف البسيط – يبقى كما هو                               */
/* ------------------------------------------------------------------ */
export const FormApply = z.object({
  name: z
    .string()
    .min(1, { message: "الاسم مطلوب" })
    .max(100, { message: "الاسم يجب ألا يتجاوز 100 حرفاً" }),

  description: z
    .string()
    .min(1, { message: "الوصف مطلوب" })
    .max(1000, { message: "الوصف يجب ألا يتجاوز 1000 حرف" }),
});

/* ------------------------------------------------------------------ */
/* ❸ النموذج التكتيكي الكامل (25 خانة)                               */
/* ------------------------------------------------------------------ */
export const PublicForm = z
  .object({
    /* 1 */ fullName: z
      .string()
      .min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل")
      .max(100, "الاسم الكامل يجب ألا يتجاوز 100 حرف"),

    /* 2 */ discordTag: z
      .string()
      .regex(
        /^.{2,32}#\d{4}$/,
        "اكتب اسم الديسكورد متبوعاً بالرقم (#1234) بدقة"
      ),

    /* 3 */ age: z
      .coerce.number()
      .int("العمر يجب أن يكون رقماً صحيحاً")
      .min(12, "العمر الأدنى 12 سنة")
      .max(99, "العمر الأقصى 99 سنة"),

  /* 4 */ timezone: z
    .enum(ARABIC_COUNTRY_VALUES, {
      errorMap: () => ({ message: "اختر الدولة" }),
    }),


    /* 5 */ gameLevel: z
      .coerce.number()
      .int()
      .min(1, "المستوى من 1 إلى 10")
      .max(10, "المستوى من 1 إلى 10"),

    gameLevelReason: z
      .string()
      .min(5, "اشرح سبب تقييمك لمستواك باختصار (5 أحرف على الأقل)")
      .max(300, "الشرح لا يتجاوز 300 حرف"),

    /* 6 */ hoursPerWeek: z
      .coerce.number()
      .int("يجب إدخال عدد الساعات بالأرقام")
      .min(1, "على الأقل ساعة واحدة أسبوعياً")
      .max(168, "أقصى عدد ساعات في الأسبوع هو 168"),

    /* 7 */ similarModes: z
      .string()
      .min(10, "اذكر الأطوار المشابهة التي جربتها")
      .max(500, "النص طويل جداً (500 حرف كحد أقصى)"),

    /* 8 */ joinReason: z
      .string()
      .min(10, "اذكر سبب رغبتك في الانضمام")
      .max(500, "السبب لا يتجاوز 500 حرف"),

    /* 9 */ preferPhase: z.enum(["التخطيط", "التنفيذ"], {
      required_error: "اختر التخطيط أو التنفيذ",
      invalid_type_error: "القيمة غير صالحة",
    }),

    preferPhaseReason: z
      .string()
      .min(10, "اشرح سبب تفضيلك")
      .max(300, "الشرح لا يتجاوز 300 حرف"),

    /* 10 */ roleRequested: z.enum(
      ["قناص", "الدعم", "قائد", "مهندس", "استكشاف", "أخرى"],
      {
        required_error: "اختر تخصصاً",
        invalid_type_error: "التخصص غير صالح",
      }
    ),

    /* 11 */ acceptYoungerLeader: z.boolean({
      required_error: "حدد نعم أو لا",
      invalid_type_error: "القيمة يجب أن تكون true أو false",
    }),

    /* 12 */ disagreeMission: z
      .string()
      .min(5, "صف تصرفك إذا كُلّفت بمهمة ضد رأيك")
      .max(500, "الشرح لا يتجاوز 500 حرف"),

    /* 13 */ ambushFirstStep: z
      .string()
      .min(5, "اذكر أول خطوة في حالة الكمين")
      .max(500, "الشرح لا يتجاوز 500 حرف"),

    /* 14-19 | أسئلة السيناريو التكتيكي الصعبة */
    openFieldTactics: z
      .string()
      .min(50, "اشرح تحرككم ضد قناصين في خريطة مفتوحة")
      .max(600, "الشرح لا يتجاوز 600 حرف"),

    teammateRevealed: z
      .string()
      .min(5, "صف تصرفك مع اللاعب الذي كشف المكان")
      .max(400, "الشرح لا يتجاوز 400 حرف"),

    missionVsTeam: z.enum(
      ["السلامة قبل المهمة", "إنجاز المهمة اولاً"],
      {
        required_error: "اختر أحد الخيارين",
        invalid_type_error: "القيمة غير صالحة",
      }
    ),

    silentMissionNoise: z
      .string()
      .min(10, "اشرح تصرفك مع زميل مزعج أثناء مهمة صامتة")
      .max(400, "الشرح لا يتجاوز 400 حرف"),

    trainNewbies: z.enum(["أدربهم", "أفضل نفس المستوى"], {
      required_error: "اختر إن كنت ستدربهم أو تفضل اللعب مع مستواك فقط",
      invalid_type_error: "القيمة غير صالحة",
    }),

    buildingEntry: z
      .string()
      .min(
        25,
        "اشرح خطة الدخول إلى مبنى مشبوه في وقت محدود مع احتمال وجود فخ"
      )
      .max(600, "الشرح لا يتجاوز 600 حرف"),

    /* 20 | التقييم الذاتي بالأرقام */
    commsScore: z
      .coerce.number()
      .int()
      .min(1, "التواصل من 1 إلى 10")
      .max(10, "التواصل من 1 إلى 10"),
    ordersScore: z
      .coerce.number()
      .int()
      .min(1, "تنفيذ الأوامر من 1 إلى 10")
      .max(10, "تنفيذ الأوامر من 1 إلى 10"),
    pressureScore: z
      .coerce.number()
      .int()
      .min(1, "اتخاذ القرار تحت الضغط من 1 إلى 10")
      .max(10, "اتخاذ القرار تحت الضغط من 1 إلى 10"),
    teamworkScore: z
      .coerce.number()
      .int()
      .min(1, "العمل الجماعي من 1 إلى 10")
      .max(10, "العمل الجماعي من 1 إلى 10"),

    /* 21-23 | نقاط الضعف والقوة والالتزام */
    weaknesses: z
      .string()
      .min(3, "اذكر نقطة ضعف واحدة على الأقل")
      .max(400, "النص لا يتجاوز 400 حرف"),
    strengths: z
      .string()
      .min(3, "اذكر نقطة قوة واحدة على الأقل")
      .max(400, "النص لا يتجاوز 400 حرف"),
commitment: z
  .boolean({
    required_error: "حدد قدرتك على الالتزام بالفعاليات",
    invalid_type_error: "القيمة يجب أن تكون true أو false",
  })
  .refine((val) => val === true, {
    message: "يجب الموافقة على الالتزام بالفعاليات",
  }),

    /* 24 | الطرد السابق */
    kickedBefore: z.enum(["نعم", "لا"], {
      required_error: "أجب بنعم أو لا",
      invalid_type_error: "القيمة غير صالحة",
    }),
    kickReason: z.string().optional(),

    /* 25 | مساحة حرّة */
    freeSpace: z.string().optional(),
  })
  /* شرط إضافي: سبب الطرد مطلوب إذا كانت الإجابة (نعم) */
  .refine(
    (data) => (data.kickedBefore === "نعم" ? !!data.kickReason?.trim() : true),
    {
      message: "اذكر سبب الطرد السابق بصراحة",
      path: ["kickReason"],
    }
  );

export type TacticalFormValues = z.infer<typeof PublicForm>;
