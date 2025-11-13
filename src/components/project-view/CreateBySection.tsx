"use client";

import { EllipsisVertical } from "lucide-react";

interface SidebarInfoProps {
  creator: {
    name: string;
    avatar?: string | null;
    date: string;
    email?: string | null;
    mobile?: string | null;
    constituency: {
      name: string;
      role?: string | null;
    };
  };
}

const CreatedByInfo = ({ creator }: SidebarInfoProps) => (
  <div className="bg-gray-100 shadow-md text-black rounded-2xl p-6 flex flex-col space-y-6 max-h-[600px] overflow-y-auto self-start">
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
        src={creator.avatar ?? undefined}
        alt="Avatar"
      />
      <div>
        <p className="text-gray-900 font-medium">{creator.name}</p>
        <p className="text-gray-500 text-sm">{creator.date}</p>
      </div>
    </div>

    <div>
      <p className="text-gray-900 font-semibold text-lg mb-3">
        Contact Info
      </p>
      <p className="text-gray-700 text-sm">
        <span className="font-medium">Email:</span> {creator.email}
      </p>
      <p className="text-gray-700 text-sm">
        <span className="font-medium">Mobile:</span> {creator.mobile}
      </p>
    </div>

    <div>
      <p className="text-gray-900 font-semibold">
        Constituency Info
      </p>
      <p className="text-gray-700 text-sm">
        <span className="font-medium">Name:</span> {creator.constituency.name}
      </p>
      <p className="text-gray-700 text-sm">
        <span className="font-medium">Role:</span> {creator.constituency.role}
      </p>
    </div>
  </div>
);

export default CreatedByInfo;
