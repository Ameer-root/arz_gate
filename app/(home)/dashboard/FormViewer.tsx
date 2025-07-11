"use client";

import { useState, useTransition } from "react";
import { getApplicationById } from "@/app/actions/getApplicationById";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

/* قاموس العناوين العربية */
const FORM_LABELS: Record<string, string> = {
  fullName: "الاسم الكامل",
  discordTag: "اسم مستخدم ديسكورد مع الرقم",
  age: "العمر",
  timezone: "الدولة",
  gameLevel: "مستواك (1-10)",
  gameLevelReason: "سبب التقييم",
  hoursPerWeek: "عدد الساعات أسبوعياً",
  similarModes: "أطوار مشابهة جربتها",
  joinReason: "سبب رغبتك في الانضمام",
  preferPhase: "تفضيلك (التخطيط / التنفيذ)",
  preferPhaseReason: "سبب التفضيل",
  roleRequested: "تخصصك",
  acceptYoungerLeader: "أستطيع العمل تحت قيادة شخص أصغر",
  disagreeMission: "تصرفك إذا كُلّفت بمهمة ضد رأيك",
  ambushFirstStep: "أول خطوة في حالة الكمين",
  openFieldTactics: "تكتيكك في خريطة مفتوحة ضد قناصين",
  teammateRevealed: "تصرفك مع لاعب كشف الموقع",
  missionVsTeam: "الأولوية (المهمة أم السلامة)",
  silentMissionNoise: "تصرفك مع زميل مزعج",
  trainNewbies: "التعامل مع لاعبين أقل خبرة",
  buildingEntry: "خطة دخول مبنى مشبوه",
  commsScore: "التواصل (1-10)",
  ordersScore: "تنفيذ الأوامر (1-10)",
  pressureScore: "اتخاذ القرار (1-10)",
  teamworkScore: "العمل الجماعي (1-10)",
  weaknesses: "نقاط الضعف",
  strengths: "نقاط القوة",
  commitment: "التزامك بالجداول",
  kickedBefore: "هل سبق وتم طردك؟",
  kickReason: "سبب الطرد",
  freeSpace: "مساحة حرّة",
};

/* props: معرّف الطلب + نص الزر داخل القائمة */
type Props = { appId: string; label?: string };

export function FormViewer({ appId, label = "عرض" }: Props) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{
    name: string;
    email: string;
    answers: Record<string, unknown>;
  } | null>(null);
  const [pending, start] = useTransition();

  const handleOpen = () => {
    start(async () => {
      const res = await getApplicationById(appId); // Server Action RPC
      setData(res);
      setOpen(true);
    });
  };

  return (
    <>
      {/* عنصر القائمة المنسدلة */}
      <DropdownMenuItem
        disabled={pending}
        onSelect={(e) => {
          e.preventDefault(); // لا تغلق القائمة
          handleOpen();
        }}
      >
        {label}
      </DropdownMenuItem>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-zinc-800 bg-zinc-900 text-zinc-300">
          {!data ? (
            <div className="py-10 text-center">جارٍ التحميل…</div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{data.name}</DialogTitle>
                <DialogDescription className="mb-4">
                  {data.email}
                </DialogDescription>
              </DialogHeader>

              {/* قائمة الإجابات */}
              <ul className="space-y-2 max-h-80 overflow-y-auto overflow-x-hidden pr-2 no-scrollbar" dir="rtl">
                {Object.entries(data.answers).map(([key, value]) => {
                  if (value === "" || value === null) return null; // تجاهل الفارغ
                  const labelAr = FORM_LABELS[key] ?? key; // fallback
                  const pretty =
                    typeof value === "boolean"
                      ? value
                        ? "نعم"
                        : "لا"
                      : String(value);

                  return (
                    <li key={key} className="break-words whitespace-pre-line">
                      <span className="font-medium text-purple-300">
                        {labelAr}:{" "}
                      </span>
                      <span className="text-zinc-200 break-words whitespace-pre-line">{pretty}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
