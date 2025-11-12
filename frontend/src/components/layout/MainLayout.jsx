import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSelector } from "react-redux";

const MainLayout = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? "80px" : "256px";

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {isAuthenticated && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}

      <div
        className="flex-grow min-h-screen transition-all duration-300"
        style={{ marginLeft: isAuthenticated ? sidebarWidth : "0" }}
      >
        {isAuthenticated && <Header onToggleSidebar={toggleSidebar} />}
        <main className="p-6 pt-24 min-h-[calc(100vh-80px)]">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
