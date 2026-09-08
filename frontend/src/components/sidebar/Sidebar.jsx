import { MdMenu } from "react-icons/md";

import Logo from "../common/Logo";
import SidebarItem from "./SidebarItem";
import { enterpriseMenuItems } from "../../config/enterpriseMenuConfig";

const Sidebar = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <aside
      className={`flex h-screen min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="shrink-0 border-b border-gray-100 p-5">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Logo className="h-11 w-auto" />
          )}

          <button
            type="button"
            onClick={setCollapsed}
            className="rounded-xl p-2 transition hover:bg-gray-100"
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            <MdMenu size={24} />
          </button>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-6">
        <div className="space-y-2">
          {enterpriseMenuItems.map((item) => (
            <SidebarItem
              key={item.title}
              {...item}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-gray-100 p-4 text-center text-xs text-gray-400">
          TenantHub HRMS v1.0
        </div>
      )}
    </aside>
  );
};

export default Sidebar;