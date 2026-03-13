import { useNavigate } from "react-router-dom";
import { LogOut, Plus, FileCheck, Shield, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import achievrLogo from "../assets/achievr-logo.png";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 sm:py-3">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer">
            <img src={achievrLogo} alt="AchievR"
              className="h-7 sm:h-10 md:h-11 w-auto object-contain" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">

            {/* User Info */}
            <div className="text-right pr-3 lg:pr-4 border-r border-gray-200 max-w-[140px] lg:max-w-none truncate">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user?.role}
              </p>
            </div>

            {/* Home */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition whitespace-nowrap"  >
              <Home size={16} />
              <span className="hidden lg:inline">Home</span>
            </button>

            {/* Role Buttons */}
            {/* {user?.role === "student" && (
              <button
                onClick={() => navigate("/submit")}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition whitespace-nowrap"  >
                <Plus size={16} />
                <span className="hidden lg:inline">Submit Activity</span>
                <span className="lg:hidden">Submit</span>
              </button>
            )}

            {user?.role === "faculty" && (
              <button
                onClick={() => navigate("/faculty")}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition whitespace-nowrap" >
                <FileCheck size={16} />
                <span className="hidden lg:inline">Review</span>
                <span className="lg:hidden">Review</span>
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition whitespace-nowrap"
              >
                <Shield size={16} />
                <span className="hidden lg:inline">Approvals</span>
                <span className="lg:hidden">Admin</span>
              </button>
            )} */}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition whitespace-nowrap"  >
              <LogOut size={16} />
              <span className="hidden lg:inline">Logout</span>
              <span className="lg:hidden">Exit</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t pt-4 pb-3 space-y-2">

            {/* User */}
            <div className="px-1 pb-2 border-b">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>

            <MobileBtn icon={<Home size={16} />} label="Home" onClick={() => handleNavigate("/")} />

            {user?.role === "student" && (
              <MobileBtn icon={<Plus size={16} />} label="Submit Activity" onClick={() => handleNavigate("/submit")} />
            )}

            {user?.role === "faculty" && (
              <MobileBtn icon={<FileCheck size={16} />} label="Review Activities" onClick={() => handleNavigate("/faculty")} />
            )}

            {user?.role === "admin" && (
              <MobileBtn icon={<Shield size={16} />} label="Admin Panel" onClick={() => handleNavigate("/admin")} />
            )}

            <MobileBtn
              icon={<LogOut size={16} />}
              label="Logout"
              danger
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

/* Mobile Button Component */
function MobileBtn({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
        ${danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"}`}
 >
      {icon}
      {label}
    </button>
  );
}