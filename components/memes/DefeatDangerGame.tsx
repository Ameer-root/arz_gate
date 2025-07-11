'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

/* ───── أدوات وأنواع ───── */
type Ball = { x: number; y: number; vx: number; vy: number };
const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(v, mx));
const hit = (y: number, py: number, h: number) => y > py && y < py + h;
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/* ───── ثوابت ───── */
const P_H = 90, P_W = 10, R = 10;
const RATIO = 16 / 10;
const MAX_G = 3;
const CHEAT_MS = 10_000;
const EXTRA_MS = 1_500;
const MAX_B = 4;
const WIN = ['timeout'];

/* ───── المكوّن ───── */
export default function DefeatDangerGame() {
  const [phase, setPhase] = useState<'play' | 'lost' | 'won'>('play');
  const [cmd, setCmd] = useState('');
  const [gDanger, setGDanger] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [alert, setAlert] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedAt = useRef(Date.now());
  const [sz, setSz] = useState({ w: 0, h: 0 });

  const G = useRef({
    balls: [] as Ball[],
    playerY: 0,
    dangerY: 0,
    goals: 0,
    cheating: false,
  });

  /* قياس حجم اللوحة */
  useEffect(() => {
    const upd = () => {
      if (!boardRef.current) return;
      const w = boardRef.current.clientWidth;     // ≤700px بسبب max-w
      setSz({ w, h: Math.round(w / RATIO) });
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  /* تهيئة */
  const init = useCallback(() => {
    const H = Math.round(sz.w / RATIO) || 500;
    G.current = {
      balls: [{ x: 350, y: H / 2, vx: -5, vy: 5 }],
      playerY: H / 2 - P_H / 2,
      dangerY: H / 2 - P_H / 2,
      goals: 0,
      cheating: false,
    };
    setCmd('');
    setGDanger(0);
    setElapsed(0);
    setAlert(false);
    startedAt.current = Date.now();
    setPhase('play');
  }, [sz.w]);

  useEffect(() => { if (sz.w) init(); }, [sz.w, init]);

  /* عدّاد الوقت */
  useEffect(() => {
    if (phase !== 'play') return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  /* حلقة اللعبة */
  useEffect(() => {
    if (phase !== 'play' || sz.w === 0) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 700;                          // ثابت داخلي (يقلّص ارتفاعًا أيضاً)
    canvas.height = 700 / RATIO;

    /* مؤقتات الغش */
    const cT = setTimeout(() => { G.current.cheating = true; setAlert(true); setTimeout(() => setAlert(false), 2500); }, CHEAT_MS);
    let exT: NodeJS.Timeout | null = null;

    const spawn = () => {
      exT = setInterval(() => {
        const g = G.current;
        if (!g.cheating || g.balls.length >= MAX_B) return;
        g.balls.push({ x: canvas.width / 2, y: Math.random() * canvas.height, vx: -6, vy: Math.random() > 0.5 ? 6 : -6 });
      }, EXTRA_MS);
    };

    const center = (b: Ball) => { b.x = canvas.width / 2; b.y = canvas.height / 2; b.vx = -5; b.vy = Math.random() > 0.5 ? 5 : -5; };

    let id = 0;
    const draw = () => {
      const g = G.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(167,139,250,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(167,139,250,0.25)';
      for (let i = 0; i < canvas.height; i += 18) ctx.fillRect(canvas.width / 2 - 1, i, 2, 9);
      ctx.fillStyle = '#fafafa';
      g.balls.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#a78bfa';
      ctx.fillRect(0, g.playerY, P_W, P_H);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(canvas.width - P_W, g.dangerY, P_W, P_H);
    };

    const loop = () => {
      const g = G.current;
      const H = canvas.height;

      const target = g.balls.reduce((s, b) => s + b.y, 0) / g.balls.length;
      g.dangerY = clamp(g.dangerY + (target - (g.dangerY + P_H / 2)) * (g.cheating ? 1.3 : 0.8), 0, H - P_H);

      g.balls.forEach(b => {
        const sp = g.cheating ? 1.4 : 1;
        b.x += b.vx * sp;
        b.y += b.vy * sp;
        if (b.y - R < 0 || b.y + R > H) b.vy *= -1;
        if (b.x - R < P_W && hit(b.y, g.playerY, P_H)) b.vx *= -1;
        if (b.x + R > canvas.width - P_W && hit(b.y, g.dangerY, P_H)) b.vx *= -1;
        if (b.x - R < 0) { g.goals += 1; setGDanger(g.goals); center(b); }
        else if (b.x + R > canvas.width) center(b);
      });

      if (g.goals >= MAX_G) { setPhase('lost'); return; }

      draw();
      id = requestAnimationFrame(loop);
    };

    const move = (y: number) => { G.current.playerY = clamp(y - P_H / 2, 0, canvas.height - P_H); };
    const mouse = (e: MouseEvent) => move(e.offsetY);
    const touch = (e: TouchEvent) => { const r = canvas.getBoundingClientRect(); move(e.touches[0].clientY - r.top); };

    canvas.addEventListener('mousemove', mouse);
    canvas.addEventListener('touchmove', touch, { passive: true });
    spawn();
    id = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(cT);
      if (exT) clearInterval(exT);
      canvas.removeEventListener('mousemove', mouse);
      canvas.removeEventListener('touchmove', touch);
    };
  }, [phase, sz.w]);

  /* تنفيذ الأمر السري */
  const fire = () => { if (WIN.includes(cmd.trim().toLowerCase())) setPhase('won'); };

  /* ───── JSX ───── */
  return (
    <Card className="w-full border-zinc-800 bg-zinc-900/40 backdrop-blur-[2px] shadow-md">
      {/* العنوان ↝ يظهر فقط في حالة اللعب */}
      {phase === 'play' && (
        <CardHeader className="pt-4 pb-1">
           <CardTitle className="text-center text-3xl font-bold text-purple-400">اهزم دنجر</CardTitle>
        </CardHeader>
      )}

      <CardContent className="flex flex-col items-center gap-6">

        {/* شاشة اللعب */}
        {phase === 'play' && (
          <>
            <DiscordMsg text="العب ووريني قوتك يا ملك المنغلة!" />

            {/* لوحة اللعب */}
            <div ref={boardRef} className="relative w-full max-w-[700px] mx-auto rounded-md">
              {/* HUD */}
              <span className="absolute top-2 right-2 text-sm sm:text-base font-mono text-purple-200">
                Danger {gDanger}/{MAX_G}
              </span>
              <span className="absolute top-2 left-2 text-sm sm:text-base font-mono text-purple-200">
                {fmt(elapsed)}
              </span>

              {/* تنبيه الغش */}
              {alert && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="animate-pulse text-2xl sm:text-3xl font-bold text-red-500 bg-black/50 px-4 py-1 rounded-md">
                    ⚠️ دنجر بدأ الغش!
                  </span>
                </div>
              )}

              <canvas ref={canvasRef} className="w-full h-full rounded-md" />
            </div>

            {/* إدخال الأمر */}
            <div className="flex flex-col sm:flex-row w-full max-w-lg items-stretch gap-2 rtl:space-x-reverse">
              <Input
                placeholder="timeout"
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fire()}
                className="flex-grow bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700 ring-offset-black focus-visible:ring-primary"
              />
              <Button className="cursor-pointer sm:min-w-[120px]" onClick={fire}>Submit</Button>
            </div>

            <p className="text-xs sm:text-sm text-zinc-500">تلميح: عاقب دنجر الغشاش</p>
          </>
        )}

        {/* خسارة */}
 {phase === 'lost' && (
         <>
           <DiscordMsg text="عطني اونر وبخليك تفوز." />
           <p className="text-3xl font-extrabold text-red-400">⚽ دنجر انتصر عليك بسهولة</p>
           <Button onClick={init} className="gap-1 cursor-pointer">
            <RotateCcw className="h-4 w-4" /> حاول مجددًا
           </Button>
         </>
       )}

        {/* فوز */}
        {phase === 'won' && (
          <div className="flex flex-col items-center gap-4">
            <JailAvatar />
            <p className="text-3xl font-extrabold text-green-400">عاقبتَ دنجر!</p>
            <Button onClick={init} className="gap-1 cursor-pointer">
              <RotateCcw className="h-4 w-4" /> إلعب مرة أخرى
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ───── رسائل مساعدة ───── */
function DiscordMsg({ text }: { text: string }) {
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date());
  return (
    <div dir="ltr" className="flex w-full max-w-lg items-start gap-3 rounded-md bg-zinc-950 p-3">
      <Image src="/danger-avatar.jpg" alt="Danger avatar" width={40} height={40} className="rounded-full" />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-indigo-400 text-xs sm:text-sm md:text-base">[ARZ] [SAF] Danger_man254</span>
          <span className="text-[10px] text-zinc-500">{time}</span>
        </div>
        <span className="text-[13px] sm:text-sm text-zinc-100">{text}</span>
      </div>
    </div>
  );
}

function JailAvatar() {
  return (
<div className="relative w-[140px] h-[140px] rounded-full overflow-hidden">
  {/* صورة دنجر */}
  <Image
    src="/danger-avatar.jpg"
    alt="Danger avatar"
    fill   /* ← يحتل كل الإطار */
    className="object-cover grayscale opacity-80"
  />

  {/* قضبان رأسية – ستُقص داخل الدائرة */}
  {Array.from({ length: 5 }).map((_, i) => (
    <div
      key={i}
      className="absolute inset-y-0"
      style={{
        left: `${(i + 0.5) * 20}%`,      // وزّعها بالتساوي
        width: '4px',
        background: 'rgba(0,0,0,0.4)',
        borderLeft: '1px solid rgba(113,113,122,0.6)',  // zinc-700/60
      }}
    />
  ))}
</div>

  );
}
