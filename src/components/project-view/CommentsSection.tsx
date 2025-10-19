"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  message: string;
  status: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection = ({ comments }: CommentsSectionProps) => {
  const [replyMessages, setReplyMessages] = useState<Record<number, string>>({});

  const handleReplyChange = (id: number, value: string) => {
    setReplyMessages((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = (id: number) => {
    const message = replyMessages[id]?.trim();
    if (!message) return;
    console.log(`Reply to comment ${id}:`, message);
    setReplyMessages((prev) => ({ ...prev, [id]: "" }));
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`flex flex-col bg-white p-4 rounded-xl shadow-sm ${
        isReply ? "ml-10 mt-3 border-l-2 border-gray-200" : "mb-5"
      }`}
    >
      {/* Comment header */}
      <div className="flex items-start gap-3">
        <img
          className="w-9 h-9 rounded-full border border-gray-300"
          src={comment.avatar}
          alt={comment.user}
        />
        <div className="flex flex-col w-full leading-tight">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">{comment.user}</span>
            <span className="text-xs text-gray-500">{comment.time}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{comment.message}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">{comment.status}</span>
            <button className="p-1 hover:bg-gray-100 rounded-full transition">
              <EllipsisVertical size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Proper reply form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendReply(comment.id);
        }}
        className="mt-4 ml-12 bg-gray-50 border border-gray-200 rounded-xl p-3"
      >
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Reply to {comment.user}
        </label>
        <textarea
          rows={3}
          value={replyMessages[comment.id] || ""}
          onChange={(e) => handleReplyChange(comment.id, e.target.value)}
          placeholder="Write your reply..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="bg-green-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Reply
          </button>
        </div>
      </form>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 shadow text-black rounded-2xl p-6 flex flex-col h-[90vh]">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Comments</h2>

      <div className="overflow-y-auto pr-2 flex-1">
        {comments.map((comment) => renderComment(comment))}
      </div>

      {/* Main comment form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5 border-t pt-4 flex flex-col gap-3"
      >
        <label className="block text-sm font-semibold text-gray-700">
          Write a new comment
        </label>
        <textarea
          rows={3}
          placeholder="Add your comment..."
          className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentsSection;
