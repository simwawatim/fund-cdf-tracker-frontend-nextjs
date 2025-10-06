"use client";

import { useState } from "react";

interface ProjectHeaderProps {
  name: string;
  period: string;
  status: string;
  initialProgress?: number; // optional initial progress
}

const ProjectHeader = ({
  name,
  period,
  status,
  initialProgress = 0,
}: ProjectHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(name);
  const [progressPercentage, setProgressPercentage] = useState(initialProgress);
  const [projectStatus, setProjectStatus] = useState(status);
  const [remarks, setRemarks] = useState(""); // new remarks
  const [documents, setDocuments] = useState<File[]>([]); // supporting documents

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleUpdate = () => {
    // Here you can call an API to update the project and upload documents
    console.log("Updated Project:", {
      projectName,
      progressPercentage,
      projectStatus,
      remarks,
      documents,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-900 font-semibold text-lg">{projectName}</p>
        <p className="text-gray-500 text-sm">{period}</p>
      </div>
      <div>
        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200">
          🕒 {projectStatus}
        </span>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition"
      >
        Update
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Update Project</h2>

            <div className="flex flex-col space-y-3">
              {/* Project Name */}
              <label className="text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              {/* Progress % */}
              <label className="text-sm font-medium text-gray-700">
                Progress (%)
              </label>
              <select
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={progressPercentage}
                onChange={(e) =>
                  setProgressPercentage(parseInt(e.target.value))
                }
              >
                {Array.from({ length: 21 }, (_, i) => i * 5).map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
              </select>

              {/* Status */}
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Remarks */}
              <label className="text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                rows={3}
                placeholder="Add remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              {/* Supporting Documents */}
              <label className="text-sm font-medium text-gray-700">
                Supporting Documents
              </label>
              <input
                type="file"
                multiple
                className="mt-2 block w-full text-sm text-gray-900"
                onChange={handleFileChange}
              />
              {documents.length > 0 && (
                <ul className="mt-1 text-gray-700 text-sm list-disc list-inside">
                  {documents.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleUpdate}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
