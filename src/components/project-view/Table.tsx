"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import ProjectService, { ProjectAPI } from "../../api/project/project";
import { CommentsAPI } from "../../api/comment/comment";
import MemberService, { CreateMemberPayload, UserProfileAPI } from "../../api/member/member";



const ProjectHeader = dynamic(() => import("./ProjectHeader"), { ssr: false });
const ProjectDetails = dynamic(() => import("./ProjectDetails"), { ssr: false });
const ProgressTable = dynamic(() => import("./ProgressTable"), { ssr: false });
const CreatedByInfo = dynamic(() => import("./CreateBySection"), { ssr: false });

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

interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  constituency: number;
  phone: string;
  image: string;
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

  // Progressive loading for sections
  useEffect(() => {
    if (sectionIndex < 5) {
      const timer = setTimeout(() => setSectionIndex((prev) => prev + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sectionIndex]);

  const getConstituencyName = () => {
    if (!createdBy || !createdBy.constituency) return "N/A";
    return `Constituency ${createdBy.constituency}`;
  };

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
        } else {
          await Swal.fire("Error", "Unexpected project update format.", "error");
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

  const fetchComments = async (projectId: number): Promise<void> => {
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
      } else {
        await Swal.fire("Error", response.message, "error");
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      await Swal.fire("Error", "Failed to load comments", "error");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (message: string, parent: number | null = null): Promise<void> => {
    if (!id) {
      await Swal.fire("Error", "Project ID missing", "error");
      return;
    }
    if (!message.trim()) {
      await Swal.fire("Error", "Message is required", "error");
      return;
    }

    const storedUser = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const userId = storedUser ? Number(storedUser) : 1;

    try {
      const response = await CommentsAPI.createComment(Number(id), userId, message, parent);
      if (response.status === "success") {
        await Swal.fire("Success", "Comment added", "success");
        await fetchComments(Number(id));
      } else {
        await Swal.fire("Error", response.message, "error");
      }
    } catch (err) {
      console.error("Create comment failed:", err);
      await Swal.fire("Error", "Failed to post comment", "error");
    }
  };

  // ✅ Update comment (Promise<void>)
  const handleEditComment = async (commentId: number, newMessage: string): Promise<void> => {
    if (!commentId) {
      await Swal.fire("Error", "Comment ID required", "error");
      return;
    }
    if (!newMessage.trim()) {
      await Swal.fire("Error", "Message is required", "error");
      return;
    }

    try {
      const response = await CommentsAPI.updateComment(commentId, newMessage);
      if (response.status === "success") {
        await Swal.fire("Updated", "Comment updated successfully", "success");
        await fetchComments(Number(id));
      } else {
        await Swal.fire("Error", response.message, "error");
      }
    } catch (err) {
      console.error("Update comment failed:", err);
      await Swal.fire("Error", "Failed to update comment", "error");
    }
  };

  // ✅ Delete comment (Promise<void>)
  const handleDeleteComment = async (commentId: number): Promise<void> => {
    if (!commentId) return;
    const confirmed = await Swal.fire({
      title: "Delete comment?",
      text: "This will remove the comment (soft-delete).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirmed.isConfirmed) return;

    try {
      const response = await CommentsAPI.deleteComment(commentId);
      if (response.status === "success") {
        await Swal.fire("Deleted", "Comment removed", "success");
        await fetchComments(Number(id));
      } else {
        await Swal.fire("Error", response.message, "error");
      }
    } catch (err) {
      console.error("Delete comment failed:", err);
      await Swal.fire("Error", "Failed to delete comment", "error");
    }
  };

  // ✅ Inline Comments UI
  const CommentsSection = ({
    comments,
    loading,
    onAdd,
    onEdit,
    onDelete,
  }: {
    comments: CommentAPI[];
    loading: boolean;
    onAdd: (message: string, parent?: number | null) => Promise<void>;
    onEdit: (id: number, message: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
  }) => {
    const [newMessage, setNewMessage] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    return (
      <div className="bg-white shadow rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-black font-semibold">Comments</h3>
          <span className="text-sm text-black">
            {loading ? "Loading..." : `${comments.length} comment(s)`}
          </span>
        </div>

        {/* Add comment form */}
        <div className="mb-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a comment..."
            className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setNewMessage("")}
              className="px-3 py-1 rounded-md text-sm text-black"
            >
              Clear
            </button>
            <button
              onClick={async () => {
                await onAdd(newMessage.trim());
                setNewMessage("");
              }}
              className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
            >
              Post
            </button>
          </div>
        </div>

        {/* Comment list */}
        <div className="space-y-3">
          {comments.length === 0 && !loading && (
            <div className="text-sm text-gray-500">No comments yet.</div>
          )}

          {comments.map((c) => (
            <div key={c.id} className="border rounded-md p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {c.user_name ? c.user_name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-black text-sm font-medium">{c.user_name || `User ${c.user}`}</div>
                    <div className="text-black text-xs">
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Edit or message */}
                  <div className="mt-2">
                    {editingId === c.id ? (
                      <>
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <div className="flex gap-2 justify-end mt-2">
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingText("");
                            }}
                            className="px-3 py-1 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await onEdit(c.id, editingText.trim());
                              setEditingId(null);
                              setEditingText("");
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded-md"
                          >
                            Save
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.message}</p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingText(c.message);
                      }}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(c.id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>

                    <button
                      onClick={async () => {
                        const reply = prompt("Reply to comment:");
                        if (reply && reply.trim().length) {
                          await onAdd(reply.trim(), c.id);
                        }
                      }}
                      className="text-xs text-gray-600"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full items-start">
        <div className="bg-gray-100 shadow-md rounded-2xl p-4 flex-1 flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
          {sectionIndex >= 1 && projectDetails ? (
            <ProjectHeader
              id={Number(id)}
              name={projectDetails.name}
              period={`${projectDetails.start_date} – ${projectDetails.end_date}`}
              status={projectDetails.status || "Unknown"}
              initialProgress={projectDetails.completion_percentage || 0}
            />
          ) : (
            <div className="h-12 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}

          {sectionIndex >= 2 && projectDetails ? (
            <div className="border-t pt-2">
              <p className="text-gray-900 font-semibold text-lg mb-1">Description</p>
              <p className="text-gray-700 text-sm">{projectDetails.description}</p>
            </div>
          ) : (
            <div className="h-12 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}

          {sectionIndex >= 3 && projectDetails ? (
            <ProjectDetails
              program={String(projectDetails.program)}
              budget="ZMW 5,000,000"
              beneficiaries={String(projectDetails.beneficiaries_count || "0")}
              manager="John Doe"
              source="CDF"
              location="Lusaka"
              remarks={String(projectDetails.remarks)}
            />
          ) : (
            <div className="h-24 animate-pulse bg-gray-200 rounded-lg mb-4" />
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

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        <div className="flex-2">
          {sectionIndex >= 5 ? (
            <ProgressTable data={progressData} onViewFile={setSelectedFile} />
          ) : (
            <div className="h-64 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}
        </div>
        <div className="flex-1">
          {sectionIndex >= 5 ? (
            <CommentsSection
              comments={comments}
              loading={loadingComments}
              onAdd={handleAddComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ) : (
            <div className="h-64 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}
        </div>
      </div>

      {/* File Preview */}
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
