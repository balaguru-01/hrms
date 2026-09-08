import { useState } from "react";

import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../navbar/TopNavbar";

const SIDEBAR_STORAGE_KEY =
  "tenanthub_sidebar_collapsed";

const DashboardLayout = ({
  children,
  title,
  subtitle,
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

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden overscroll-none bg-gray-100">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={handleSidebarToggle}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <TopNavbar />
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
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