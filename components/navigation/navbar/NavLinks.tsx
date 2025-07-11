// /components/navigation/navbar/NavLinks.tsx
"use client";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/lib/constants";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = { role: Role | null; isMobileNav?: boolean };

const NavLinks = ({ role, isMobileNav = false }: Props) => {
  const pathname = usePathname();

//   const userId = 1;

  return (
    <>
      {sidebarLinks.filter(link => !link.hideFor?.includes(role ?? "normal")).map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        // if (item.route === "/profile") {
        //   if (userId) item.route = `${item.route}/${userId}`;
        //   else return null;
        // }

        const LinkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              isActive
                ? "bg-gradient-to-r from-purple-800 to-fuchsia-800 text-zinc-300"
                : "text-zinc-300",
              "flex items-center justify-start gap-4 p-4 "
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              // className={cn({ "invert": !isActive })}
            />
            <p
              className={cn(
                isActive ? "font-bold" : "font-medium",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {item.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;