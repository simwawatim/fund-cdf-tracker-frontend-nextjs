import HeaderComp from "../header/Header";
import Sidebar from "../sidebars/SideBar";
import ProjectViewTable from "./Table";

const ProjectViewPage = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Top Header */}
            <HeaderComp />

            {/* Main content area: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 overflow-y-auto">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <ProjectViewTable/>
                </main>
            </div>
        </div>
    );
}

export default ProjectViewPage;