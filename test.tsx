"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import ProjectService, { ProjectAPI } from "../../api/project/project";
import { CommentsAPI } from "../../api/comment/comment";
import MemberService, { UserProfileAPI } from "../../api/member/member";

const ProjectHeader = dynamic(() => import("./ProjectHeader"), { ssr: false });
const ProjectDetails = dynamic(() => import("./ProjectDetails"), { ssr: false });
const ProgressTable = dynamic(() => import("./ProgressTable"), { ssr: false });
const CreatedByInfo = dynamic(() => import("./CreateBySection"), { ssr: false });

// Types
interface ProgressUpdate {
  id: number;
  user: string;
  avatar: string;
  update_type: string;
  progress_percentage: string | number;
  remarks: string;
  date: string;
  fileUrl: string;
}

interface CommentAPI {
  id: number;
  project: number;
  user: number;
  user_name: string;
  message: string;
  parent: number | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

const ProjectViewTable = () => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [projectDetails, setProjectDetails] = useState<ProjectAPI | null>(null);
  const [progressData, setProgressData] = useState<ProgressUpdate[]>([]);
  const [comments, setComments] = useState<CommentAPI[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [createdBy, setCreatedBy] = useState<UserProfileAPI | null>(null);

  // Section loader animation
  useEffect(() => {
    if (sectionIndex < 5) {
      const timer = setTimeout(() => setSectionIndex((prev) => prev + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sectionIndex]);

  // Fetch project & creator
  useEffect(() => {
    if (!id) return;

    const fetchProjectAndCreator = async () => {
      try {
        const response = await ProjectService.getProjectById(Number(id));
        if (response.status === "success") {
          const project = Array.isArray(response.data) ? response.data[0] : response.data;
          setProjectDetails(project);

          // Fetch current user if no creator defined
          if (project.created_by) {
            const memberResponse = await MemberService.getMemberById(Number(project.created_by));
            if (memberResponse.status === "success" && memberResponse.data) {
              setCreatedBy({
                ...memberResponse.data,
                image: memberResponse.data.image || "/default-profile.png",
              });
            }
          } else {
            const currentMember = await MemberService.getCurrentMember();
            if (currentMember.status === "success" && currentMember.data) {
              setCreatedBy({
                ...currentMember.data,
                image: currentMember.data.image || "/default-profile.png",
              });
            }
          }
        } else {
          await Swal.fire("Error", response.message as string, "error");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        await Swal.fire("Error", "Failed to load project data", "error");
      }
    };

    fetchProjectAndCreator();
  }, [id]);

  // Fetch project updates
  useEffect(() => {
    if (!id) return;
    const fetchUpdates = async () => {
      try {
        const response = await ProjectService.getProjectUpdateBasedOnProjectId(Number(id));
        if (response.status === "success" && Array.isArray(response.data)) {
          setProgressData(response.data);
        }
      } catch (err) {
        console.error("Error fetching project update:", err);
        await Swal.fire("Error", "Failed to load project update data", "error");
      }
    };
    fetchUpdates();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    if (!id) return;
    fetchComments(Number(id));
  }, [id]);

  const fetchComments = async (projectId: number) => {
    setLoadingComments(true);
    try {
      const response = await CommentsAPI.getComments(projectId);
      if (response.status === "success") {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setComments(
          (data as CommentAPI[]).sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      await Swal.fire("Error", "Failed to load comments", "error");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (message: string, parent: number | null = null) => {
    if (!id || !message.trim()) return;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const userId = storedUser ? Number(storedUser) : 1;

    try {
      const response = await CommentsAPI.createComment(Number(id), userId, message, parent);
      if (response.status === "success") {
        await fetchComments(Number(id));
      }
    } catch (err) {
      console.error("Create comment failed:", err);
    }
  };

  const handleEditComment = async (commentId: number, newMessage: string) => {
    if (!commentId || !newMessage.trim()) return;
    try {
      const response = await CommentsAPI.updateComment(commentId, newMessage);
      if (response.status === "success") await fetchComments(Number(id));
    } catch (err) {
      console.error("Update comment failed:", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!commentId) return;
    try {
      const response = await CommentsAPI.deleteComment(commentId);
      if (response.status === "success") await fetchComments(Number(id));
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };

  const getConstituencyName = () => {
    if (!createdBy || !createdBy.constituency) return "N/A";
    return `Constituency ${createdBy.constituency}`;
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full items-start">
        <div className="bg-gray-100 shadow-md rounded-2xl p-4 flex-1 flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
          {sectionIndex >= 1 && projectDetails && (
            <ProjectHeader
              id={Number(id)}
              name={projectDetails.name}
              period={`${projectDetails.start_date} – ${projectDetails.end_date}`}
              status={projectDetails.status || "Unknown"}
              initialProgress={projectDetails.completion_percentage || 0}
            />
          )}
          {sectionIndex >= 2 && projectDetails && (
            <div className="border-t pt-2">
              <p className="text-gray-900 font-semibold text-lg mb-1">Description</p>
              <p className="text-gray-700 text-sm">{projectDetails.description}</p>
            </div>
          )}
          {sectionIndex >= 3 && projectDetails && (
            <ProjectDetails
              program={String(projectDetails.program)}
              budget="ZMW 5,000,000"
              beneficiaries={String(projectDetails.beneficiaries_count || "0")}
              manager="John Doe"
              source="CDF"
              location="Lusaka"
              remarks={String(projectDetails.remarks)}
            />
          )}
        </div>

        <div className="flex-1 max-w-xs self-start">
          {sectionIndex >= 4 && createdBy && (
            <CreatedByInfo
              creator={{
                name: `${createdBy.user.first_name} ${createdBy.user.last_name}`,
                avatar: createdBy.image || "/default-profile.png",
                date: "Aug 18",
                email: createdBy.user.email,
                mobile: createdBy.phone,
                constituency: { name: getConstituencyName(), role: createdBy.role },
              }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        <div className="flex-1">
          {sectionIndex >= 5 && <ProgressTable data={progressData} onViewFile={setSelectedFile} />}
        </div>
        <div className="flex-1">
          {sectionIndex >= 5 && (
            <CommentsSection
              comments={comments}
              loading={loadingComments}
              onAdd={handleAddComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl p-4 relative">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className="text-lg text-black mb-3">File Preview</h3>
            {selectedFile.endsWith(".pdf") ? (
              <iframe src={selectedFile} className="w-full h-96 rounded-md border" title="PDF Preview" />
            ) : (
              <img src={selectedFile} alt="File Preview" className="w-full h-96 object-contain rounded-md" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectViewTable;
