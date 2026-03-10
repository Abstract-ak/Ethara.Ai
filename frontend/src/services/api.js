import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// ─── Employees ───
export const getEmployees = () => API.get("/api/employees/");
export const createEmployee = (data) => API.post("/api/employees/", data);
export const getEmployee = (id) => API.get(`/api/employees/${id}`);
export const deleteEmployee = (id) => API.delete(`/api/employees/${id}`);

// ─── Attendance ───
export const markAttendance = (data) => API.post("/api/attendance/", data);
export const getAttendanceByEmployee = (id) =>
  API.get(`/api/attendance/employee/${id}`);
export const getAttendance = (date) =>
  API.get("/api/attendance/", { params: date ? { date } : {} });

// ─── Dashboard ───
export const getDashboardStats = () =>
  API.get("/api/attendance/dashboard/stats");

export default API;
