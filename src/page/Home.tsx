import { Card, Button, HR } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CgFolderAdd } from "react-icons/cg";
import AgTable from "../components/AgTable";
import { ModalCategory } from "../components/ModalCategory";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [refreshData, setRefreshData] = useState([]);
  const { apiCall } = useApi();
  const { user } = useAuth();
  const agTableRef = useRef<any>(null);
  const username = user?.user;

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobileView(isMobile);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await apiCall("GET", "/api/categories", [], {
        params: {
          username,
        },
      });

      setRefreshData(data);
    } catch (error) {
      console.error(error);
    }
  }, [apiCall, username]);

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

  return (
    <div className="p-2">
      <Card className="min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold max-sm:text-base">DASHBOARD</h1>
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
        </div>
        <HR />
        <AgTable getRef={getRef} refreshData={refreshData} />
        <ModalCategory openModal={openModal} onCloseModal={onCloseModal} />
      </Card>
    </div>
  );
}

export default Home;
