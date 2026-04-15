export default function StreakCounter({ count, label }: { count: number; label: string }) {
  return (
    <div className="card-bold w-full text-center">
      <div className="text-[48px] mb-2 leading-none">🎬</div>
      <div className="text-[36px] font-black leading-none mb-1">{count}</div>
      <div className="label-bold">{label}</div>
    </div>
  );
}
