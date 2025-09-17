import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          user={user}
          onLogout={logout}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <Outlet context={{ onMenuClick: handleMenuClick, user, onLogout: logout }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;