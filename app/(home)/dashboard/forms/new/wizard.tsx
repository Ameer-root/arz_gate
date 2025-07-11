/* app/(admin)/dashboard/forms/new/wizard.tsx */
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { z } from "zod";

import FieldDialog from "./field-dialog";
import type { FieldSchema } from "@/lib/types";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FormWizard() {
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [preview, setPreview] = useState(false);

  /* ---------------- مخطط Zod ديناميكي ---------------- */
  const schema = z.object(
    Object.fromEntries(
      fields.map((f) => {
        /* غير إلزامي */
        if (!f.required) {
          if (f.type === "email")
            return [
              f.name,
              z
                .union([z.literal(""), z.string().email("بريد غير صالح")])
                .optional(),
            ];
          if (f.type === "checkbox")
            return [
              f.name,
              z
                .union([z.string(), z.array(z.string())])
                .transform((v) =>
                  v === undefined ? [] : Array.isArray(v) ? v : [v],
                )
                .optional(),
            ];
          return [f.name, z.string().optional()];
        }

        /* إلزامي */
        if (f.type === "checkbox")
          return [
            f.name,
            z
              .union([z.string(), z.array(z.string())])
              .transform((v) =>
                v === undefined ? [] : Array.isArray(v) ? v : [v],
              )
              .refine(
                (arr) => arr.length >= 1,
                "اختر خيارًا واحدًا على الأقل",
              ),
          ];

        if (f.type === "email")
          return [f.name, z.string().email("بريد غير صالح")];

        return [f.name, z.string().min(1, "مطلوب")];
      }),
    ) as Record<string, any>,
  );

  type PreviewData = z.infer<typeof schema>;

  const form = useForm<PreviewData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  /* ---------------- وظائف مساعدة ---------------- */
  const removeField = (id: string) =>
    setFields((p) => p.filter((f) => f.id !== id));

  const addField = (f: FieldSchema) => setFields((p) => [...p, f]);

  const save = () => {
    toast.success("تم الحفظ (صوري) — راجع الـ Console");
    console.table(fields);
  };

  /* ---------------- مكوّن خطأ ---------------- */
  const Error = ({ name }: { name: string }) =>
    form.formState.errors[name] ? (
      <p className="mt-1 text-xs text-red-400">
        {form.formState.errors[name]?.message as string}
      </p>
    ) : null;

  /* ---------------- عنصر تحكم ---------------- */
  const Control = ({ f }: { f: FieldSchema }) => {
    const label = (
      <label className="mb-1 block text-sm text-white">
        {f.label}
        {f.required && <span className="text-red-500">*</span>}
      </label>
    );

    switch (f.type) {
      case "textarea":
        return (
          <div>
            {label}
            <Textarea
              {...form.register(f.name)}
              placeholder={f.placeholder || f.label}
              className="bg-zinc-800"
            />
            <Error name={f.name} />
          </div>
        );

      case "select":
        return (
          <div>
            {label}
            <select
              {...form.register(f.name)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 text-white"
            >
              <option value="">اختر...</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Error name={f.name} />
          </div>
        );

      case "checkbox":
        return (
          <div>
            {label}
            <div className="space-y-2">
              {f.options?.map((o) => (
                <Controller
                  key={o.value}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => {
                    const current = Array.isArray(field.value)
                      ? field.value
                      : [];
                    const checked = current.includes(o.value);
                    const toggle = (v: boolean) => {
                      field.onChange(
                        v
                          ? [...current, o.value]
                          : current.filter((val) => val !== o.value),
                      );
                    };
                    return (
                      <label className="flex items-center gap-2 text-white">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={toggle}
                          value={o.value}
                          className="
                            h-4 w-4 rounded border border-purple-600
                            data-[state=checked]:bg-purple-600
                            focus-visible:ring-2 focus-visible:ring-purple-500
                          "
                        />
                        {o.label}
                      </label>
                    );
                  }}
                />
              ))}
            </div>
            <Error name={f.name} />
          </div>
        );

      default: // text | email
        return (
          <div>
            {label}
            <Input
              {...form.register(f.name)}
              type={f.type === "email" ? "email" : "text"}
              placeholder={f.placeholder || f.label}
              className="bg-zinc-800"
            />
            <Error name={f.name} />
          </div>
        );
    }
  };

  /* ---------------- JSX ---------------- */
  return (
    <div className="space-y-8 p-6">
      {/* ===== قائمة الحقول ===== */}
      {!preview && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              الحقول ({fields.length})
            </h3>
            <FieldDialog
              existingNames={fields.map((f) => f.name)}
              onAdd={addField}
            />
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-zinc-400">لم يُضف أي حقل بعد.</p>
          ) : (
            <ul className="space-y-2">
              {fields.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded border border-zinc-700 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{f.label}</span>
                    <Badge variant="secondary">{f.type}</Badge>
                    {f.required && <span className="text-red-500">*</span>}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeField(f.id)}
                  >
                    <Trash2 className="h-4 w-4 text-zinc-400" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-end pt-4">
            <Button
              disabled={fields.length === 0}
              onClick={() => setPreview(true)}
            >
              معاينة
            </Button>
          </div>
        </>
      )}

      {/* ===== المعاينة ===== */}
      {preview && (
        <>
          <h3 className="text-lg font-semibold text-white">معاينة</h3>

          <form
            onSubmit={form.handleSubmit(
              () => toast.success("نموذج صالح 🎉"),
              () => toast.error("تحقق فاشل — راجع الحقول"),
            )}
            className="grid gap-4"
          >
            {fields.map((f) => (
              <Control key={f.id} f={f} />
            ))}

            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500"
            >
              تجربة الإرسال
            </Button>
          </form>

          <div className="flex justify-between pt-4">
            <Button variant="secondary" onClick={() => setPreview(false)}>
              عودة للتعديل
            </Button>
            <Button onClick={save}>حفظ (Console)</Button>
          </div>
        </>
      )}
    </div>
  );
}
