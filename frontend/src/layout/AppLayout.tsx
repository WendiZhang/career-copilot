import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  MessageCircle,
  LogIn,
  LogOut,
  User,
  Menu,
  FileSearch
} from "lucide-react";

export default function AppLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-[100dvh] bg-gray-100">

      {/* Sidebar */}
      <div
        className={`bg-black text-white p-4 flex flex-col transition-all duration-300
        ${open ? "w-64" : "w-20"}`}
      >

        {/* Top */}
        <div className="flex items-center justify-between mb-6 p-2 px-3">
          {open && (
            <h1 className="text-lg font-bold">
              Career Copilot
            </h1>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="text-white hover:text-blue-400"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 mb-6 p-2 px-3 bg-gray-900 rounded-lg">
          <User size={20} />
          {open && (
            <div className="text-sm">
              <p className="font-semibold">
                {username || "Guest"}
              </p>
              <p className="text-gray-400 text-xs">
                User
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 ${
                isActive ? "bg-gray-800 text-blue-400" : ""
              }`
            }
          >
            <LayoutDashboard size={18} />
            {open && "Dashboard"}
          </NavLink>

          <NavLink
            to="/resume-analysis"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 ${
                isActive ? "bg-gray-800 text-blue-400" : ""
              }`
            }
          >
            <FileSearch size={18} />
            {open && "AI Resume Analysis"}
          </NavLink>

          <NavLink
            to="/cover-letter"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 ${
                isActive ? "bg-gray-800 text-blue-400" : ""
              }`
            }
          >
            <FilePlus size={18} />
            {open && "Cover Letter"}
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 ${
                isActive ? "bg-gray-800 text-blue-400" : ""
              }`
            }
          >
            <MessageCircle size={18} />
            {open && "AI Chat"}
          </NavLink>

          {!username && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 text-blue-400" : ""
                }`
              }
            >
              <LogIn size={18} />
              {open && "Login"}
            </NavLink>
          )}

        </nav>

        {/* Logout */}
        {username && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-red-600 mt-4"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        )}

      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}
