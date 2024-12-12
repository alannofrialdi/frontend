import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/Sidebar";

export default function MainLayout() {
  return (
    <SidebarComponent>
      <Outlet />
    </SidebarComponent>
  );
}
