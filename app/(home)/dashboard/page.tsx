// app/(home)/dashboard/page.tsx
import { getApplications } from "@/app/actions/getApplications";
import { DataTable }       from "./data-table";

import { getUserRole } from "@/app/actions/getUserRole";
import ROUTES from "@/lib/constants";
import { redirect } from "next/navigation";

interface Props {
  /*  searchParams الآن Promise  */
  searchParams: Promise<{ page?: string }>;
}

export default async function Dashboard({ searchParams }: Props) {

    /* ① تحقُّق الدور أولاً */
  const role = await getUserRole();          // "normal" | "special" | …

  if (!role || role === "normal" || role === "special") {
    redirect(ROUTES.RULES);                           // أو: redirect("/sign-in")
  }

  /* لازم await أولاً */
  const { page: pageParam } = await searchParams;

  const page = Number(pageParam ?? "1") || 1;   // 1-based
  const { data, total } = await getApplications(page);

  return (
    <section className="py-10">
      <DataTable
        role={role ?? "normal"}
        data={data}
        page={page}
        total={total}
        perPage={15}
      />
    </section>
  );
}
