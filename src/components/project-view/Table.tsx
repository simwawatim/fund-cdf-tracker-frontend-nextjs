"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// -------------------- Lazy Components --------------------
const ProjectHeader = dynamic(() => import("./ProjectHeader"), { ssr: false });
const ProjectDetails = dynamic(() => import("./ProjectDetails"), { ssr: false });
const ProgressTable = dynamic(() => import("./ProgressTable"), { ssr: false });
const CommentsSection = dynamic(() => import("./CommentsSection"), { ssr: false });
const CreatedByInfo = dynamic(() => import("./CreateBySection"), { ssr: false });

// -------------------- Interfaces --------------------
interface ProgressUpdate {
  id: number;
  user: string;
  avatar: string;
  updateType: string;
  progress: number;
  remarks: string;
  date: string;
  fileUrl: string;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  message: string;
  status: string;
}

const ProjectViewTable = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    if (sectionIndex < 5) {
      const timer = setTimeout(() => setSectionIndex(sectionIndex + 1), 1000); // 5s delay per section
      return () => clearTimeout(timer);
    }
  }, [sectionIndex]);
  const progressData: ProgressUpdate[] = [
    {
      id: 1,
      user: "John Doe",
      avatar: "https://i.pravatar.cc/40?img=1",
      updateType: "Progress",
      progress: 20,
      remarks: "Initial phase completed",
      date: "2025-10-06",
      fileUrl: "completion-report.pdf",
    },
    {
      id: 2,
      user: "Jane Smith",
      avatar: "https://i.pravatar.cc/40?img=2",
      updateType: "Progress",
      progress: 45,
      remarks: "Foundation works ongoing",
      date: "2025-10-05",
      fileUrl: "completion-report.pdf",
    },
    {
      id: 3,
      user: "Admin",
      avatar: "https://i.pravatar.cc/40?img=3",
      updateType: "Completion",
      progress: 100,
      remarks: "Project successfully completed",
      date: "2025-10-04",
      fileUrl: "completion-report.pdf",
    },
  ];

  const commentsData: Comment[] = [
    {
      id: 1,
      user: "Bonnie Green",
      avatar: "https://i.pravatar.cc/40?img=1",
      time: "11:46 AM",
      message: "That's awesome. I think our users will really appreciate the improvements.",
      status: "Delivered",
    },
    {
      id: 2,
      user: "John Doe",
      avatar: "https://i.pravatar.cc/40?img=2",
      time: "12:02 PM",
      message: "I’ve updated the API integration, can you check the logs?",
      status: "Seen",
    },
    {
      id: 3,
      user: "Jane Smith",
      avatar: "https://i.pravatar.cc/40?img=3",
      time: "12:10 PM",
      message: "Looks good on my end. We can deploy tomorrow morning.",
      status: "Delivered",
    },
  ];

  return (
    <>
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full items-start">
        {/* Left Card */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-4 flex-1 flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
          {/* ProjectHeader */}
          {sectionIndex >= 1 ? (
            <ProjectHeader
              name="Lusaka Water Project"
              period="Oct 01, 2025 – Mar 01, 2026"
              status="Planned"
            />
          ) : (
            <div className="h-12 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}

          {/* Description */}
          {sectionIndex >= 2 ? (
            <div className="border-t pt-2">
              <p className="text-gray-900 font-semibold text-lg mb-1">Description</p>
              <p className="text-gray-700 text-sm">
                Water supply improvement project aimed at improving clean water access across Lusaka.
              </p>
            </div>
          ) : (
            <div className="h-12 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}

          {/* ProjectDetails */}
          {sectionIndex >= 3 ? (
            <ProjectDetails
              type="Infrastructure"
              budget="ZMW 5,000,000"
              beneficiaries="5,000"
              manager="John Doe"
              source="CDF"
              location="Lusaka"
              remarks="Urgent priority"
            />
          ) : (
            <div className="h-24 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}
        </div>

        {/* Right Card - CreatedByInfo */}
        <div className="flex-1 max-w-xs self-start">
          {sectionIndex >= 4 ? (
            <CreatedByInfo
              creator={{
                name: "Jonathan Reinink",
                avatar: "/default-profile.png",
                date: "Aug 18",
                email: "example@email.com",
                mobile: "+123 456 789",
                constituency: { name: "Example Constituency", role: "Representative" },
              }}
            />
          ) : (
            <div className="h-64 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        <div className="flex-1">
          {sectionIndex >= 5 ? (
            <ProgressTable data={progressData} onViewFile={setSelectedFile} />
          ) : (
            <div className="h-64 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}
        </div>
        <div className="flex-1">
          {sectionIndex >= 5 ? (
            <CommentsSection comments={commentsData} />
          ) : (
            <div className="h-64 animate-pulse bg-gray-200 rounded-lg mb-4" />
          )}
        </div>
      </div>

      {/* File Preview Modal */}
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
              <iframe
                src={selectedFile}
                className="w-full h-96 rounded-md border"
                title="PDF Preview"
              />
            ) : (
              <img
                src={selectedFile}
                alt="File Preview"
                className="w-full h-96 object-contain rounded-md"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectViewTable;
