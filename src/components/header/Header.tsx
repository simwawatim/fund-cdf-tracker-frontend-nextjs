import Link from "next/link";

const profileImage = "/default-profile.png"; 

const HeaderComp = () => {
    return (
        <>
           <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-black min-h-[70px] tracking-wide relative z-50">
                <div className="flex items-center justify-between w-full">
                    {/* Left Side: Logo + Title */}
                    <Link href="/home" className="flex items-center space-x-2">
                    <img
                        className="h-12 w-auto object-contain rounded-md shadow-sm"
                        src="/zambia-flag.png"
                        alt="Company Logo"
                    />
                    <span className="ml-2 text-xl font-semibold text-white">Dashboard</span>
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4 relative">
                    {/* Profile */}
                    <Link href="/profile">
                        <img
                        src={profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm cursor-pointer"
                        />
                    </Link>
                    </div>
                </div>
            </header>
        </>
    )
}

export default HeaderComp;