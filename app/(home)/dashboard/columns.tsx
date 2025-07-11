// app/(home)/dashboard/columns.tsx
"use client";

import { useTransition } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FormViewer } from "./FormViewer";
import { updateApplicationStatus } from "@/app/actions/updateApplicationStatus";
import type { Role } from "@/lib/types"; // يجب أن يحتوي على القيم: normal | special | moderator | admin | superadmin

/* صفّ واحد في الجدول */
export type Requests = {
  id: string;       // applicationId
  userId: string;   // معرّف المستخدم
  name: string;
  email: string;
  status: "معلّق" | "مقبول" | "مرفوض";
};

/**
 * تنشئ أعمدة الجدول بناءً على دور المستخدم
 * @param role الدور الحالي (يجب تمريره من الخادم)
 */
export function createColumns(role: Role): ColumnDef<Requests>[] {
  /* هل المستخدم لديه صلاحية تغيير الحالة؟ */
  const canEdit = role === "admin" || role === "superadmin";

  return [
    /* الاسم */
    {
      accessorKey: "name",
      header: () => <div className="text-white text-right">الاسم</div>,
      cell: ({ row }) => (
        <span className="text-white">{row.getValue("name")}</span>
      ),
    },

    /* البريد */
    {
      accessorKey: "email",
      header: () => (
        <div className="text-white text-right">البريد الإلكتروني</div>
      ),
      cell: ({ row }) => (
        <div className="text-right text-white">{row.getValue("email")}</div>
      ),
    },

    /* الحالة مع فرز */
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-right w-full text-white">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            الحالة
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const s = row.getValue("status") as Requests["status"];
        const color =
          s === "مقبول"
            ? "bg-green-500"
            : s === "معلّق"
            ? "bg-yellow-500"
            : "bg-red-500";
        return (
          <div className="text-right px-4">
            <span className={`rounded px-2 py-0.5 text-xs text-white ${color}`}>
              {s}
            </span>
          </div>
        );
      },
    },

    /* الإجراءات */
    {
      id: "actions",
      header: () => <div className="text-white text-right">الإجراء</div>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        const [pending, start] = useTransition();

        /* الأزرار المتاحة وفق الحالة الحالية */
        const choices: Requests["status"][] =
          item.status === "معلّق"
            ? ["مقبول", "مرفوض"]
            : item.status === "مرفوض"
            ? ["معلّق", "مقبول"]
            : ["معلّق", "مرفوض"];

        const handleChange = (newStatus: Requests["status"]) =>
          start(async () => {
            try {
              await updateApplicationStatus(item.id, newStatus);
              toast.success(`تم تحديث الطلب إلى «${newStatus}»`);
            } catch (err: any) {
              toast.error(err?.message ?? "حدث خطأ");
            }
          });

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-white">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-zinc-300 z-50">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>

              {/* نسخ UserID */}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.userId)}
              >
                نسخ&nbsp;User&nbsp;ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* زر العرض */}
              <FormViewer appId={item.id} />

              <DropdownMenuSeparator />

              {/* أزرار الحالة */}
              {choices.map((label) => (
                <DropdownMenuItem
                  key={label}
                  disabled={!canEdit || pending}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleChange(label);
                  }}
                >
                  {pending ? "..." : label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
