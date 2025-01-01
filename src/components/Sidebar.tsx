import React, { forwardRef, useCallback, useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { HiChartPie, HiOutlineDocumentText, HiUser } from "react-icons/hi";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../hooks/useAuth";

interface SidebarComponentProps {
  children: React.ReactNode;
}

interface Category {
  category: string;
}

// Gunakan React.forwardRef
const SidebarComponent = forwardRef<any, SidebarComponentProps>(
  ({ children }: SidebarComponentProps, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const { apiCall } = useApi();
    const [categories, setCategories] = useState<Category[]>([]);
    const { user } = useAuth();
    const username = user?.user;

    const fetchData = useCallback(async () => {
      try {
        const data: Category[] = await apiCall("GET", "/api/categories", [], {
          params: { username },
        });
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }, [apiCall, username]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // Berikan akses fungsi fetchData ke ref
    React.useImperativeHandle(ref, () => ({
      fetchData,
    }));

    return (
      <div className="flex h-screen">
        <div
          className={`max-sm:hidden transition-all duration-300 ease-in-out ${
            isHovered ? "w-64" : "w-16"
          } bg-white border-r`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sidebar collapseBehavior="collapse" collapsed={!isHovered}>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/dashboard" icon={HiChartPie}>
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item href="/profile" icon={HiUser}>
                  Profile
                </Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                {categories.map((item, i) => (
                  <Sidebar.Item
                    href={`/${item.category.toLowerCase()}`}
                    icon={HiOutlineDocumentText}
                    key={i}
                  >
                    {item.category}
                  </Sidebar.Item>
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
        <div className="flex-grow bg-gray-100">{children}</div>
      </div>
    );
  }
);

export default SidebarComponent;
