"use client";

import { useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import "../index.css";

import { themeQuartz } from "ag-grid-community";

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz.withParams({
  accentColor: "#087AD1",
  backgroundColor: "#FFFFFF",
  borderColor: "#D7E2E6",
  borderRadius: 2,
  browserColorScheme: "light",
  cellHorizontalPaddingScale: 0.7,
  chromeBackgroundColor: {
    ref: "backgroundColor",
  },
  columnBorder: false,
  fontFamily: {
    googleFont: "Poppins",
  },
  fontSize: 13,
  foregroundColor: "#555B62",
  headerBackgroundColor: "#FFFFFF",
  headerFontSize: 13,
  headerFontWeight: 400,
  headerTextColor: "#84868B",
  rowBorder: true,
  rowVerticalPaddingScale: 1.2,
  sidePanelBorder: true,
  spacing: 6,
  wrapperBorder: false,
  wrapperBorderRadius: 2,
});

ModuleRegistry.registerModules([AllCommunityModule]);

const AgTable = ({
  getRef,
  rowData = [],
  isPagination,
  columnDefs,
  updateData,
  paginationPageSize,
  autoSizeStrategy,
  rowClassRules,
}: {
  getRef?: (ref: any) => void;
  rowData?: Array<any>;
  isPagination?: boolean;
  columnDefs: Array<any>;
  updateData?: (params: any) => Promise<void>;
  paginationPageSize?: number;
  autoSizeStrategy?: any;
  rowClassRules?: any;
}) => {
  const gridRef = useRef<any>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: 740 }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  useEffect(() => {
    if (getRef && gridRef.current) {
      getRef(gridRef.current);
    }
  }, [getRef]);

  return (
    <div style={containerStyle} className="max-sm:hidden">
      <div id="grid-wrapper" style={{ width: "100%", height: "95%" }}>
        <div style={gridStyle}>
          <AgGridReact<any>
            ref={gridRef}
            autoSizeStrategy={autoSizeStrategy}
            theme={myTheme}
            rowData={rowData}
            columnDefs={columnDefs}
            onCellValueChanged={updateData}
            rowClassRules={rowClassRules}
            pagination={isPagination}
            paginationPageSize={paginationPageSize}
          />
        </div>
      </div>
    </div>
  );
};

export default AgTable;
