"use client";

import { useState } from "react";

interface ProjectHeaderProps {
  name: string | number;
  period: string;
  status: string;
  initialProgress?: number;
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
  const [remarks, setRemarks] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleUpdate = () => {
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
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-4xl p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Update Project
            </h2>

            {/* Form Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Project Name */}
              <div className="col-span-12 md:col-span-6">
                <label className="text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              {/* Progress % */}
              <div className="col-span-12 md:col-span-6">
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
              </div>

              {/* Status */}
              <div className="col-span-12 md:col-span-6">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Supporting Documents */}
              <div className="col-span-12 md:col-span-6">
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

              {/* Remarks - Full width */}
              <div className="col-span-12">
                <label className="text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={3}
                  placeholder="Add remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
