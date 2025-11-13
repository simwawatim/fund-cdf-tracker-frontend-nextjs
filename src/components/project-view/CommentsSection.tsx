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

const CommentsSection = ({ comments }: CommentsSectionProps) => {
  return (
    <div className="bg-gray-100 shadow text-black rounded-2xl p-4 flex flex-col h-[90vh]">
      <h2 className="text-base font-semibold mb-3 text-gray-800">Comments</h2>
      <div className="overflow-y-auto pr-2 flex-1">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-2 p-3 mb-3 bg-white shadow-sm rounded-xl"
          >
            <img
              src={comment.avatar}
              alt={comment.user}
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                  {comment.user}
                </span>
                <span className="text-[10px] text-gray-500">{comment.time}</span>
              </div>
              <p className="text-sm text-gray-800 mt-1">{comment.message}</p>

              <div className="flex items-center gap-4 mt-1 text-[10px] text-gray-500">
                <span>{comment.status}</span>
                <button className="p-1 hover:bg-gray-200 rounded-full transition">
                  <EllipsisVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2">
        <img
          src="/your-avatar.png"
          alt="You"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default CommentsSection;
