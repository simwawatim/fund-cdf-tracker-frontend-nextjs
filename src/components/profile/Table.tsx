import ProjectsTable from "../projects/Table";
import ProfileProject from "./ProfileProject";

const TableProfile = () => {
  const stats = [
    { title: "Total Projects", value: 48, change: "+12%", positive: true },
    { title: "Completed Projects", value: 30, change: "+8%", positive: true },
    { title: "Ongoing Projects", value: 12, change: "-5%", positive: false },
    { title: "Total Budget Allocated", value: "K25,000,000", change: "+20%", positive: true },
  ];

  return (

    <> 
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Profile Card */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-gray-100 shadow rounded-2xl p-6 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Profile</h2>
            <div className="flex flex-col items-center mb-6">
              <img
                src="/default-profile.png"
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h3 className="text-lg font-medium text-black">Helene Engels</h3>
              <span className="text-black text-sm">PRO Account</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left Info */}
              <div className="space-y-4">
                <dl>
                  <dt className="font-semibold text-black">Email</dt>
                  <dd className="text-black">helene@example.com</dd>
                </dl>

                <dl>
                  <dt className="font-semibold text-black">Home Address</dt>
                  <dd className="text-black">
                    2 Miles Drive, NJ 071, New York, USA
                  </dd>
                </dl>
              </div>

              {/* Right Info */}
              <div className="space-y-4">
                <dl>
                  <dt className="font-semibold text-black">Phone</dt>
                  <dd className="text-black">+1234 567 890 / +12 345 678</dd>
                </dl>

                <dl>
                  <dt className="font-semibold text-black">Favorite Pick-up Point</dt>
                  <dd className="text-black">
                    Herald Square, 2, New York, USA
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-green-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-800"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Right CDF Stats Card */}
      <div className="w-full lg:flex-1">
        <div className="bg-gray-100 shadow rounded-2xl p-6 h-full">
          <h2 className="text-xl font-semibold mb-6 text-black">CDF Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-b border-gray-700 py-6">
            {stats.map((item, index) => (
              <div key={index} className="flex flex-col">
                <h3 className="mb-2 text-gray-400">{item.title}</h3>
                <span className="flex items-center text-2xl font-bold text-black">
                  {item.value}
                  <span
                    className={`ml-2 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                      item.positive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                    }`}
                  >
                    {item.change}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      
      </div>


    </div>

    <div className="card shadow-sm rounded-3">
        <div className="card-body">
          <ProfileProject />
        </div>
    </div>

    </>
  );
};

export default TableProfile;
