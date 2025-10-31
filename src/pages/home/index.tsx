import { useState } from "react";
import HomePage from "@/components/home/home";
import HeaderPage from "@/components/header/Header";
import Sidebar from "@/components/sidebars/SideBar";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <HeaderPage isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-white lg:ml-[250px]">
          <HomePage />
        </main>
      </div>
    </div>
  );
};

export default Home;
