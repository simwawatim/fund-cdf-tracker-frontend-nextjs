"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileService from "../../api/profile/profile";

const HeaderComp = () => {
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await ProfileService.getProfilePictureById(14);
        const profilePic =
          (res as any).data?.profile_picture ?? (res as any).profile_pic;

        (res.status === "success" && profilePic)
          setProfileImage(profilePic);
 
      } catch (error) {
        console.error("Failed to load profile image:", error);
        setProfileImage("/default-profile.png");
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-black text-white min-h-[70px] tracking-wide z-30 relative">
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Logo + Title */}
        <Link href="/home" className="flex items-center space-x-2">
          
        </Link>

        {/* Right Side: Profile */}
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm cursor-pointer object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderComp;
