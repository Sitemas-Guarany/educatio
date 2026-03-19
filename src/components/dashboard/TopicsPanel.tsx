import type { Subject, TopicLevel } from "@/types";
import { getStatusLabel, getStatusColor, getStatusDot, getLevelLabel, getLevelIcon, getLevelColor } from "@/lib/utils";
import type { Serie } from "@/types";
import AiButton from "@/components/ai/AiButton";

interface TopicsPanelProps {
  subject: Subject;
  serie: Serie;
}

const LEVEL_ORDER: TopicLevel[] = ["basico", "intermediario", "avancado"];

export default function TopicsPanel({ subject, serie }: TopicsPanelProps) {
  const topicsByLevel = LEVEL_ORDER.map((level) => ({
    level,
    topics: subject.topics.filter((t) => t.level === level),
  })).filter((g) => g.topics.length > 0);

  return (
    <div className="card p-4 animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{subject.icon}</span>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800 leading-tight">{subject.name}</h2>
          <p className="text-xs text-gray-400">{serie}º ano · Tópicos de recomposição</p>
        </div>
        <AiButton subject={subject.name} serie={serie} />
      </div>

      <div className="space-y-4">
        {topicsByLevel.map(({ level, topics }) => (
          <div key={level}>
            {/* Level header */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-2 ${getLevelColor(level)}`}>
              <span className="text-sm">{getLevelIcon(level)}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{getLevelLabel(level)}</span>
              <span className="text-[10px] opacity-60 ml-auto">{topics.length} {topics.length === 1 ? "tópico" : "tópicos"}</span>
            </div>

            {/* Topics list */}
            <ul className="divide-y divide-gray-50 pl-1">
              {topics.map((topic) => (
                <li key={topic.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(topic.status)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{topic.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {topic.bnccCode && (
                        <span className="badge-bncc">BNCC {topic.bnccCode}</span>
                      )}
                      {topic.dcrcRef && (
                        <span className="text-[10px] font-mono bg-ceara-amarelo-light text-amber-800 px-2 py-0.5 rounded-md">
                          {topic.dcrcRef}
                        </span>
                      )}
                    </div>
                  </div>
                  <AiButton subject={subject.name} serie={serie} topic={topic.title} className="text-[10px] px-2 py-1" />
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-lg flex-shrink-0 ${getStatusColor(topic.status)}`}
                  >
                    {getStatusLabel(topic.status)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
