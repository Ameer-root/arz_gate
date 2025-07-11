'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ROUTES from '@/lib/constants';
// استيراد مكونات البطاقة من shadcn/ui
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function RedirectWithCountdown() {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) {
      router.push(ROUTES.RULES);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    // حاوية خارجية لتوسيط البطاقة في الصفحة وإعطائها مساحة
    <div className="container flex items-center justify-center py-24">
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/40 py-10 shadow-md backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="animate-pulse text-center text-3xl font-bold text-purple-400">
            🚨 اووووف يالهكر 🚨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4 flex flex-col items-center gap-4 text-center">
            <p className="text-xl text-zinc-300">أنت مسجل دخولك بالفعل!</p>
            <p className="text-lg text-zinc-400">
              سيتم توجيهك إلى صفحة القوانين خلال{' '}
              <span className="tabular-nums text-2xl font-bold text-amber-400">
                {countdown}
              </span>
              ...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}