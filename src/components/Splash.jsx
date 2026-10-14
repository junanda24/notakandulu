// Splash screen — intro sinematik pakai GSAP.
import { useEffect, useRef } from "react";
import gsap from "gsap";

const NAME = "TagihkanDulu";
const TAGLINE = "Buat invoice gratis, tanpa iklan dan login itu nyata \u{1F525}";

// Partikel dokumen 3 lapis kedalaman (depth of field):
// lapis 0 = jauh (besar + blur berat + redup, gerak lambat),
// lapis 1 = tengah, lapis 2 = depan (tajam + cerah, gerak cepat).
const DOCS = Array.from({ length: 18 }, (_, i) => {
  const layer = i % 3;
  return {
    id: i,
    left: `${(i * 53) % 100}%`,
    layer,
    emoji: i % 4 === 3 ? "🧾" : "📄",
    size: [48, 32, 20][layer] + ((i * 7) % 8),
    blur: [8, 3.5, 0][layer],
    opacity: [0.3, 0.5, 0.8][layer],
    duration: [6, 4.2, 2.8][layer],
  };
});

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
      // Partikel dokumen: melayang ke atas terus-menerus (kecepatan per lapis = parallax DOF)
      gsap.utils.toArray(".sp-doc").forEach((el, i) => {
        const cfg = DOCS[i % DOCS.length];
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: -window.innerHeight * 0.55,
            x: gsap.utils.random(-36, 36),
            opacity: cfg.opacity,
            duration: gsap.utils.random(cfg.duration * 0.85, cfg.duration * 1.15),
            repeat: -1,
            delay: gsap.utils.random(0, 2.5),
            ease: "sine.in",
            onRepeat() {
              gsap.set(el, { y: 40, opacity: 0 });
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
        .fromTo(".sp-tag", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.25)
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
      role="button"
      tabIndex={0}
      aria-label="Lewati intro"
      onClick={skip}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " " || e.key === "Escape") skip(); }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: "#1c1917" }}
    >
      {/* Glow ambient */}
      <div
        className="sp-glow pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(13,148,136,0.28) 0%, rgba(13,148,136,0) 62%)" }}
      />
      {/* Partikel dokumen + depth of field */}
      {DOCS.map((d) => (
        <span
          key={d.id}
          className="sp-doc pointer-events-none absolute bottom-0 select-none"
          style={{
            left: d.left,
            fontSize: d.size,
            filter: d.blur ? `blur(${d.blur}px)` : undefined,
            opacity: d.opacity,
            willChange: "transform, opacity",
          }}
        >
          {d.emoji}
        </span>
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
        <p className="sp-tag mt-5 px-6 text-center text-sm sm:text-[15px] text-white/70">{TAGLINE}</p>
        <div className="mt-8 flex items-center gap-3">
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
