import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineUsers } from "react-icons/hi";
import { getEmployees, deleteEmployee } from "../services/api";
import Header from "../components/Layout/Header";
import EmployeeForm from "../components/Employee/EmployeeForm";
import EmployeeTable from "../components/Employee/EmployeeTable";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getEmployees();
      setEmployees(data.employees);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.employee_id);
      toast.success(`Employee ${deleteTarget.employee_id} deleted`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (emp) => {
    navigate(`/attendance?employee=${emp.employee_id}`);
  };

  return (
    <div>
      <Header
        title="Employees"
        subtitle={`${employees.length} total employees`}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Employee
          </button>
        }
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Employee"
      >
        <EmployeeForm
          onSuccess={() => {
            setShowForm(false);
            fetchEmployees();
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.full_name}</strong> (
          {deleteTarget?.employee_id}
          )? This will also remove all their attendance records. This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>

      {/* Content */}
      {loading ? (
        <Loader text="Loading employees..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEmployees} />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={<HiOutlineUsers className="w-16 h-16" />}
          title="No employees yet"
          description="Get started by adding your first employee to the system."
          action={
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Add Employee
            </button>
          }
        />
      ) : (
        <EmployeeTable
          employees={employees}
          onDelete={setDeleteTarget}
          onView={handleView}
        />
      )}
    </div>
  );
}
