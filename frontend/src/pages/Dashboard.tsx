import React, { useEffect, useState } from "react";
import { BookOpen, BookMarked, FileText, Layers } from "lucide-react";
import { getStats } from "../services/storyService";

interface Stats {
  totalStories: number;
  publishedStories: number;
  draftStories: number;
  totalChapters: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getStats().then((res) => setStats(res.data)).catch(console.error);
  }, []);

  const cards = [
    { label: "Total Stories", value: stats?.totalStories ?? 0, icon: BookOpen, color: "bg-cyan-500" },
    { label: "Published", value: stats?.publishedStories ?? 0, icon: BookMarked, color: "bg-green-500" },
    { label: "Drafts", value: stats?.draftStories ?? 0, icon: FileText, color: "bg-yellow-500" },
    { label: "Total Chapters", value: stats?.totalChapters ?? 0, icon: Layers, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
