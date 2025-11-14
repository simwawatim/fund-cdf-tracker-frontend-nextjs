import { useState } from "react";
import SidebarComp from "../sidebars/SideBar";
import HeaderComp from "../header/Header";
import ChangePasswordForm from "../../components/settings/Table"


const SettingsPageComp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <HeaderComp isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SidebarComp isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-white lg:ml-[250px]">
          <ChangePasswordForm />
        </main>
      </div>
    </div>
  );
};

export default SettingsPageComp;
