"use client";
import { Eye } from "lucide-react";

interface ProgressUpdate {
  id: number;
  user: string;
  avatar: string;
  updateType: string;
  progress: number;
  remarks: string;
  date: string;
  fileUrl: string;
}


interface ProgressTableProps {
  data: ProgressUpdate[];
  onViewFile: (fileUrl: string) => void;
}

const ProgressTable = ({ data, onViewFile }: ProgressTableProps) => (
  <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 overflow-y-auto flex-[8]">
    <h2 className="text-lg font-semibold mb-3 text-gray-800">Project Progress Updates</h2>
    <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
      <thead className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wide">
        <tr>
          <th className="text-left py-2 px-4">#</th>
          <th className="text-left py-2 px-4">User</th>
          <th className="text-left py-2 px-4">Update Type</th>
          <th className="text-left py-2 px-4">Progress (%)</th>
          <th className="text-left py-2 px-4">Remarks</th>
          <th className="text-left py-2 px-4">Date</th>
          <th className="text-left py-2 px-4">File</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {data.map((item) => (
          <tr key={item.id} className="border-b hover:bg-gray-50 transition">
            <td className="py-2 px-4">{item.id}</td>
            <td className="py-2 px-4 flex items-center gap-2">
              <img src={item.avatar} alt={item.user} className="w-6 h-6 rounded-full" />
              <span className="text-sm">{item.user}</span>
            </td>
            <td className="py-2 px-4">{item.updateType}</td>
            <td className="py-2 px-4">{item.progress}%</td>
            <td className="py-2 px-4 text-gray-600">{item.remarks}</td>
            <td className="py-2 px-4 text-gray-500 text-xs">{item.date}</td>


            <td className="py-2 px-4">
            <a
                onClick={() => onViewFile(item.fileUrl)}
                className="bg-green-900 text-white p-2 rounded hover:bg-gree -700 transition flex items-center justify-center"
            >
                <Eye className="w-4 h-4" />
            </a>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProgressTable;
