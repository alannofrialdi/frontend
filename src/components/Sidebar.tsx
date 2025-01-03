import {
  forwardRef,
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import { Checkbox, Sidebar } from "flowbite-react";
import { HiChartPie, HiOutlineDocumentText, HiUser } from "react-icons/hi";
import { useApi } from "../context/ApiContext";

interface SidebarComponentProps {
  children: React.ReactNode;
}

interface Category {
  category: string;
}

const SidebarComponent = forwardRef<any, SidebarComponentProps>(
  ({ children }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFixed, setIsFixed] = useState(
      JSON.parse(localStorage.getItem("fixedSidebar") || "false")
    );
    const [categories, setCategories] = useState<Category[]>([]);
    const { apiCall } = useApi();
    const username = localStorage.getItem("username");

    // Fetch categories
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

    useImperativeHandle(ref, () => ({
      fetchData,
    }));

    // Handle fixed sidebar toggle
    const handleFixedSidebar = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      localStorage.setItem("fixedSidebar", JSON.stringify(checked));
      setIsFixed(checked);
    };

    return (
      <div className="flex h-screen overflow-hidden">
        <div
          className={`max-sm:hidden transition-all duration-300 ease-in-out ${
            isHovered || isFixed ? "w-64" : "w-16"
          } bg-gray-100 border-r overflow-y-auto`}
          onMouseEnter={() => !isFixed && setIsHovered(true)}
          onMouseLeave={() => !isFixed && setIsHovered(false)}
        >
          <Sidebar
            collapseBehavior="collapse"
            collapsed={!isHovered && !isFixed}
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <div className="mb-2 flex items-center ml-3">
                  <Checkbox
                    id="fixed"
                    checked={isFixed}
                    onChange={handleFixedSidebar}
                    className="hover:cursor-pointer"
                  />
                  {(isHovered || isFixed) && (
                    <label htmlFor="fixed" className="ml-4">
                      Fixed Sidebar
                    </label>
                  )}
                </div>
              </Sidebar.ItemGroup>
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
