import type { Subject } from "@/types";
import { cn } from "@/lib/utils";

interface SubjectGridProps {
  subjects: Subject[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function SubjectGrid({ subjects, activeId, onSelect }: SubjectGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-up delay-200">
      {subjects.map((subject, i) => {
        const isActive = subject.id === activeId;
        return (
          <button
            key={subject.id}
            onClick={() => onSelect(subject.id)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={cn(
              "card text-left p-4 cursor-pointer transition-all duration-150 animate-fade-up",
              "hover:border-ceara-verde/30 hover:shadow-md active:scale-[0.98]",
              isActive && "border-2 border-ceara-verde shadow-md"
            )}
          >
            <span className="text-2xl block mb-2">{subject.icon}</span>
            <p className="font-semibold text-sm text-gray-800">{subject.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {subject.topics.length} tópicos
            </p>

            {/* Barra de progresso */}
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-ceara-verde rounded-full transition-all duration-500"
                style={{ width: `${subject.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {subject.progress}% concluído
            </p>
          </button>
        );
      })}
    </div>
  );
}
