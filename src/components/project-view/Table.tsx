const ProjectViewTable = () => {
  return (
    <>
      {/* First Row */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        {/* 8/12 section */}
            <div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col flex-[8] space-y-6">
            {/* Header: Project ID/Name and Status */}
            <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-900 font-semibold text-lg">Lusaka Water Project</p>
                <p className="text-gray-500 text-sm">
                    Oct 01, 2025 – Mar 01, 2026
                </p>
                </div>

                <div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                    "planned" === "planned" ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200" : ""
                }`}>
                    🕒 Planned
                </span>
                </div>

                <button className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition">
                <svg
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                Update
                </button>
            </div>

            {/* Project Description */}
            <div className="border-t pt-4">
                <p className="text-gray-900 font-semibold text-lg mb-2">Description</p>
                <p className="text-gray-700 text-sm">Water supply improvement</p>
            </div>

            {/* Project Details Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-gray-200">
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Project Type</td>
                    <td className="py-2 px-4 text-gray-900">Infrastructure</td>
                    </tr>
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Allocated Budget</td>
                    <td className="py-2 px-4 text-gray-900">ZMW 5,000,000</td>
                    </tr>
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Beneficiaries</td>
                    <td className="py-2 px-4 text-gray-900">5,000</td>
                    </tr>
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Project Manager</td>
                    <td className="py-2 px-4 text-gray-900">John Doe</td>
                    </tr>
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Funding Source</td>
                    <td className="py-2 px-4 text-gray-900">CDF</td>
                    </tr>
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Location</td>
                    <td className="py-2 px-4 text-gray-900">Lusaka</td>
                    </tr>
                    <tr>
                    <td className="py-2 px-4 font-medium text-gray-700">Remarks</td>
                    <td className="py-2 px-4 text-gray-900">Urgent priority</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>



        {/* 4/12 section */}
        <div className="bg-gray-100 shadow-md text-black rounded-2xl p-6 flex flex-col flex-[4] space-y-6">
            {/* Header */}
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

            {/* Profile */}
            <div className="flex items-center gap-4">
                <img
                className="w-12 h-12 rounded-full border border-gray-300"
                src="/default-profile.png"
                alt="Avatar of Jonathan Reinink"
                />
                <div>
                <p className="text-gray-900 font-medium">Jonathan Reinink</p>
                <p className="text-gray-500 text-sm">Aug 18</p>
                </div>
            </div>

            {/* Contact Info */}
            <div>
                <p className="text-gray-900 font-semibold text-lg mb-3 border-b pb-1">
                Contact Info
                </p>
                <div className="bg-gray-100 clearspace-y-1">
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Email:</span> example@email.com
                </p>
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Mobile:</span> +123 456 789
                </p>
                </div>
            </div>

            {/* Constituency Info */}
            <div>
                <p className="text-gray-900 font-semibold text-lg mb-3 border-b pb-1">
                Constituency Info
                </p>
                <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Name:</span> Example Constituency
                </p>
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Role:</span> Representative
                </p>
                </div>
            </div>
        </div>

      </div>

      {/* Second Row */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
        {/* 8/12 section */}
        <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 flex flex-col justify-between flex-[8]">
          Down Left (8/12)
        </div>

        {/* 4/12 section */}
        <div className="bg-gray-100 shadow text-black rounded-2xl p-6 h-96 flex flex-col justify-between flex-[4]">
          Down Right (4/12)
        </div>
      </div>
    </>
  );
};

export default ProjectViewTable;
