"use client";

import { useState, ChangeEvent } from "react";
import ProjectService, { ProjectUpdateAPI } from "../../api/project/project";
import Swal from "sweetalert2";

interface ProjectHeaderProps {
  id: number;
  name: string;
  period: string;
  status: string;
  initialProgress?: number;
}

const ProjectHeader = ({ id, name, period, status, initialProgress = 0 }: ProjectHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(initialProgress);
  const [projectStatus, setProjectStatus] = useState(status);
  const [remarks, setRemarks] = useState("");

  const handleUpdate = async () => {
    const data: ProjectUpdateAPI = {
      project: id,
      update_type: "progress",
      progress_percentage: progressPercentage,
      remarks,
      updated_by: 1, // Replace with logged-in user ID
    };

    const response = await ProjectService.createProjectUpdate(data);

    if (response.status === "success") {
      Swal.fire("Success", "Project update created successfully!", "success");
      setIsModalOpen(false);
    } else {
      Swal.fire("Error", response.message || "Failed to update project.", "error");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-500">{period}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
            projectStatus === "completed"
              ? "bg-green-100 text-green-700"
              : projectStatus === "in-progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {projectStatus}
        </span>
      </div>

      <div className="mt-4 md:mt-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Project
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
            <h3 className="text-xl text-black mb-4">Update Project</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Completion Progress (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(Number(e.target.value))}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">Status</label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
