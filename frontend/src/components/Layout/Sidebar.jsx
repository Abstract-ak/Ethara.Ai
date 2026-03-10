import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineClipboardList,
} from "react-icons/hi";

const links = [
  { to: "/", label: "Dashboard", icon: HiOutlineHome },
  { to: "/employees", label: "Employees", icon: HiOutlineUsers },
  { to: "/attendance", label: "Attendance", icon: HiOutlineClipboardList },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">HRMS Lite</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Human Resource Management
        </p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
