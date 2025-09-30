"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", Users: 400, Projects: 24 },
  { name: "Feb", Users: 300, Projects: 32 },
  { name: "Mar", Users: 500, Projects: 28 },
  { name: "Apr", Users: 200, Projects: 35 },
  { name: "May", Users: 278, Projects: 40 },
  { name: "Jun", Users: 189, Projects: 25 },
  { name: "Jul", Users: 350, Projects: 30 },
  { name: "Aug", Users: 420, Projects: 36 },
  { name: "Sep", Users: 380, Projects: 29 },
  { name: "Oct", Users: 450, Projects: 42 },
  { name: "Nov", Users: 390, Projects: 31 },
  { name: "Dec", Users: 500, Projects: 45 },
];

const HomeStats = () => {
  return (
    <div className="space-y-6">
      {/* Graph Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl text-black font-semibold mb-4">User & Project Growth</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Users" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Projects" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomeStats;
