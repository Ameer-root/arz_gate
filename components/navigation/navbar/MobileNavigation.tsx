import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/lib/constants";
import NavLinks from "./NavLinks";
import { getUserRole } from "@/app/actions/getUserRole";
import { Role } from "@/lib/types";
type Props = { role: Role | null };
const MobileNavigation = async ({ role }: Props) => {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-zinc-900/20 backdrop-blur-xl !border-none focus:outline-none focus:ring-0"
        dir="rtl"
      >
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-1 p-6">
          <Image
            src="/arz-logo-original.png"
            width={48}
            height={48}
            alt="Logo"
          />

          <p className="text-zinc-300 text-xl">
          بوابة&nbsp;<span className="-rotate-4 font-bold inline-block bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent leading-relaxed animated-arz-text">عرب زون</span>
        </p>
        </Link>

        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav role={role} />
            </section>
          </SheetClose>

              <div className="font-semibold flex items-center justify-center text-xs overflow-y-clip text-zinc-300 gap-1" dir="ltr">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>in</span>
              <Image
                src="/libya.svg"
                alt="Libya Flag"
                width={18}
                height={18}
              />
            </div>

            {/* <SheetClose asChild>
              <Link href={ROUTES.SIGN_IN}>
                <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                  <span className="primary-text-gradient">Log In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href={ROUTES.SIGN_UP}>
                <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                  Sign Up
                </Button>
              </Link>
            </SheetClose> */}
          </div>
  
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;