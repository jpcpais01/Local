export interface CategoryOption {
  id: string;
  label: string;
}

export function CategoryTabs({
  options,
  value,
  onChange,
  colorVar = "--color-brand",
}: {
  options: CategoryOption[];
  value: string;
  onChange: (id: string) => void;
  colorVar?: string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors"
            style={
              active
                ? {
                    backgroundColor: `var(${colorVar})`,
                    borderColor: `var(${colorVar})`,
                    color: "white",
                  }
                : { borderColor: "var(--border)", color: "var(--fg-muted)" }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
