"use client";

import { useState } from "react";
import { Sidebar } from "flowbite-react";
import { ReactNode } from "react";
import { BiBuoy } from "react-icons/bi";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

interface SidebarComponentProps {
  children: ReactNode;
}

export default function SidebarComponent({ children }: SidebarComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isHovered ? "w-64" : "w-16"
        } bg-white border-r`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar collapseBehavior="collapse" collapsed={!isHovered}>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiViewBoards}>
                Kanban
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiInbox}>
                Inbox
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUser}>
                Users
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiShoppingBag}>
                Products
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiArrowSmRight}>
                Sign In
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiTable}>
                Sign Up
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiChartPie}>
                Upgrade to Pro
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiViewBoards}>
                Documentation
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={BiBuoy}>
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      {/* Konten utama */}
      <div className="flex-grow bg-gray-100">{children}</div>
    </div>
  );
}
