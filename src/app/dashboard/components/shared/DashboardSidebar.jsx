import React from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  CircleUserRound, 
  LayoutDashboard, 
  Mail, 
  Users, 
  Briefcase, 
  SlidersHorizontal, 
  LogOut 
} from "lucide-react";

const DashboardSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeSection,
  setActiveSection,
  user,
  logout
}) => {
  return (
    <>
      <aside
        className={`bg-[#0000] text-white p-6 flex flex-col justify-between fixed h-screen z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        }`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-satisfy">Outmail</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-white hover:text-purple-400"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div
            className="flex items-center gap-3 mb-6 cursor-pointer"
            onClick={() => {
              setActiveSection("settings");
              setIsSidebarOpen(false);
            }}
          >
            {user?.profilePicture ? (
              <Image 
                src={user.profilePicture} 
                alt="Profile" 
                width={40} 
                height={40} 
                className="rounded-full"
              />
            ) : (
              <CircleUserRound className="w-10 h-10 text-white" />
            )}
            <div>
              <p className="font-semibold">{user?.display_name || user?.name || "User"}</p>
              <span className="text-xs bg-[#2C2C2C] px-2 py-0.5 rounded text-purple-400">
                PRO
              </span>
            </div>
          </div>
          <nav className="space-y-4 mt-10">
            <a
              onClick={() => {
                setActiveSection("dashboard");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-2 transition cursor-pointer ${
                activeSection === "dashboard"
                  ? "text-purple-400 font-bold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </a>
            <a
              onClick={() => {
                setActiveSection("coldOutreach");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-2 transition cursor-pointer ${
                activeSection === "coldOutreach"
                  ? "text-purple-400 font-bold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              <Mail size={16} /> Cold Outreach
            </a>
            <a
              onClick={() => {
                setActiveSection("mentorship");
                setIsSidebarOpen(false);
              }}
              className={`block transition cursor-pointer flex items-center gap-2 ${
                activeSection === "mentorship"
                  ? "text-purple-400 font-semibold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              <Users size={18} />
              Mentorship
            </a>
            <a
              onClick={() => {
                setActiveSection("jobOpenings");
                setIsSidebarOpen(false);
              }}
              className={`block transition cursor-pointer flex items-center gap-2 ${
                activeSection === "jobOpenings"
                  ? "text-purple-400 font-semibold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              <Briefcase size={18} />
              Job Openings
            </a>
            <a
              onClick={() => {
                setActiveSection("settings");
                setIsSidebarOpen(false);
              }}
              className={`block transition cursor-pointer flex items-center gap-2 ${
                activeSection === "settings"
                  ? "text-purple-400 font-semibold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              <SlidersHorizontal size={18} />
              Settings
            </a>
          </nav>
        </div>
        <div className="mt-auto">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white hover:text-red-500 transition w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for small screens to close sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default DashboardSidebar;