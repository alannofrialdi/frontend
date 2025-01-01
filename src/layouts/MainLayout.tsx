import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/Sidebar";
import { useRef } from "react";
import { SidebarProvider } from "../context/SidebarContext";

export default function MainLayout() {
  const sidebarRef = useRef<any>(null);

  // Function to trigger sidebar fetching
  const refreshSidebarCategories = () => {
    console.log("refreshed");

    if (sidebarRef.current) {
      sidebarRef.current.fetchData();
    }
  };

  return (
    <SidebarProvider refreshSidebarCategories={refreshSidebarCategories}>
      <SidebarComponent ref={sidebarRef}>
        <Outlet />
      </SidebarComponent>
    </SidebarProvider>
  );
}
