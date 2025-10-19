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

  // 🧠 Automatically suggest a status based on progress
  const getStatusFromProgress = (progress: number): string => {
    if (progress === 0) return "not_started";
    if (progress > 0 && progress < 25) return "planning";
    if (progress >= 25 && progress < 50) return "in_progress";
    if (progress >= 50 && progress < 75) return "halfway";
    if (progress >= 75 && progress < 100) return "almost_done";
    if (progress === 100) return "completed";
    return "pending";
  };

  const handleProgressChange = (value: number) => {
    setProgressPercentage(value);
    // Only auto-adjust status if project is not locked
    if (projectStatus !== "on_hold" && projectStatus !== "cancelled" && projectStatus !== "completed") {
      const suggestedStatus = getStatusFromProgress(value);
      setProjectStatus(suggestedStatus);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;

    if (progressPercentage < initialProgress) {
      Swal.fire("Warning", `You cannot decrease progress below ${initialProgress}%.`, "warning");
      return;
    }

    if (isNaN(progressPercentage) || progressPercentage < 0 || progressPercentage > 100) {
      Swal.fire("Warning", "Progress must be between 0 and 100.", "warning");
      return;
    }

    if (projectStatus === "completed" && progressPercentage < 100) {
      Swal.fire("Warning", "You cannot mark as completed unless progress is 100%.", "warning");
      return;
    }

    if (projectStatus === "not_started" && progressPercentage > 0) {
      Swal.fire("Warning", "You cannot set status to 'Not Started' when progress is above 0%.", "warning");
      return;
    }

    if (remarks.trim().length === 0) {
      Swal.fire("Warning", "Please add remarks before saving.", "warning");
      return;
    }

    if (projectStatus === status && progressPercentage === initialProgress) {
      Swal.fire("Info", "No changes detected to update.", "info");
      return;
    }

    if (lastUpdateTime && new Date().getTime() - lastUpdateTime.getTime() < 60000) {
      Swal.fire("Warning", "You can only update once every minute to avoid spam.", "warning");
      return;
    }

    const data: ProjectUpdateAPI = {
      project: id,
      status: projectStatus,
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
      case "halfway":
      case "almost_done":
        return "bg-yellow-100 text-yellow-700";
      case "planning":
        return "bg-blue-100 text-blue-700";
      case "on_hold":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🧱 Check if project is locked (completed or cancelled)
  const isStatusLocked = projectStatus === "completed" || projectStatus === "cancelled";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-500">{period}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(projectStatus)}`}
        >
          {projectStatus.replace("_", " ")}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
            <h3 className="text-xl text-black mb-4">Update Project</h3>

            <div className="space-y-4">
              {/* Progress */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Completion Progress (%)</label>
                <input
                  type="number"
                  min={initialProgress}
                  max={100}
                  value={progressPercentage}
                  onChange={(e) => handleProgressChange(Number(e.target.value))}
                  disabled={isStatusLocked}
                  className={`mt-2 block w-full rounded-xl border px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 ${
                    isStatusLocked
                      ? "bg-gray-100 cursor-not-allowed border-gray-300"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
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
                  disabled={isStatusLocked}
                  className={`mt-2 block w-full rounded-xl border px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 ${
                    isStatusLocked
                      ? "bg-gray-100 cursor-not-allowed border-gray-300"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                >
                  <option value="not_started">Not Started</option>
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="halfway">Halfway Done</option>
                  <option value="almost_done">Almost Done</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {isStatusLocked && (
                  <p className="text-sm text-gray-500 mt-1">
                    This project is <strong>{projectStatus}</strong> and cannot be edited.
                  </p>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  disabled={isStatusLocked}
                  placeholder="Add remarks about this update..."
                  className={`mt-2 block w-full rounded-xl border px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 ${
                    isStatusLocked
                      ? "bg-gray-100 cursor-not-allowed border-gray-300"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
              {!isStatusLocked && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
