"use client";

import { useState } from "react";
import ProjectService, { ProjectUpdateAPI } from "../../api/project/project";
import Swal from "sweetalert2";

interface ProjectHeaderProps {
  id: number;
  name: string;
  period: string;
  status: string;
  initialProgress?: number;
}

const ProjectHeader = ({
  id,
  name,
  period,
  status,
  initialProgress = 0,
}: ProjectHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(initialProgress);
  const [projectStatus, setProjectStatus] = useState(status);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const handleUpdate = async () => {
    if (isSubmitting) return;

    if (progressPercentage < initialProgress) {
      Swal.fire(
        "Warning",
        `You cannot decrease progress below ${initialProgress}%.`,
        "warning"
      );
      return;
    }

    if (isNaN(progressPercentage) || progressPercentage < 0 || progressPercentage > 100) {
      Swal.fire("Warning", "Progress must be between 0 and 100.", "warning");
      return;
    }

    if (projectStatus === "completed" && progressPercentage < 100) {
      Swal.fire(
        "Warning",
        "You cannot mark as completed unless progress is 100%.",
        "warning"
      );
      return;
    }
    if (projectStatus === "in-progress" && progressPercentage === 100) {
      Swal.fire(
        "Warning",
        "If progress is 100%, please mark status as 'Completed'.",
        "warning"
      );
      return;
    }
    if (remarks.trim().length === 0) {
      Swal.fire("Warning", "Please add remarks before saving.", "warning");
      return;
    }

    if (projectStatus === "completed" && remarks.trim().length < 10) {
      Swal.fire(
        "Warning",
        "Please provide detailed remarks when marking as completed.",
        "warning"
      );
      return;
    }

    if (projectStatus === status && progressPercentage === initialProgress) {
      Swal.fire("Info", "No changes detected to update.", "info");
      return;
    }

    if (lastUpdateTime && new Date().getTime() - lastUpdateTime.getTime() < 60000) {
      Swal.fire(
        "Warning",
        "You can only update once every minute to avoid spam.",
        "warning"
      );
      return;
    }

    if (progressPercentage - initialProgress >= 50) {
      const confirm = await Swal.fire({
        title: "Confirm Large Update",
        text: "You are increasing progress by more than 50%. Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, continue",
      });
      if (!confirm.isConfirmed) return;
    }
    if (projectStatus === "pending" && progressPercentage > 0) {
      Swal.fire(
        "Warning",
        "You cannot set status to 'Pending' when progress is above 0%.",
        "warning"
      );
      return;
    }
    if (progressPercentage - initialProgress > 10 && remarks.trim().length < 5) {
      Swal.fire(
        "Warning",
        "Please provide additional remarks for significant progress updates (>10%).",
        "warning"
      );
      return;
    }
    if (isSubmitting) {
      Swal.fire("Info", "Update already in progress, please wait.", "info");
      return;
    }

    const data: ProjectUpdateAPI = {
      project: id,
      update_type: "progress",
      progress_percentage: progressPercentage,
      remarks,
      updated_by: 1,
    };

    try {
      setIsSubmitting(true);

      const response = await ProjectService.createProjectUpdate(data);

      if (response.status === "success") {
        Swal.fire("Success", "Project update saved successfully!", "success");
        setIsModalOpen(false);
        setLastUpdateTime(new Date());
      } else {
        Swal.fire("Error", response.message || "Failed to update project.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Network error while updating project.", "error");
    } finally {
      setIsSubmitting(false);
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
              {/* Progress */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Completion Progress (%)
                </label>
                <input
                  type="number"
                  min={initialProgress}
                  max={100}
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(Number(e.target.value))}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current progress: {initialProgress}%
                </p>
              </div>

              {/* Status */}
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

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Add remarks about this update..."
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
