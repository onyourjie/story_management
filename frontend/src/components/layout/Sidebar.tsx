import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col fixed left-0 top-0 z-10">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
        <span className="text-cyan-500 font-bold text-xl tracking-wide">STORYKU</span>
      </div>
      <nav className="flex-1 py-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink
          to="/stories"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <BookOpen size={18} />
          Story Management
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
