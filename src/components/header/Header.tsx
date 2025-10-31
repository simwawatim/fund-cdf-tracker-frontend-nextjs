"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileService from "../../api/profile/profile";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const HeaderComp = ({ isOpen, toggleSidebar }: HeaderProps) => {
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await ProfileService.getProfilePictureById(14);
        const profilePic =
          (res as any).data?.profile_picture ?? (res as any).profile_pic;

        if (res.status === "success" && profilePic) setProfileImage(profilePic);
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-black text-white min-h-[70px] relative z-30">
      {/* Mobile view */}
      <div className="flex items-center justify-between w-full lg:hidden">
        {/* Hamburger */}
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* System Name */}
        <div className="text-xl font-bold">CDF System</div>

        {/* Profile */}
        <Link href="/profile">
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm object-cover"
          />
        </Link>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex items-center justify-between w-full lg:ml-[250px]">
        <Link href="/home" className="text-xl font-bold">
          CDF System
        </Link>

        <Link href="/profile">
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm cursor-pointer object-cover"
          />
        </Link>
      </div>
    </header>
  );
};

export default HeaderComp;
