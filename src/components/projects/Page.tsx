import SidebarComp from "../sidebars/SideBar";
import HeaderComp from "../header/Header";
import ProjectsTable from "./Table";

const ProjectsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Header */}
      <HeaderComp />

      {/* Main content area: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 overflow-y-auto">
          <SidebarComp />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <ProjectsTable />
        </main>
      </div>
    </div>
  );
}

export default ProjectsPage;