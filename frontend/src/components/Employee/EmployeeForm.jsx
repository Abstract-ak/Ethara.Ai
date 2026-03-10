import { useState } from "react";
import toast from "react-hot-toast";
import { createEmployee } from "../../services/api";

const initialForm = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

const departments = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Operations",
  "Sales",
  "Support",
  "Design",
];

export default function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.employee_id.trim() ||
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.department
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await createEmployee(form);
      toast.success("Employee added successfully");
      setForm(initialForm);
      onSuccess?.();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to add employee";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID
          </label>
          <input
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            placeholder="e.g. EMP001"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. john@company.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </div>
    </form>
  );
}
