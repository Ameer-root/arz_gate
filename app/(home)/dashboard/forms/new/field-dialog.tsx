"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldZod } from "@/lib/validate";
import type { FieldForm } from "@/lib/validate";
import type { FieldSchema, FieldType } from "@/lib/types";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Props {
  existingNames: string[];          // لمنع التكرار
  onAdd(field: FieldSchema): void;
}

export default function FieldDialog({ existingNames, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [optionsStr, setOptionsStr] = useState("");

  /* RHF + Zod */
  const form = useForm<FieldForm>({
    resolver: zodResolver(FieldZod),
    defaultValues: { label: "", placeholder: "", type: "text", required: false },
    mode: "onChange",
  });
  const t = form.watch("type");

  /* تقسيم خيارات select/checkbox بواسطة ',' أو '،' */
  const splitOptions = (s: string) =>
    s
      .split(/[,\u060C]/)      // الفاصلة الإنكليزية والعربية
      .map((o) => o.trim())
      .filter(Boolean);

  function submit(data: FieldForm) {
    const slug = data.label.trim().toLowerCase().replace(/\s+/g, "_");

    /* منع التكرار */
    if (existingNames.includes(slug)) {
      toast.error("يوجد حقل آخر بالاسم نفسه");
      return;
    }

    /* بناء القاعدة */
    const base: FieldSchema = {
      id: nanoid(),
      name: slug,
      ...data,
    };

    /* خيارات لقائمتي select / checkbox */
    const field: FieldSchema =
      data.type === "select" || data.type === "checkbox"
        ? {
            ...base,
            options: splitOptions(optionsStr).map((o) => ({
              value: o.toLowerCase().replace(/\s+/g, "_"),
              label: o,
            })),
          }
        : base;

    /* تأكد من وجود ≥ 2 خيار */
    if (
      (field.type === "select" || field.type === "checkbox") &&
      (!field.options || field.options.length < 2)
    ) {
      toast.error("أدخل خيارين على الأقل");
      return;
    }

    onAdd(field);
    setOpen(false);
    form.reset();
    setOptionsStr("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-500">
          حقل جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-700">
        <DialogHeader>
          <DialogTitle>إضافة حقل</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="grid gap-4 py-4">
          {/* التسمية */}
          <div>
            <label className="mb-1 block text-sm">التسمية</label>
            <Input {...form.register("label")} className="bg-zinc-800" />
            {form.formState.errors.label && (
              <p className="mt-1 text-xs text-red-400">
                {form.formState.errors.label.message}
              </p>
            )}
          </div>

          {/* placeholder */}
          <div>
            <label className="mb-1 block text-sm">Placeholder (اختياري)</label>
            <Input {...form.register("placeholder")} className="bg-zinc-800" />
          </div>

          {/* النوع */}
          <div>
            <label className="mb-1 block text-sm">النوع</label>
            <Select
              value={t}
              onValueChange={(v) => form.setValue("type", v as FieldType)}
            >
              <SelectTrigger className="bg-zinc-800">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-white">
                <SelectItem value="text">نص</SelectItem>
                <SelectItem value="email">بريد</SelectItem>
                <SelectItem value="textarea">مساحة نصية</SelectItem>
                <SelectItem value="select">قائمة اختيار</SelectItem>
                <SelectItem value="checkbox">مجموعة مربعات</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* خيارات للقائمتين */}
          {(t === "select" || t === "checkbox") && (
            <div>
              <label className="mb-1 block text-sm">
                خيارات (افصل بينها بـ , أو ،)
              </label>
              <Input
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
                className="bg-zinc-800"
                placeholder="مثال: خيار1, خيار2, خيار3"
              />
            </div>
          )}

          {/* إلزامي؟ */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.watch("required")}
              onCheckedChange={(v) => form.setValue("required", v as boolean)}
              className="
                h-4 w-4 rounded border border-purple-600
                data-[state=checked]:bg-purple-600
                focus-visible:ring-2 focus-visible:ring-purple-500
              "
            />
            <span className="text-sm">حقل إلزامي</span>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="bg-purple-600 hover:bg-purple-500"
            >
              إضافة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
