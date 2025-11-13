"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatsService, { StatItem } from "../../api/stats/stats";

const HomeStats = () => {
  const [data, setData] = useState<StatItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const json = await StatsService.getStatsGraph();
        if (json.status === "success") {
          setData(json.data);
        }
        
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-black shadow-lg rounded-2xl p-6 border border-gray-800">
        <h2 className="text-2xl text-gray-100 font-semibold mb-4">
          User & Project Growth
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a202c",
                  border: "1px solid #2d3748",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              <Line
                type="monotone"
                dataKey="Users"
                stroke="#60a5fa"
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="Projects"
                stroke="#34d399"
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomeStats;
