export interface Task {
  id?: number;
  categoryId?: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt?: string;
  updatedAt?: string;
}
