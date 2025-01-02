"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { useApi } from "../context/ApiContext";
import { $notify } from "../utils/helper";

import { ToastContainer } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";

interface ModalCategoryProps {
  openModal: boolean;
  onCloseModal(): void;
}

export function ModalCategory(props: ModalCategoryProps) {
  const { openModal, onCloseModal } = props;
  const { refreshSidebarCategories } = useSidebar();
  const [category, setCategory] = useState<string>("");
  const [validation, setValidation] = useState<boolean>(false);
  const { apiCall } = useApi();

  const username = localStorage.getItem("username");

  const handlePostData = async () => {
    if (!category.trim()) {
      setValidation(true);
      return;
    }

    try {
      const response = await apiCall(
        "POST",
        "/api/categories",
        { category },
        {
          params: { username },
        }
      );

      const { code, message } = response;

      const notif = {
        message,
        status: code === 409 ? "validation" : "ok",
      };

      $notify(notif);

      if (code == 409) {
        return;
      }

      setCategory("");
      refreshSidebarCategories();
      onCloseModal();
    } catch (error) {
      console.error("Error posting datas:", error);
    }
  };

  return (
    <Modal
      show={openModal}
      size="md"
      onClose={() => {
        setCategory("");
        onCloseModal();
      }}
      popup
      draggable
    >
      <ToastContainer />
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="category" value="Category" />
            </div>
            <TextInput
              id="category"
              placeholder="Enter a category"
              value={category}
              onFocus={() => setValidation(false)}
              onChange={({ target }) => setCategory(target.value)}
              required
            />
            {validation ? (
              <span className="font-light text-xs text-red-500 animate-pulse">
                Category is required!
              </span>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full">
            <Button
              color="blue"
              size="sm"
              onClick={handlePostData}
              className="flex items-center justify-center"
            >
              <CiSaveDown1 size={20} className="mr-2" />
              <span>Save</span>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
