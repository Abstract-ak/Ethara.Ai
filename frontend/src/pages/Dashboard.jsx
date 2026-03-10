import { useState, useEffect, useCallback } from "react";
import {
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { getDashboardStats } from "../services/api";
import Header from "../components/Layout/Header";
import StatCard from "../components/common/StatCard";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle={`Overview for ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Employees"
          value={stats.total_employees}
          icon={<HiOutlineUsers className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          label="Present Today"
          value={stats.today_present}
          icon={<HiOutlineCheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          label="Absent Today"
          value={stats.today_absent}
          icon={<HiOutlineXCircle className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          label="Attendance Marked"
          value={stats.today_total_marked}
          icon={<HiOutlineClipboardList className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">
              Recent Attendance
            </h3>
          </div>
          {stats.recent_attendance.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">
              No attendance records yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recent_attendance.map((rec, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">
                        <span className="font-medium text-indigo-600">
                          {rec.employee_id}
                        </span>{" "}
                        <span className="text-gray-500">
                          {rec.employee_name}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {rec.date}
                      </td>
                      <td className="px-6 py-3">
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
          )}
        </div>

        {/* Present Days per Employee */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">
              Present Days per Employee
            </h3>
          </div>
          {Object.keys(stats.present_days_per_employee).length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">
              No present records yet
            </p>
          ) : (
            <div className="p-6 space-y-3">
              {Object.entries(stats.present_days_per_employee).map(
                ([empId, days]) => (
                  <div
                    key={empId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {empId}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                      {days} day{days !== 1 ? "s" : ""} present
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
