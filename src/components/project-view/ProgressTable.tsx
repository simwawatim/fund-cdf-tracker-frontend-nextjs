"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import PDF_API_URL from "../../api/base/pdf";
import ProfileService from "../../api/profile/profile";

interface DocumentItem {
  id: number;
  file: string;
  title?: string;
}

interface ProgressUpdate {
  updated_by_id: any;
  id: number;
  user: string;
  avatar?: string;
  status: string;
  progress_percentage: number;
  remarks: string;
  file: string;
  date: string;
  documents?: DocumentItem[];
}

interface ProgressTableProps {
  data: ProgressUpdate[];
}

const ProgressTable = ({ data }: ProgressTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<Record<number, string>>({});

  const rowsPerPage = 5;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const onViewFile = (fileUrl: string) => {
    setSelectedFile(fileUrl);
  };

  // Fetch all avatars once per `data` change
  useEffect(() => {
    const fetchAvatars = async () => {
      const newAvatars: Record<number, string> = {};
      await Promise.all(
        data.map(async (item) => {
          try {
            const res = await ProfileService.getProfilePictureById(14);
            newAvatars[item.updated_by_id] =
              res.status === "success" && res.profile_pic
                ? res.profile_pic
                : "/default-profile.png";
          } catch {
            newAvatars[item.updated_by_id] = "/default-profile.png";
          }
        })
      );
      setAvatars(newAvatars);
    };

    fetchAvatars();
  }, [data]);

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-xl font-semibold mb-4 text-black">
        Project Progress Updates
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow border border-gray-200 text-sm">
          <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="text-left py-2 px-2 sm:px-4">#</th>
              <th className="text-left py-2 px-2 sm:px-4">User</th>
              <th className="text-left py-2 px-2 sm:px-4">Status</th>
              <th className="text-left py-2 px-2 sm:px-4">Progress</th>
              <th className="text-left py-2 px-2 sm:px-4 hidden md:table-cell">
                Remarks
              </th>
              <th className="text-left py-2 px-2 sm:px-4 hidden sm:table-cell">
                Date
              </th>
              <th className="text-left py-2 px-2 sm:px-4">Files</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => {
              const isExpanded = expandedRow === item.id;
              const shortText =
                item.remarks.length > 80
                  ? item.remarks.slice(0, 80) + "..."
                  : item.remarks;

              return (
                <tr
                  key={`update-${item.id}`}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-2 px-2 sm:px-4 text-gray-900">
                    {startIndex + index + 1}
                  </td>

                  <td className="py-2 px-2 sm:px-4 flex items-center gap-2">
                    <img
                      src={avatars[item.updated_by_id]}
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                    {/* <span className="truncate max-w-[100px] sm:max-w-[150px]">
                      {item.user}
                    </span> */}
                  </td>

                  <td className="py-2 px-2 sm:px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {item.status}
                    </span>
                  </td>

                  <td className="py-2 px-2 sm:px-4 text-gray-900 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.progress_percentage >= 100
                              ? "bg-green-600"
                              : "bg-blue-600"
                          }`}
                          style={{ width: `${item.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{item.progress_percentage}%</span>
                    </div>
                  </td>

                  <td className="py-2 px-2 sm:px-4 text-gray-600 text-sm hidden md:table-cell max-w-sm truncate">
                    {isExpanded ? item.remarks : shortText}
                    {item.remarks.length > 80 && (
                      <button
                        onClick={() => toggleRow(item.id)}
                        className="ml-2 text-blue-600 hover:underline text-xs"
                      >
                        {isExpanded ? "Hide" : "Read more"}
                      </button>
                    )}
                  </td>

                  <td className="py-2 px-2 sm:px-4 text-gray-500 text-xs hidden sm:table-cell">
                    {formatDate(item.date)}
                  </td>

                  <td className="py-2 px-2 sm:px-4 flex gap-1 flex-wrap">
                    {item.documents && item.documents.length > 0 ? (
                      item.documents.map((doc) => {
                        const filePath =
                          typeof doc === "string" ? doc : doc.file;
                        if (!filePath) return null;

                        const pdfUrl = `${PDF_API_URL}${filePath}`;
                        return (
                          <a
                            key={`doc-${item.id}-${filePath}`}
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-800 text-white p-1.5 rounded hover:bg-black transition flex items-center justify-center"
                            title={
                              typeof doc === "string" ? "Document" : doc.title
                            }
                            onClick={() => onViewFile(pdfUrl)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        );
                      })
                    ) : (
                      <span className="text-gray-400 text-xs">No file</span>
                    )}
                  </td>
                </tr>
              );
            })}

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

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700 gap-2 sm:gap-0">
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

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
          <div className="bg-white p-4 rounded-lg max-w-full sm:max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <iframe
              src={selectedFile}
              className="w-full h-72 sm:h-96 mt-6 rounded border border-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTable;
