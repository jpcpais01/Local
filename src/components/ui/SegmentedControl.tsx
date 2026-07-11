export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-surface-2 p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={
            value === opt.id
              ? { backgroundColor: "var(--surface)", color: "var(--fg)", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }
              : { color: "var(--fg-muted)" }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
