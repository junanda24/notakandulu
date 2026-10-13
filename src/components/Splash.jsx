// Splash screen animasi saat web dibuka.
import { useEffect, useState } from "react";

const NAME = "TagihkanDulu";

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1900);
    const t2 = setTimeout(onDone, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  const skip = () => {
    setLeaving(true);
    setTimeout(onDone, 250);
  };
  return (
    <div
      onClick={skip}
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 cursor-pointer ${leaving ? "opacity-0" : "opacity-100"}`}
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)" }}
    >
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" style={{ top: -60, left: -60, animation: "splash-float 5s ease-in-out infinite" }} />
      <div className="absolute w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" style={{ bottom: -120, right: -80, animation: "splash-float 6.5s ease-in-out infinite reverse" }} />
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-indigo-700 text-4xl font-extrabold shadow-2xl"
        style={{ animation: "splash-pop 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        T
      </div>
      <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        {NAME.split("").map((ch, i) => (
          <span key={i} className="splash-letter" style={{ animationDelay: `${0.35 + i * 0.045}s` }}>{ch}</span>
        ))}
      </h1>
      <p className="splash-letter mt-3 px-6 text-center text-[13px] text-indigo-200" style={{ animationDelay: "0.95s" }}>
        Buat invoice gratis, tanpa iklan dan login itu nyata 🔥
      </p>
      <div className="mt-8 h-1 w-44 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full rounded-full bg-white" style={{ animation: "splash-bar 1.5s ease-out 0.3s both" }} />
      </div>
    </div>
  );
}
