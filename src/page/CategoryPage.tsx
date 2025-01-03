import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  TextInput,
  Radio,
  Textarea,
  Card,
  HR,
  Datepicker,
} from "flowbite-react";
import axios from "axios";
import { Task } from "../interface/Task";
import { ColDef } from "ag-grid-community";
import AgTable from "../components/AgTable";
import { CiEdit, CiTrash, CiCirclePlus } from "react-icons/ci";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { $notify } from "../utils/helper";
import { useApi } from "../context/ApiContext";

const TaskPage: React.FC<{ categoryId: number; categoryName: string }> = ({
  categoryId,
  categoryName,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [alerts, setAlerts] = useState<{ [key: string]: string }>({});
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const { apiCall } = useApi();
  const userIdString = localStorage.getItem("userId");

  if (!userIdString) {
    throw new Error("User ID not found in localStorage");
  }

  const userId: number = parseInt(userIdString);

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/tasks`, {
        params: { categoryId, userId },
      });

      const formattedTasks = response.data.map((task: any) => ({
        ...task,
        deadline: moment(task.deadline).format("DD MMM YYYY, HH:mm"),
        countdown: moment(task.deadline).diff(task.updatedAt, "days"),
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, [categoryId, apiBaseUrl, userId]);

  const handleDateChange = async (
    value: Date | null,
    type: "start" | "end"
  ) => {
    console.log(value);
    console.log(typeof value);
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    console.log(apiBaseUrl);
    try {
      const response = await apiCall("GET", `/api/tasks/filterbydate`, null, {
        params: {
          startDate,
          endDate,
          userId,
        },
      });

      const formattedTasks = response.map((task: any) => ({
        ...task,
        deadline: moment(task.deadline).format("DD MMM YYYY, HH:mm"),
        countdown: moment(task.deadline).diff(task.updatedAt, "days"),
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setCurrentTask(null);
    setAlerts({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAlerts((prev) => ({ ...prev, [name]: "" }));
    setCurrentTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAlerts((prev) => ({ ...prev, [name]: "" }));
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
    if (!currentTask)
      return $notify({
        message: "Please fill all fields",
        status: "error",
      });

    const newAlerts: { [key: string]: string } = {};

    if (!currentTask.title) {
      newAlerts.title = "Task title cannot be empty";
    } else if (validateTitle(currentTask.title) && !currentTask.id) {
      newAlerts.title = `A task with the title '${currentTask.title}' already exists.`;
    }

    if (!currentTask.deadline) {
      newAlerts.deadline = "Please fill in the deadline";
    }

    if (!currentTask.priority) {
      newAlerts.priority = "Please select a priority";
    }

    if (!currentTask.status) {
      newAlerts.status = "Please select a status";
    }

    if (Object.keys(newAlerts).length > 0) {
      setAlerts(newAlerts);
      return;
    }

    try {
      if (currentTask.id) {
        currentTask.deadline = moment(currentTask.deadline).format(
          "YYYY-MM-DDTHH:mm:ss.SSS"
        );
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

  const autoSizeStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 150,
    columnLimits: [
      {
        colId: "description",
        minWidth: 600,
      },
      {
        colId: "actions",
        minWidth: 200,
      },
    ],
  };

  const rowClassRules = {
    "rag-green": (params: any) => params.data.status === "COMPLETED",
    "rag-red": (params: any) => parseInt(params.data.countdown) < 0,
  };

  const columns: ColDef<any>[] = [
    { headerName: "Title", field: "title", sortable: true, filter: true },
    { headerName: "Priority", field: "priority", sortable: true, filter: true },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellClassRules: {
        "green-text": (params) => params.value === "COMPLETED",
      },
    },
    {
      headerName: "Description",
      field: "description",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created",
      field: "createdAt",
      sortable: true,
      valueFormatter: (params) => {
        return moment(params.value).format("DD MMM YYYY, HH:mm");
      },
    },
    {
      headerName: "Last Updated",
      field: "updatedAt",
      sortable: true,

      valueFormatter: (params) => {
        return moment(params.value).format("DD MMM YYYY, HH:mm");
      },
    },
    {
      headerName: "Deadline",
      field: "deadline",
      sortable: true,

      valueFormatter: (params) => {
        return moment(params.value).format("DD MMM YYYY, HH:mm");
      },
    },
    {
      headerName: "Countdown (day)",
      field: "countdown",
      sortable: true,
    },
    {
      headerName: "Actions",
      field: "actions",
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
          {params.data.status !== "COMPLETED" ? (
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
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-2">
      <ToastContainer />
      <Card className="min-h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>

          <HR />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <h1>Start Date</h1>
                <Datepicker
                  value={startDate}
                  onChange={(value) => handleDateChange(value, "start")}
                />
              </div>
              <div>
                <h1>End Date</h1>
                <Datepicker
                  value={endDate}
                  onChange={(value) => handleDateChange(value, "end")}
                />
              </div>
            </div>
            <Button onClick={handleModalToggle} className="mt-5">
              <CiCirclePlus size={20} className="mr-2" />
              <span>Add Task</span>
            </Button>
          </div>

          <HR />

          <AgTable
            rowData={tasks}
            columnDefs={columns}
            isPagination={true}
            paginationPageSize={10}
            rowClassRules={rowClassRules}
            autoSizeStrategy={autoSizeStrategy}
          />

          <Modal show={isModalOpen} onClose={handleModalToggle}>
            <Modal.Header>
              {currentTask?.id ? "Edit Task" : "Add Task"}
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                <TextInput
                  name="title"
                  value={currentTask?.title || ""}
                  onChange={handleInputChange}
                  placeholder="Task Title"
                  color={alerts.title ? "failure" : undefined}
                  helperText={
                    alerts.title && (
                      <span className="text-red-600 text-sm">
                        {alerts.title}
                      </span>
                    )
                  }
                />
              </div>
              <div className="mb-4">
                <Textarea
                  name="description"
                  value={currentTask?.description || ""}
                  onChange={handleInputChange}
                  placeholder="Task Description"
                />
              </div>
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
                {alerts.priority && (
                  <span className="text-red-600 text-sm">
                    {alerts.priority}
                  </span>
                )}
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
                {alerts.status && (
                  <span className="text-red-600 text-sm">{alerts.status}</span>
                )}
              </div>
              <div className="mb-4">
                <TextInput
                  name="deadline"
                  type="datetime-local"
                  value={
                    currentTask?.deadline
                      ? moment(currentTask.deadline).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={handleInputChange}
                  color={alerts.deadline ? "failure" : undefined}
                  helperText={
                    alerts.deadline && (
                      <span className="text-red-600 text-sm">
                        {alerts.deadline}
                      </span>
                    )
                  }
                />
              </div>
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
