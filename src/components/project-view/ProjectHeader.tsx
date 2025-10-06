"use client";

interface ProjectHeaderProps {
  name: string;
  period: string;
  status: string;
}

const ProjectHeader = ({ name, period, status }: ProjectHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-900 font-semibold text-lg">{name}</p>
      <p className="text-gray-500 text-sm">{period}</p>
    </div>
    <div>
      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200">
        🕒 {status}
      </span>
    </div>
    <button className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition">
      Update
    </button>
  </div>
);

export default ProjectHeader;
