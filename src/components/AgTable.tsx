"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { useApi } from "../context/ApiContext";
import { CiTrash } from "react-icons/ci";

import { useAuth } from "../hooks/useAuth";
import "../index.css";
import { Button } from "flowbite-react";
import { useSidebar } from "../context/SidebarContext";

// Register Ag-Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  id: number;
  category: string;
}

const AgTable = ({
  getRef,
  refreshData,
}: {
  getRef(ref: any): void;
  refreshData: Array<RowData>;
}) => {
  const gridRef = useRef<any>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: 600 }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const { refreshSidebarCategories } = useSidebar();
  const { apiCall } = useApi();
  const { user } = useAuth();
  const username = user?.user;

  const [rowData, setRowData] = useState<RowData[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response: RowData[] = await apiCall(
        "GET",
        "/api/categories",
        {},
        { params: { username } }
      );
      setRowData(response || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiCall, username]);

  useEffect(() => {
    fetchData();
    console.log(refreshData);
    setRowData(refreshData);
  }, [fetchData, refreshData]);

  useEffect(() => {
    if (getRef) {
      getRef(gridRef.current);
    }
  }, [getRef]);

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
    [deleteData] // Pass deleteData as a dependency
  );

  return (
    <div style={containerStyle} className="max-sm:hidden">
      <div id="grid-wrapper" style={{ width: "100%", height: "100%" }}>
        <div style={gridStyle}>
          <AgGridReact<RowData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            onCellValueChanged={updateData}
          />
        </div>
      </div>
    </div>
  );
};

export default AgTable;
