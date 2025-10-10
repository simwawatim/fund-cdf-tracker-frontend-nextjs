"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

interface ProgressUpdate {
  id: number;
  user: string;
  avatar: string;
  update_type: string;
  progress_percentage: number;
  remarks: string;
  date: string;
  fileUrl: string;
}

interface ProgressTableProps {
  data: ProgressUpdate[];
  onViewFile: (fileUrl: string) => void;
}

const ProgressTable = ({ data, onViewFile }: ProgressTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // number of rows per page

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-xl font-semibold mb-4 text-black">
        Project Progress Updates
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow border border-gray-200 text-sm">
          <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="text-left py-2 px-4">#</th>
              <th className="text-left py-2 px-4">User</th>
              <th className="text-left py-2 px-4">Update Type</th>
              <th className="text-left py-2 px-4">Progress</th>
              <th className="text-left py-2 px-4">Remarks</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">File</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-2 px-4 text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <img
                    src={item.avatar || "https://i.pravatar.cc/40?img=3"}
                    alt={item.user}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-medium text-gray-900 text-sm">
                    {item.user}
                  </span>
                </td>

                <td className="py-2 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {item.update_type}
                  </span>
                </td>
                <td className="py-2 px-4 text-gray-900 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.progress_percentage >= 100
                            ? "bg-green-600"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${item.progress_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {item.progress_percentage}%
                    </span>
                  </div>
                </td>

                <td className="py-2 px-4 text-gray-600 text-sm truncate max-w-xs">
                  {item.remarks}
                </td>

                <td className="py-2 px-4 text-gray-500 text-xs">
                  {formatDate(item.date)}
                </td>

                <td className="py-2 px-4">
                  <button
                    onClick={() =>
                      onViewFile(item.fileUrl || "/completion-report.pdf")
                    }
                    className="bg-green-800 text-white p-1.5 rounded hover:bg-black transition flex items-center justify-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 italic text-sm"
                >
                  No progress updates available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressTable;
