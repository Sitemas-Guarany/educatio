interface StatsBarProps {
  points: number;
  done: number;
  streak: number;
}

const stats = [
  { key: "done",   icon: "✅", label: "Atividades" },
  { key: "points", icon: "⭐", label: "Pontos" },
  { key: "streak", icon: "🔥", label: "Dias seguidos" },
] as const;

export default function StatsBar({ points, done, streak }: StatsBarProps) {
  const values = { done, points, streak };

  return (
    <div className="grid grid-cols-3 gap-3 animate-fade-up">
      {stats.map(({ key, icon, label }) => (
        <div
          key={key}
          className="card flex flex-col items-center justify-center p-3 text-center"
        >
          <span className="text-xl mb-1">{icon}</span>
          <span className="text-xl font-bold text-ceara-verde">{values[key]}</span>
          <span className="text-[11px] text-gray-400 mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );
}
