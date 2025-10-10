"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";

import { EllipsisVertical } from "lucide-react";
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

const ProjectViewTable = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // ---------------- Dummy Progress Data ----------------
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

  const commentsData = [
  {
    id: 1,
    user: "Bonnie Green",
    time: "11:46 AM",
    message: "That's awesome. I think our users will really appreciate the improvements.",
    status: "Delivered",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    user: "John Doe",
    time: "12:02 PM",
    message: "I’ve updated the API integration, can you check the logs?",
    status: "Seen",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    user: "Jane Smith",
    time: "12:10 PM",
    message: "Looks good on my end. We can deploy tomorrow morning.",
    status: "Delivered",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];

  // ---------------- File Modal ----------------
  const handleViewFile = (fileUrl: string) => {
    setSelectedFile(fileUrl);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  return (
    <>
      {/* =================== First Row =================== */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        {/* 8/12 section */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col flex-[8] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-semibold text-lg">
                Lusaka Water Project
              </p>
              <p className="text-gray-500 text-sm">
                Oct 01, 2025 – Mar 01, 2026
              </p>
            </div>

            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200">
                🕒 Planned
              </span>
            </div>

            <button className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition">
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              Update
            </button>
          </div>

          {/* Description */}
          <div className="border-t pt-4">
            <p className="text-gray-900 font-semibold text-lg mb-2">
              Description
            </p>
            <p className="text-gray-700 text-sm">
              Water supply improvement project aimed at improving clean water
              access across Lusaka.
            </p>
          </div>

          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Project Type
                  </td>
                  <td className="py-2 px-4 text-gray-900">Infrastructure</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Allocated Budget
                  </td>
                  <td className="py-2 px-4 text-gray-900">ZMW 5,000,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Beneficiaries
                  </td>
                  <td className="py-2 px-4 text-gray-900">5,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Project Manager
                  </td>
                  <td className="py-2 px-4 text-gray-900">John Doe</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Funding Source
                  </td>
                  <td className="py-2 px-4 text-gray-900">CDF</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Location
                  </td>
                  <td className="py-2 px-4 text-gray-900">Lusaka</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Remarks
                  </td>
                  <td className="py-2 px-4 text-gray-900">Urgent priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4/12 section (Right Side Info) */}
        <div className="bg-gray-100 shadow-md text-black rounded-2xl p-6 flex flex-col flex-[4] space-y-6">
          <div>
            <p className="text-sm text-gray-600 flex items-center font-medium">
              <svg
                className="fill-current text-gray-700 w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
              </svg>
              Created By
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              className="w-12 h-12 rounded-full border border-gray-300"
              src="/default-profile.png"
              alt="Avatar"
            />
            <div>
              <p className="text-gray-900 font-medium">Jonathan Reinink</p>
              <p className="text-gray-500 text-sm">Aug 18</p>
            </div>
          </div>

          <div>
            <p className="text-gray-900 font-semibold text-lg mb-3 border-b pb-1">
              Contact Info
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Email:</span> example@email.com
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Mobile:</span> +123 456 789
            </p>
          </div>

          <div>
            <p className="text-gray-900 font-semibold text-lg mb-3 border-b pb-1">
              Constituency Info
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Name:</span> Example Constituency
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Role:</span> Representative
            </p>
          </div>
        </div>
      </div>

      {/* =================== Second Row =================== */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        {/* 8/12 section */}
        <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 overflow-y-auto flex-[8]">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Project Progress Updates
          </h2>

          <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
            <thead className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 px-4">#</th>
                <th className="text-left py-2 px-4">User</th>
                <th className="text-left py-2 px-4">Update Type</th>
                <th className="text-left py-2 px-4">Progress (%)</th>
                <th className="text-left py-2 px-4">Remarks</th>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">File</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {progressData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    <img
                      src={item.avatar}
                      alt={item.user}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{item.user}</span>
                  </td>
                  <td className="py-2 px-4">{item.updateType}</td>
                  <td className="py-2 px-4">{item.progress}%</td>
                  <td className="py-2 px-4 text-gray-600">{item.remarks}</td>
                  <td className="py-2 px-4 text-gray-500 text-xs">
                    {item.date}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewFile(item.fileUrl)}
                      className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4/12 section */}
        <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 flex flex-col justify-between flex-[4]">
          
           <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 flex flex-col flex-[4]">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Comments</h2>

      {/* Comments Scrollable Area */}
      <div className="overflow-y-auto space-y-4 pr-2 flex-1">
        {commentsData.map((comment: { id: Key | null | undefined; avatar: string | Blob | undefined; user: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; time: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <div key={comment.id} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
            <img
              className="w-8 h-8 rounded-full border border-gray-300"
              src={comment.avatar}
              alt={typeof comment.user === "string" ? comment.user : String(comment.user ?? "")}
            />
            <div className="flex flex-col w-full leading-tight">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">{comment.user}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.message}</p>
              <span className="text-xs text-gray-400 mt-1">{comment.status}</span>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-full transition">
              <EllipsisVertical size={16} className="text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Comment Section */}
      <div className="mt-4 border-t pt-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 text-sm p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition">
          Send
        </button>
      </div>
    </div>


        </div>
      </div>

      {/* ---------------- File Preview Modal ---------------- */}
      {selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl p-4 relative">
            <button
              onClick={closeModal}
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
              ></iframe>
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
