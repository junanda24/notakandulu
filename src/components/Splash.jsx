// Splash screen — intro sinematik pakai GSAP.
import { useEffect, useRef } from "react";
import gsap from "gsap";

const NAME = "TagihkanDulu";
const TAGLINE = "Buat invoice gratis, tanpa iklan dan login itu nyata \u{1F525}";

const DOTS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 61) % 100}%`,
  size: 3 + ((i * 7) % 5),
  teal: i % 3 === 0,
}));

export default function Splash({ onDone }) {
  const root = useRef(null);
  const num = useRef(null);
  const tl = useRef(null);
  const finished = useRef(false);

  const safeDone = () => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  };

  const skip = () => {
    if (finished.current) return;
    tl.current?.kill();
    gsap.to(root.current, { opacity: 0, duration: 0.22, ease: "power1.out", onComplete: safeDone });
  };

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        const t = setTimeout(safeDone, 400);
        return () => clearTimeout(t);
      }
      // Partikel ambient: melayang ke atas terus-menerus
      gsap.utils.toArray(".sp-dot").forEach((d) => {
        gsap.fromTo(
          d,
          { y: 40, opacity: 0 },
          {
            y: -window.innerHeight * 0.55,
            x: gsap.utils.random(-36, 36),
            opacity: gsap.utils.random(0.25, 0.7),
            duration: gsap.utils.random(2.4, 4),
            repeat: -1,
            delay: gsap.utils.random(0, 2.5),
            ease: "sine.in",
            onRepeat() {
              gsap.set(d, { y: 40, opacity: 0 });
            },
          }
        );
      });

      const counter = { v: 0 };
      tl.current = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: safeDone });
      tl.current
        .fromTo(".sp-glow", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.4 }, 0)
        .fromTo(
          ".sp-logo",
          { scale: 0, rotation: -14 },
          { scale: 1, rotation: 0, duration: 1.05, ease: "elastic.out(1, 0.42)" },
          0.15
        )
        .fromTo(".sp-ring", { scale: 0.55, opacity: 0.9 }, { scale: 1.7, opacity: 0, duration: 1, ease: "power2.out" }, 0.6)
        .fromTo(
          ".sp-letter",
          { y: 52, opacity: 0, rotationX: -75 },
          { y: 0, opacity: 1, rotationX: 0, duration: 0.65, stagger: 0.042, ease: "back.out(1.7)" },
          0.55
        )
        .fromTo(".sp-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power3.inOut" }, 1.2)
        .fromTo(".sp-tag", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.32)
        .fromTo(".sp-bar", { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: "power2.inOut" }, 1.25)
        .to(counter, {
          v: 100,
          duration: 1.05,
          ease: "power2.inOut",
          onUpdate() {
            if (num.current) num.current.textContent = `${Math.round(counter.v)}%`;
          },
        }, 1.25)
        // Exit: konten naik + fade, lalu overlay ikut fade
        .to(".sp-inner", { y: -42, opacity: 0, duration: 0.45, ease: "power2.in" }, 2.55)
        .to(root.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 2.68);
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      onClick={skip}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: "#1c1917" }}
    >
      {/* Glow ambient */}
      <div
        className="sp-glow pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(13,148,136,0.28) 0%, rgba(13,148,136,0) 62%)" }}
      />
      {/* Partikel */}
      {DOTS.map((d) => (
        <span
          key={d.id}
          className="sp-dot pointer-events-none absolute bottom-0 rounded-full"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.teal ? "#2dd4bf" : "#ffffff",
          }}
        />
      ))}

      <div className="sp-inner relative flex flex-col items-center" style={{ perspective: 600 }}>
        <div className="relative">
          <span className="sp-ring pointer-events-none absolute inset-0 rounded-3xl border-2 border-teal-400" />
          <img
            src="/logo.jpg"
            alt="Logo TagihkanDulu"
            className="sp-logo h-28 w-28 rounded-3xl object-cover shadow-2xl"
          />
        </div>
        <h1 className="mt-8 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {NAME.split("").map((ch, i) => (
            <span key={i} className="sp-letter inline-block" style={{ transformOrigin: "50% 100%" }}>
              {ch}
            </span>
          ))}
        </h1>
        <div className="sp-rule mt-5 h-[3px] w-40 rounded-full bg-teal-500" style={{ transformOrigin: "left center" }} />
        <p className="sp-tag mt-4 px-6 text-center text-sm sm:text-[15px] text-white/70">{TAGLINE}</p>
        <div className="mt-10 flex items-center gap-3">
          <div className="h-1 w-52 overflow-hidden rounded-full bg-white/15">
            <div className="sp-bar h-full rounded-full bg-teal-500" style={{ transformOrigin: "left center" }} />
          </div>
          <span ref={num} className="font-mono2 text-xs font-bold text-teal-300 tabular-nums w-10 text-right">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
