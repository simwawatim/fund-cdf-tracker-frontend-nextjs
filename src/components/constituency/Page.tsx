import ConstituencyTable from "@/components/constituency/Table";
import HeaderPage from "@/components/header/Header";
import Sidebar from "@/components/sidebars/SideBar";

const ConstituencyPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <HeaderPage />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden md:block md:w-64 overflow-y-auto bg-gray-50 border-r">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-white">
          <ConstituencyTable />
        </main>
      </div>
    </div>
  );
};

export default ConstituencyPage;
