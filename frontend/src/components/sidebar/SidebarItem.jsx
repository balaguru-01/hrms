import { NavLink } from "react-router-dom";

const SidebarItem = ({
  icon: Icon,
  title,
  path,
  collapsed,
}) => {
  return (
    <NavLink
      to={path}
      end
      title={collapsed ? title : undefined}
      className={({ isActive }) =>
        `flex items-center rounded-xl font-medium transition-all duration-300 ${
          collapsed
            ? "h-14 justify-center"
            : "gap-4 px-4 py-3"
        } ${
          isActive
            ? "bg-green-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-green-50 hover:text-green-700"
        }`
      }
    >
      <span className="flex items-center justify-center text-2xl">
        <Icon />
      </span>

      {!collapsed && (
        <span className="text-[15px]">
          {title}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;