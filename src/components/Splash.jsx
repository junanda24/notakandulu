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
      style={{ background: "#1c1917" }}
    >
      <img
        src="/logo.jpg"
        alt="Logo TagihkanDulu"
        className="h-28 w-28 rounded-3xl object-cover shadow-2xl"
        style={{ animation: "splash-pop 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
      />
      <h1 className="mt-8 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        {NAME.split("").map((ch, i) => (
          <span key={i} className="splash-letter" style={{ animationDelay: `${0.35 + i * 0.045}s` }}>{ch}</span>
        ))}
      </h1>
      <p className="splash-letter mt-4 px-6 text-center text-sm sm:text-[15px] text-white/70" style={{ animationDelay: "0.95s" }}>
        Buat invoice gratis, tanpa iklan dan login itu nyata 🔥
      </p>
      <div className="mt-10 h-1 w-52 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full rounded-full bg-teal-600" style={{ animation: "splash-bar 1.5s ease-out 0.3s both" }} />
      </div>
    </div>
  );
}
