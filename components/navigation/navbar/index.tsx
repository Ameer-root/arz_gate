import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "./MobileNavigation";
import { currentUser } from "@clerk/nextjs/server";
import { Sparkles } from "lucide-react";
import { Role } from "@/lib/types";

type Props = { role: Role | null };
const Navbar = async({ role }: Props) => {
   const user = await currentUser();
  return (
    <nav className="flex justify-between items-center bg-zinc-900/20 backdrop-blur-sm fixed z-50 text-zinc-300 w-full gap-5 p-6 sm:px-12" dir="rtl"> 
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/arz-logo-original.png"
          width={24}
          height={24}
          alt="Arab Zone Logo"
        />

        <p className="max-sm:hidden text-xl">
          بوابة&nbsp;<span className="-rotate-4 font-bold inline-block bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent leading-relaxed animated-arz-text">عرب زون</span>
        </p>
      </Link>

<div className="flex items-center justify-center gap-x-2"> {/* أضفنا gap-x-2 للمسافة بين العناصر */}
  مرحباً،

  <div className="relative w-8 h-8 rounded-full overflow-hidden"> {/* غيرنا w-10 h-10 إلى w-8 h-8 لجعل الصورة أصغر قليلاً (32px) */}
    <Image
      src={user!.imageUrl}
      alt="صورة المستخدم"
      width={80} // هذه تحدد الأبعاد الأصلية للصورة لـ Next.js، ولا تؤثر على حجم العرض بوجود w-full h-full في الكلاس
      height={80} // نفس الشيء هنا
      className="absolute inset-0 w-full h-full object-cover rounded-full"
    />
    <div
      className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-purple-800 opacity-100 mix-blend-color"
    ></div>
  </div>
  <strong className="inline-block max-md:max-w-[150px] max-lg:max-w-[300px] max-w-[300px] max-sm:max-w-[150px] truncate">{user!.fullName ?? user!.username}</strong>
  <Sparkles className="animate-shake text-purple-500 h-5 w-5" />
</div>

      <MobileNavigation role={role} />
    </nav>
  );
};

export default Navbar;