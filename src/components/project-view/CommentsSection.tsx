"use client";

import { EllipsisVertical } from "lucide-react";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  message: string;
  status: string;
}



interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection = ({ comments }: CommentsSectionProps) => (
  <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 flex flex-col flex-[4]">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">Comments</h2>
    <div className="overflow-y-auto space-y-4 pr-2 flex-1">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
          <img
            className="w-8 h-8 rounded-full border border-gray-300"
            src={comment.avatar}
            alt={comment.user}
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
    <div className="mt-4 border-t pt-3 flex items-center gap-2">
      <input
        type="text"
        placeholder="Write a comment..."
        className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      <button className="bg-green-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-green-700 transition">
        Send
      </button>
    </div>
  </div>
);

export default CommentsSection;
