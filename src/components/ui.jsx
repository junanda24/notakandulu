// Primitif UI netral minimalis (gaya visual didefinisikan di index.css).

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
            <span className="rounded-md bg-indigo-600 px-2 py-0.5 font-mono2 text-[10px] font-bold text-white dark:bg-indigo-500">
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
    ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:border-indigo-500 dark:hover:bg-indigo-400"
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
