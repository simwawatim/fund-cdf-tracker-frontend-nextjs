"use client";

import { useState, ChangeEvent, useEffect } from "react";
import ProjectService, { ProjectUpdateAPI } from "../../api/project/project";
import Swal from "sweetalert2";
import { getCurrentUserIdSafe, getCurrentUserRole } from "@/api/base/token";

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
  // Displayed card states
  const [projectStatus, setProjectStatus] = useState(status);
  const [progressPercentage, setProgressPercentage] = useState(initialProgress);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Modal-specific states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(status);
  const [modalProgress, setModalProgress] = useState(initialProgress);
  const [modalRemarks, setModalRemarks] = useState("");
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = getCurrentUserRole(); // "admin" or "officer"

  // Map progress to backend-supported statuses
  const getStatusFromProgress = (progress: number): string => {
    if (progress === 0) return "pending";
    if (progress > 0 && progress < 100) return "in_progress";
    if (progress === 100) return "completed";
    return "pending";
  };

  const handleModalProgressChange = (value: number) => {
    const clampedValue = Math.max(value, initialProgress);
    setModalProgress(clampedValue);

    if (!["on_hold", "cancelled", "rejected", "completed"].includes(modalStatus)) {
      setModalStatus(getStatusFromProgress(clampedValue));
    }
  };

  const handleModalFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only PDF files are allowed.",
      });
      e.target.value = "";
      return;
    }

    setModalFile(selectedFile);
  };

 const handleUpdate = async () => {
  if (isSubmitting) return;

  if (!modalRemarks.trim()) {
    Swal.fire("Warning", "Please add remarks before saving.", "warning");
    return;
  }

  if (modalProgress < initialProgress) {
    Swal.fire("Warning", `Cannot decrease progress below ${initialProgress}%.`, "warning");
    return;
  }

  // Determine final status to send
  let finalStatus = modalStatus;

  // Validate completed
  if (finalStatus === "completed" && modalProgress < 100) {
    Swal.fire("Warning", "Completed status requires 100% progress.", "warning");
    return;
  }

  // Apply default status mapping only if user didn't select a status manually
  if (!finalStatus || finalStatus === "pending" || finalStatus === "in_progress") {
    finalStatus = getStatusFromProgress(modalProgress);
  }

  if (lastUpdateTime && new Date().getTime() - lastUpdateTime.getTime() < 60000) {
    Swal.fire("Warning", "You can only update once every minute.", "warning");
    return;
  }

  const userId = getCurrentUserIdSafe();
  if (userId === null) return;

  const data: ProjectUpdateAPI = {
    project: id,
    status: finalStatus, // <-- use the final status
    progress_percentage: modalProgress,
    remarks: modalRemarks,
    file: modalFile,
    updated_by: userId,
  };

  try {
    setIsSubmitting(true);
    const response = await ProjectService.createProjectUpdate(data);

    if (response.status === "success") {
      Swal.fire("Success", "Project update saved successfully!", "success");
      setIsModalOpen(false);
      setProjectStatus(finalStatus); // update card
      setProgressPercentage(modalProgress);
      setLastUpdateTime(new Date());
      setModalRemarks("");
      setModalFile(null);
    } else {
      Swal.fire("Error", response.message || "Failed to update project.", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Network error while updating project.", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "on_hold":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isStatusLocked = ["cancelled", "rejected"].includes(projectStatus);

  // Reset modal states when opening
  useEffect(() => {
    if (isModalOpen) {
      setModalStatus(projectStatus);
      setModalProgress(progressPercentage);
      setModalRemarks("");
      setModalFile(null);
    }
  }, [isModalOpen]);

  const normalizedStatus = projectStatus?.toLowerCase().trim();

  const canViewUpdateButton =
  normalizedStatus !== "rejected" &&
  (
    (userRole === "admin" && normalizedStatus === "pending") ||
    (userRole === "officer" && normalizedStatus !== "pending")
  );

  const allowedStatuses =
  userRole === "admin"
    ? ["in_progress", "rejected"]
    : ["on_hold", "completed", "cancelled"];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-500">{period}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(
            projectStatus
          )}`}
        >
          {projectStatus.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 md:mt-0">
        {canViewUpdateButton && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Project
          </button>
        )}
      </div>

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
                  value={modalProgress}
                  onChange={(e) => handleModalProgressChange(Number(e.target.value))}
                  disabled={isStatusLocked}
                  className={`mt-2 block w-full rounded-xl border px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 ${
                    isStatusLocked
                      ? "bg-gray-100 cursor-not-allowed border-gray-300"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current progress: {progressPercentage}%
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  disabled={isStatusLocked}
                  className={`mt-2 block w-full rounded-xl border px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 ${
                    isStatusLocked
                      ? "bg-gray-100 cursor-not-allowed border-gray-300"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                >
                  {allowedStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>

              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Remarks</label>
                <textarea
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  rows={3}
                  disabled={isStatusLocked}
                  placeholder="Add remarks about this update..."
                  className={`mt-2 block w-full rounded-xl border px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 ${
                    isStatusLocked
                      ? "bg-gray-100 cursor-not-allowed border-gray-300"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Attach File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleModalFileChange}
                  disabled={isStatusLocked}
                  className="mt-2 block w-full text-gray-900"
                />
                {modalFile && (
                  <p className="text-xs mt-1 text-gray-500">Selected file: {modalFile.name}</p>
                )}
              </div>
            </div>

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
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
