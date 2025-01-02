import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  TextInput,
  Radio,
  Alert,
  Textarea,
  Card,
} from "flowbite-react";
import axios from "axios";
import { Task } from "../interface/Task";
import { ColDef } from "ag-grid-community";
import AgTable from "../components/AgTable";
import { CiEdit, CiTrash } from "react-icons/ci";

const TaskPage: React.FC<{ categoryId: number; categoryName: string }> = ({
  categoryId,
  categoryName,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [alert, setAlert] = useState<string>("");

  const userIdString = localStorage.getItem("userId");

  if (!userIdString) {
    throw new Error("User ID not found in localStorage");
  }

  const userId: number = parseInt(userIdString);

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";

  // Fetch tasks by category
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/tasks`, {
        params: { categoryId, userId },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, [categoryId, apiBaseUrl, userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setCurrentTask(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateTitle = (title: string): boolean => {
    return tasks.some(
      (task) => task.title.toLowerCase() === title.toLowerCase()
    );
  };

  const handleSubmit = async () => {
    if (!currentTask || !currentTask.title || !currentTask.priority) {
      setAlert("Title and Priority are required.");
      return;
    }

    if (validateTitle(currentTask.title) && !currentTask.id) {
      setAlert("A task with this title already exists.");
      return;
    }

    try {
      if (currentTask.id) {
        await axios.put(
          `${apiBaseUrl}/api/tasks/${currentTask.id}`,
          currentTask
        );
      } else {
        await axios.post(`${apiBaseUrl}/api/tasks`, {
          ...currentTask,
          categoryId,
          userId,
        });
      }
      fetchTasks();
      handleModalToggle();
      setAlert("");
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const columns: ColDef<any>[] = [
    { headerName: "Title", field: "title", sortable: true, filter: true },
    { headerName: "Priority", field: "priority", sortable: true, filter: true },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    {
      headerName: "Description",
      field: "description",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      headerClass: "text-center", // Tambahkan kelas untuk mengatur teks di tengah
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            type="button"
            className="flex items-center my-1 justify-center"
            onClick={() => handleEditTask(params.data)}
            color="yellow"
          >
            <CiEdit size={15} className="mr-2" />
            <span>Edit</span>
          </Button>
          <Button
            size="xs"
            type="button"
            color="red"
            className="flex items-center my-1 justify-center"
            onClick={() => handleDeleteTask(params.data.id)}
          >
            <CiTrash size={15} className="mr-2" />
            <span>Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2">
      <Card className="min-h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>

          {alert && <Alert color="failure">{alert}</Alert>}

          <Button onClick={handleModalToggle} className="mb-4">
            Add Task
          </Button>

          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgTable
              rowData={tasks}
              columnDefs={columns}
              isPagination={true}
              paginationPageSize={10}
            />
          </div>

          {/* Modal for Add/Edit Task */}
          <Modal show={isModalOpen} onClose={handleModalToggle}>
            <Modal.Header>
              {currentTask?.id ? "Edit Task" : "Add Task"}
            </Modal.Header>
            <Modal.Body>
              <TextInput
                name="title"
                value={currentTask?.title || ""}
                onChange={handleInputChange}
                placeholder="Task Title"
                className="mb-4"
              />
              <Textarea
                name="description"
                value={currentTask?.description || ""}
                onChange={handleInputChange}
                placeholder="Task Description"
                className="mb-4"
              />
              <div className="mb-4">
                <p className="font-medium mb-2">Priority:</p>
                {["LOW", "MEDIUM", "HIGH"].map((priority) => (
                  <div key={priority} className="mb-2 flex items-center">
                    <Radio
                      id={priority}
                      name="priority"
                      value={priority}
                      checked={currentTask?.priority === priority}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    <label htmlFor={priority}>{priority}</label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Status:</p>
                {["PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
                  <div key={status} className="mb-2 flex items-center">
                    <Radio
                      id={status}
                      name="status"
                      value={status}
                      checked={currentTask?.status === status}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    <label htmlFor={status}>{status}</label>
                  </div>
                ))}
              </div>
              <TextInput
                name="deadline"
                type="datetime-local"
                value={currentTask?.deadline || ""}
                onChange={handleInputChange}
                className="mb-4"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleSubmit}>
                {currentTask?.id ? "Update" : "Add"}
              </Button>
              <Button color="gray" onClick={handleModalToggle}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Card>
    </div>
  );
};

export default TaskPage;
