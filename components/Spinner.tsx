import Image from "next/image";
import React from "react";

export function Spinner() {
  return (
    <span
      className="h-6 w-6 rounded-full border-2 border-fuchsia-400 border-t-transparent animate-spin flex-shrink-0"
      aria-label="جارٍ التحميل"
    >
      <Image
        src="/arz-logo.png"
        alt="logo"
        width={24}
        height={24}
        priority
        className="animate-shake flex-shrink-0"
      />
    </span>
  );
}
