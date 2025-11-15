"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import ProfileService from "../../api/profile/profile";

interface Comment {
  id: number;
  user: string;
  avatar?: string;
  time: string;
  message: string;
  status: string;
  user_id: number; 
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection = ({ comments }: CommentsSectionProps) => {
  const [avatars, setAvatars] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchAvatars = async () => {
      const newAvatars: Record<number, string> = {};

      await Promise.all(
        comments.map(async (comment) => {
          if (!comment.user_id) return;

          try {
            const res = await ProfileService.getProfilePictureById(comment.user_id);
            newAvatars[comment.user_id] =
              res.status === "success" && res.profile_pic
                ? res.profile_pic
                : "/default-profile.png";
          } catch (err) {
            console.error(`Failed to fetch avatar for user ${comment.user_id}:`, err);
            newAvatars[comment.user_id] = "/default-profile.png";
          }
        })
      );

      setAvatars(newAvatars);
    };

    if (comments.length > 0) fetchAvatars();
  }, [comments]);

  return (
    <div className="bg-gray-100 shadow text-black rounded-2xl p-4 flex flex-col h-[90vh]">
      <h2 className="text-base font-semibold mb-3 text-gray-800">Comments</h2>

      <div className="overflow-y-auto pr-2 flex-1">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm italic">No comments yet.</p>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-2 p-3 mb-3 bg-white shadow-sm rounded-xl"
          >
            <img
              src={avatars[comment.user_id] || "/default-profile.png"}
              alt={comment.user}
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">{comment.user}</span>
                <span className="text-[10px] text-gray-500">{comment.time}</span>
              </div>

              <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{comment.message}</p>

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

    </div>
  );
};

export default CommentsSection;
