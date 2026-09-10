import { useState } from "react";

import Sidebar from "../sidebar/Sidebar";
import CommonNavbar from "../navbar/CommonNavbar";

const SIDEBAR_STORAGE_KEY =
  "tenanthub_sidebar_collapsed";

const DashboardLayout = ({
  children,
  title,
  subtitle,
  menuItems,
  profilePath = "/enterprise/profile",
}) => {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState =
      localStorage.getItem(
        SIDEBAR_STORAGE_KEY
      );

    if (savedState === null) {
      return true;
    }

    return savedState === "true";
  });

  const handleSidebarToggle = () => {
    setCollapsed((previousState) => {
      const nextState = !previousState;

      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(nextState)
      );

      return nextState;
    });
  };

  const resolvedMenuItems = Array.isArray(
    menuItems
  )
    ? menuItems
    : [];

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={handleSidebarToggle}
        menuItems={resolvedMenuItems}
      />

      {/* Right side of dashboard */}
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">

        {/* Fixed Common Navbar */}
        <div className="absolute inset-x-0 top-0 z-50 h-20">
          <CommonNavbar
            profilePath={profilePath}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-5 pt-24 sm:px-5 sm:pb-5 sm:pt-24 lg:px-6 lg:pb-6 lg:pt-28">
          <div className="mb-5 sm:mb-6">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1.5 max-w-3xl text-xs leading-5 text-gray-500 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;