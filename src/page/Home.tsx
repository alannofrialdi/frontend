import { Card, Button, HR, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CgFolderAdd } from "react-icons/cg";
import AgTable from "../components/AgTable";
import { ModalCategory } from "../components/ModalCategory";
import { useApi } from "../context/ApiContext";
import { useSidebar } from "../context/SidebarContext";
import { ColDef } from "ag-grid-community";
import { CiTrash } from "react-icons/ci";

function Home() {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const { apiCall } = useApi();
  const { refreshSidebarCategories } = useSidebar();
  const agTableRef = useRef<any>(null);
  const username = localStorage.getItem("username");

  const fetchData = useCallback(async () => {
    try {
      const data = await apiCall("GET", "/api/categories", [], {
        params: {
          username,
        },
      });

      setRowData(data);
    } catch (error) {
      console.error(error);
    }
  }, [apiCall, username]);

  // set isMobile on mounted;
  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobileView(isMobile);
  }, []);

  // fetch data on mounted;
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRef = (ref: any) => {
    agTableRef.current = ref;
  };

  const onCloseModal = () => {
    setOpenModal(false);
    fetchData();
  };

  const updateData = useCallback(
    async (params: any) => {
      const { newValue, data } = params;

      // Update local state optimistically
      setRowData((prevData) =>
        prevData.map((row) =>
          row.id === data.id ? { ...row, category: newValue } : row
        )
      );

      try {
        await apiCall(
          "PUT",
          "/api/categories/" + data.id,
          { category: newValue },
          { params: { username } }
        );

        refreshSidebarCategories();
      } catch (error) {
        console.error("Error updating data:", error);
        fetchData(); // Revert on failure
        refreshSidebarCategories();
      }
    },
    [apiCall, username, fetchData, refreshSidebarCategories]
  );

  const deleteData = useCallback(
    async (params: any) => {
      const { data } = params;

      // Remove data locally
      setRowData((prevData) => prevData.filter((row) => row.id !== data.id));

      try {
        await apiCall(
          "DELETE",
          "/api/categories/" + data.id,
          {},
          { params: { username } }
        );
        refreshSidebarCategories();
      } catch (error) {
        console.error("Error deleting data:", error);
        fetchData(); // Revert on failure
        refreshSidebarCategories();
      }
    },
    [apiCall, username, fetchData, refreshSidebarCategories]
  );

  const columnDefs: ColDef<any>[] = useMemo(
    () => [
      {
        field: "category",
        headerName: "Category",
        minWidth: 150,
        editable: true,
        filter: "agTextColumnFilter",
        flex: 1,
      },
      {
        field: "button",
        headerName: "Delete",
        maxWidth: 150,
        sortable: false,
        cellRenderer: (params: any) => (
          <Button
            size="xs"
            type="button"
            color="red"
            className="flex items-center mt-1 justify-center"
            onClick={() => deleteData(params)}
          >
            <CiTrash size={15} className="mr-2" />
            <span>Delete</span>
          </Button>
        ),
      },
    ],
    [deleteData]
  );

  return (
    <div className="p-2">
      <Card className="max-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold max-sm:text-base">DASHBOARD</h1>
          <Tooltip content="Click untuk membuat kategori baru" placement="left">
            <Button
              color="blue"
              size={isMobileView ? "xs" : "sm"}
              className="flex items-center justify-center"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <CgFolderAdd size={isMobileView ? 15 : 20} className="mr-2" />
              <span>Category</span>
            </Button>
          </Tooltip>
        </div>
        <HR />
        <AgTable
          getRef={getRef}
          rowData={rowData}
          columnDefs={columnDefs}
          updateData={updateData}
        />
        <ModalCategory openModal={openModal} onCloseModal={onCloseModal} />
      </Card>
    </div>
  );
}

export default Home;
