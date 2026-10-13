// Primitif UI netral minimalis (gaya visual didefinisikan di index.css).
import { useEffect, useRef } from "react";
import gsap from "gsap";

// Collapse/expand halus pakai GSAP — pengganti {open && <div>} yang pop instan.
export function Collapse({ open, children, className = "", duration = 0.38 }) {
  const wrap = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!mounted.current) {
      mounted.current = true;
      el.style.display = open ? "" : "none";
      return;
    }
    gsap.killTweensOf(el);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = open ? "" : "none";
      gsap.set(el, { height: "auto", opacity: 1 });
      return;
    }
    if (open) {
      el.style.display = "";
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration,
          ease: "power3.out",
          onComplete: () => { el.style.height = "auto"; },
        }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: duration * 0.75,
        ease: "power3.in",
        onComplete: () => { el.style.display = "none"; },
      });
    }
  }, [open, duration]);

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`} style={{ display: open ? "" : "none" }}>
      {children}
    </div>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="brutal-label">{label}</label>
      {children}
    </div>
  );
}

export function TextInput(props) {
  return <input {...props} className={`brutal-input ${props.className || ""}`} />;
}

export function TextArea(props) {
  return <textarea {...props} className={`brutal-input ${props.className || ""}`} />;
}

export function Select(props) {
  return <select {...props} className={`brutal-input ${props.className || ""}`} />;
}

export function Card({ title, sticker, children, className = "" }) {
  return (
    <section className={`brutal p-4 sm:p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-tight">{title}</h2>
          {sticker && (
            <span className="rounded-md bg-teal-600 px-2 py-0.5 font-mono2 text-[10px] font-bold text-white dark:bg-teal-500">
              {sticker}
            </span>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function Btn({ children, onClick, color = "", primary = false, className = "", type = "button", disabled }) {
  const base = primary
    ? "bg-teal-600 border-teal-600 text-white hover:bg-teal-500 dark:bg-teal-500 dark:border-teal-500 dark:hover:bg-teal-400"
    : color || "";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`brutal-btn px-4 py-2.5 text-sm font-semibold ${base} ${className}`}
    >
      {children}
    </button>
  );
}
