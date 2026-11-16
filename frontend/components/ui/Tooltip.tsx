export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="relative inline-flex" title={label}>
      {children}
      <span className="sr-only">{label}</span>
    </span>
  );
}
