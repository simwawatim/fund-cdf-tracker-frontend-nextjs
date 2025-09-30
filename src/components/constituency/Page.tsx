import ConstituencyTable from "@/components/constituency/Table";
import HeaderPage from "@/components/header/Header";
import Sidebar from "@/components/sidebars/SideBar";

const ConstituencyPage = () => {
  return (
    <>

    <div className="flex flex-col h-screen">
            {/* Top Header */}
            <HeaderPage />

            {/* Main content area: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 overflow-y-auto">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    < ConstituencyTable/>
                </main>
            </div>
        </div>
    </>
  )
}

export default ConstituencyPage;