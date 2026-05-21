export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-9 h-9 rounded-full border-[3px] border-silver border-t-primary animate-spin" />
      {label && <p className="text-sub text-sm">{label}</p>}
    </div>
  );
}