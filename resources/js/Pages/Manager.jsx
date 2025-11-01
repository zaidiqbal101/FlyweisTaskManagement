import React, { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  PlusCircle,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  PauseCircle,
} from "lucide-react";

const Manager = ({ employees: initialEmployees, tasks: initialTasks, clients: initialClients, flash }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [employees, setEmployees] = useState(initialEmployees || []);
  const [clients, setClients] = useState(initialClients || []);
  const [filter, setFilter] = useState({ category: "", client: "" });

  const [newTask, setNewTask] = useState({
    task: "",
    employeeId: "",
    client: "",
    due: "",
    expectedTimeline: "",
  });

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    category: "",
    subCategory: "",
    manager: "",
    password: "", // <-- NEW: password field
  });

  const [newClient, setNewClient] = useState("");

  // Predefined categories
  const categories = [
    "Frontend Developers",
    "Backend Developers",
    "Full Stack Developers",
    "QA Engineers",
    "DevOps",
    "UI/UX Designers",
    "Project Managers",
  ];

  // Dynamic unique categories from employees
  const availableCategories = useMemo(() => {
    return [...new Set(employees.map(e => e.category).filter(Boolean))].sort();
  }, [employees]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const emp = employees.find((e) => e.id === t.employeeId);
      const catMatch = !filter.category || emp?.category === filter.category;
      const clientMatch = !filter.client || t.client === filter.client;
      return catMatch && clientMatch;
    });
  }, [tasks, employees, filter]);

  const getEmployeeName = (task, employees) =>
    employees.find((e) => e.id === task.employeeId)?.name || "Unknown";

  const getEmployeeCategory = (task, employees) =>
    employees.find((e) => e.id === task.employeeId)?.category || "";

  // Add Task
  const handleAddTask = () => {
    if (newTask.task && newTask.employeeId && newTask.client && newTask.due) {
      router.post(
        "/manager/add-task",
        {
          task: newTask.task,
          employee_id: newTask.employeeId,
          client: newTask.client,
          due: newTask.due,
          expected_timeline: newTask.expectedTimeline || null,
        },
        {
          onSuccess: () => {
            setNewTask({ task: "", employeeId: "", client: "", due: "", expectedTimeline: "" });
          },
        }
      );
    }
  };

  // Add Employee (now includes password)
  const handleAddEmployee = () => {
    if (
      newEmployee.name &&
      newEmployee.category &&
      newEmployee.manager &&
      newEmployee.password &&
      newEmployee.password.length >= 6
    ) {
      router.post(
        "/manager/add-employee",
        {
          name: newEmployee.name,
          category: newEmployee.category,
          subCategory: newEmployee.subCategory || null,
          manager: newEmployee.manager,
          password: newEmployee.password, // <-- send password
        },
        {
          onSuccess: () => {
            setNewEmployee({
              name: "",
              category: "",
              subCategory: "",
              manager: "",
              password: "",
            });
          },
        }
      );
    } else {
      alert("Password must be at least 6 characters.");
    }
  };

  // Add Client
  const handleAddClient = () => {
    const trimmedClient = newClient.trim();
    if (trimmedClient) {
      router.post(
        "/manager/add-client",
        { name: trimmedClient },
        {
          onSuccess: () => setNewClient(""),
        }
      );
    }
  };

  const handleDeleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      router.delete(`/manager/task/${id}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Finished":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "In Progress":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case "On Hold":
        return <PauseCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Finished":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Hold":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-8 space-y-6">
        {/* Flash Message */}
        {flash?.success && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 animate-fade-in">
            {flash.success}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            Manager Dashboard
          </h1>
          <div className="flex gap-3">
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filter.client}
              onChange={(e) => setFilter({ ...filter, client: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Clients</option>
              {clients.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["Total Tasks", tasks.length, "from-blue-500 to-blue-600", <Users size={24} />],
            [
              "Pending / In Progress",
              tasks.filter((t) => ["Pending", "In Progress"].includes(t.status)).length,
              "from-cyan-500 to-blue-600",
              <Clock size={24} className="text-white/80" />,
            ],
            [
              "On Hold",
              tasks.filter((t) => t.status === "On Hold").length,
              "from-orange-500 to-orange-600",
              <PauseCircle size={24} className="text-white/80" />,
            ],
            [
              "Finished",
              tasks.filter((t) => t.status === "Finished").length,
              "from-purple-500 to-purple-600",
              <CheckCircle size={24} className="text-white/80" />,
            ],
          ].map(([label, count, color, icon]) => (
            <div
              key={label}
              className={`bg-gradient-to-br ${color} text-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center text-center`}
            >
              <div className="p-2 bg-white/10 rounded-full mb-2">{icon}</div>
              <h2 className="font-semibold text-xs opacity-90">{label}</h2>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
          ))}
        </div>

        {/* Add New Employee */}
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Users className="text-green-500" size={24} /> Add New Employee
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Name */}
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Category */}
            <select
              value={newEmployee.category}
              onChange={(e) => setNewEmployee({ ...newEmployee, category: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sub-category */}
            <input
              type="text"
              placeholder="Sub-category (optional)"
              value={newEmployee.subCategory}
              onChange={(e) => setNewEmployee({ ...newEmployee, subCategory: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Manager */}
            <input
              type="text"
              placeholder="Manager Name"
              value={newEmployee.manager}
              onChange={(e) => setNewEmployee({ ...newEmployee, manager: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Submit */}
            <button
              onClick={handleAddEmployee}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <PlusCircle size={18} /> Add Employee
            </button>
          </div>

        </div>

        {/* Add New Client */}
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Users className="text-indigo-500" size={24} /> Add New Client
          </h2>
          <div className="flex gap-4 items-end">
            <input
              type="text"
              placeholder="Client Name"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleAddClient}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <PlusCircle size={18} /> Add Client
            </button>
          </div>
        </div>

        {/* Assign Task */}
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <PlusCircle className="text-blue-500" size={24} /> Assign New Task
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <input
              type="text"
              placeholder="Task name"
              value={newTask.task}
              onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={newTask.employeeId}
              onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.category})
                </option>
              ))}
            </select>

            <select
              value={newTask.client}
              onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              placeholder="Manager Timeline"
              value={newTask.due}
              onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="Expected Timeline"
              value={newTask.expectedTimeline}
              onChange={(e) => setNewTask({ ...newTask, expectedTimeline: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={handleAddTask}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <PlusCircle size={18} /> Add Task
            </button>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Client", "Employee", "Category", "Task", "Status", "Manager Timeline", "Developer Timeline", "Testing", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{t.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {getEmployeeName(t, employees)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {getEmployeeCategory(t, employees)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{t.task}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          t.status
                        )}`}
                      >
                        {getStatusIcon(t.status)}
                        <span className="ml-1">{t.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{t.due}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {t.expectedTimeline || "Not set"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {t.testingPoints.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => {
                          const employeeName = getEmployeeName(t, employees);
                          localStorage.setItem(
                            "selectedTask",
                            JSON.stringify({ ...t, developer: employeeName })
                          );
                          router.visit(`/task/${t.id}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tasks match the current filters.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Manager;