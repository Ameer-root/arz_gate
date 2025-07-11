// app/(home)/dashboard/data-table.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Role } from "@/lib/types";
import { createColumns } from "./columns";
import type { Requests } from "./columns";

interface DataTableProps {
  role: Role;        // الدور القادم من الخادم
  data: Requests[];
  page: number;
  total: number;
  perPage?: number;
}

export function DataTable({
  role,
  data,
  page,
  total,
  perPage = 15,
}: DataTableProps) {
  const router = useRouter();

  /* توليد الأعمدة بناءً على الدور (على العميل) */
  const columns = React.useMemo<ColumnDef<Requests>[]>(
    () => createColumns(role),
    [role],
  );

  /* TanStack Table states */
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      name: true,
      email: true,
      status: true,
      actions: true,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // لا يضر بوجود pagination خادم
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  /* إجمالي الصفحات */
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  /* تغيير الصفحة */
  const go = (p: number) => router.push(`?page=${p}`, { scroll: false });

  return (
    <div className="backdrop-blur-[2px] max-sm:grid">
      {/* شريط أدوات */}
      <div className="flex py-4">
        <Input
          placeholder="فلترة الإيميل..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm border-zinc-800 bg-zinc-900/60 ml-4 text-zinc-300"
        />

        {/* إظهار/إخفاء الأعمدة */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-zinc-300">
              الأعمدة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-300">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide() && c.id !== "actions")
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => {
                    if (!value) {
                      const stillVisible = table
                        .getAllColumns()
                        .filter(
                          (col) =>
                            col.getCanHide() &&
                            col.id !== "actions" &&
                            col.getIsVisible() &&
                            col.id !== column.id,
                        );
                      if (stillVisible.length === 0) return;
                    }
                    column.toggleVisibility(!!value);
                  }}
                  className="capitalize"
                >
                  {column.id === "name"
                    ? "الاسم"
                    : column.id === "email"
                    ? "البريد الإلكتروني"
                    : column.id === "status"
                    ? "الحالة"
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/60">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-zinc-300"
                >
                  لا توجد بيانات.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* التصفح بين الصفحات */}
      <div className="flex items-center justify-end gap-2 py-4">
        <span className="text-muted-foreground text-sm">
          صفحة {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="bg-zinc-300"
        >
          السابق
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="bg-zinc-300"
        >
          التالي
        </Button>
      </div>

      {/* زر إنشاء نموذج */}
      <Button
        size="sm"
        className="bg-purple-600 text-zinc-100 hover:bg-purple-500 w-fit"
        asChild
      >
        <Link href="/dashboard/forms/new">إنشاء نموذج</Link>
      </Button>
    </div>
  );
}
