import React from "react";
import NavLinks from "./navbar/NavLinks";
import ROUTES from "@/lib/constants";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { getUserRole } from "@/app/actions/getUserRole";
import { Role } from "@/lib/types";

type Props = { role: Role | null };

const LeftSidebar = ({ role }: Props) => {

  return (
    <section className="custom-scrollbar no-blur-neon bg-zinc-900/20 backdrop-blur-sm border-zinc-900 sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
      <NavLinks role={role} />   
      </div>

      {/* <div className="flex flex-col gap-3">
        <Button
          className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <Image
              src="/icons/account.svg"
              alt="Account"
              width={20}
              height={20}
              className="invert-colors lg:hidden"
            />
            <span className="primary-text-gradient max-lg:hidden">Log In</span>
          </Link>
        </Button>

        <Button
          className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_UP}>
            <Image
              src="/icons/sign-up.svg"
              alt="Account"
              width={20}
              height={20}
              className="invert-colors lg:hidden"
            />
            <span className="max-lg:hidden">Sign Up</span>
          </Link>
        </Button>
      </div> */}
    </section>
  );
};

export default LeftSidebar;