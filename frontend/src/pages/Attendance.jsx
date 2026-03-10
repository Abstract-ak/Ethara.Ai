import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  getEmployees,
  markAttendance,
  getAttendanceByEmployee,
  getAttendance,
} from "../services/api";
import Header from "../components/Layout/Header";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

export default function Attendance() {
  const [searchParams] = useSearchParams();
  const preselectedEmployee = searchParams.get("employee") || "";

  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState(preselectedEmployee);
  const [filterDate, setFilterDate] = useState("");

  // Mark attendance form
  const [form, setForm] = useState({
    employee_id: preselectedEmployee,
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data.employees);
    } catch {
      // silently fail; employees just won't appear in dropdowns
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (selectedEmployee) {
        const res = await getAttendanceByEmployee(selectedEmployee);
        data = res.data;
      } else if (filterDate) {
        const res = await getAttendance(filterDate);
        data = res.data;
      } else {
        const res = await getAttendance();
        data = res.data;
      }
      setRecords(data.records);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load attendance records",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee, filterDate]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleMark = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.date || !form.status) {
      toast.error("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await markAttendance(form);
      toast.success("Attendance marked successfully");
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to mark attendance";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Compute present-day counts for selected employee
  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  return (
    <div>
      <Header title="Attendance" subtitle="Mark and view attendance records" />

      {/* Mark Attendance Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Mark Attendance
        </h3>
        <form onSubmit={handleMark} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              value={form.employee_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, employee_id: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} — {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Marking..." : "Mark Attendance"}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                if (e.target.value) setFilterDate("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} — {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                if (e.target.value) setSelectedEmployee("");
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {(selectedEmployee || filterDate) && (
            <button
              onClick={() => {
                setSelectedEmployee("");
                setFilterDate("");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          )}

          {/* Summary badges */}
          {records.length > 0 && (
            <div className="ml-auto flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                Present: {presentCount}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                Absent: {absentCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <Loader text="Loading attendance records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRecords} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClipboardList className="w-16 h-16" />}
          title="No attendance records"
          description="Start marking attendance for employees to see records here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((rec, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                      {rec.employee_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {rec.employee_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {rec.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rec.status === "Present"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
