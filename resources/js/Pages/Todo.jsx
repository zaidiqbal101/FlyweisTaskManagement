// resources/js/Pages/Todo.jsx
import React, { useState } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import { CheckCircle, Plus, Trash2, Calendar, Clock, ClipboardList, Sparkles, Filter, Edit2 } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

const Todo = () => {
  const { tasks: initialTasks = [], flash, errors } = usePage().props;
  const [filter, setFilter] = useState("All");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track task being edited

  const { data, setData, post, put, processing, reset } = useForm({
    text: "",
    dueDate: "",
    dueTime: "",
    priority: "Medium",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.text || !data.dueDate || !data.dueTime) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingTaskId) {
      // Update existing task
      put(`/todo/${editingTaskId}`, {
        onSuccess: () => {
          reset();
          setEditingTaskId(null); // Exit edit mode
        },
        onError: (err) => {
          console.error("Error updating task:", err);
        },
      });
    } else {
      // Add new task
      post("/todo", {
        onSuccess: () => reset(),
        onError: (err) => {
          console.error("Error adding task:", err);
        },
      });
    }
  };

  const editTask = (task) => {
    setEditingTaskId(task.id);
    setData({
      text: task.text,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    reset();
  };

  const toggleComplete = (id, completed) => {
    router.put(
      `/todo/${id}`,
      { completed: !completed },
      {
        preserveState: true,
        onError: (errors) => {
          console.error("Error updating task:", errors);
        },
      }
    );
  };

  const deleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      router.delete(`/todo/${id}`, {
        preserveState: true,
        onError: (errors) => {
          console.error("Error deleting task:", errors);
        },
      });
    }
  };

  const isOverdue = (task) => {
    const now = new Date();
    const due = new Date(`${task.dueDate}T${task.dueTime}`);
    return due < now && !task.completed;
  };

  const filteredTasks = initialTasks.filter((task) => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    switch (filter) {
      case "Today":
        return taskDate.toDateString() === today.toDateString();
      case "Yesterday":
        return taskDate.toDateString() === yesterday.toDateString();
      case "Upcoming":
        return taskDate > today;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "N/A";
    const dt = new Date(`${date}T${time}`);
    const formattedDate = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const formattedTime = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${formattedDate} at ${formattedTime}`;
  };

  const formatCreatedAt = (createdAt) => {
    const dt = new Date(createdAt);
    return dt.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className={`bg-white border-2 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 ${
        task.completed ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <h2
            className={`text-xl font-semibold leading-tight ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.text}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => editTask(task)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              disabled={processing}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              disabled={processing}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border-2 ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow ${
              task.completed
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-yellow-400 to-orange-500"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${
              isOverdue(task)
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-semibold">{formatDateTime(task.dueDate, task.dueTime)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 bg-gray-50 border-gray-200 text-gray-700">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-semibold">Created {formatCreatedAt(task.createdAt)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => toggleComplete(task.id, task.completed)}
        className={`mt-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow transition-all ${
          task.completed
            ? "bg-gray-200 text-gray-700"
            : "bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
        }`}
        disabled={processing}
      >
        <CheckCircle className="w-4 h-4" />
        {task.completed ? "Mark Incomplete" : "Mark Complete"}
      </button>
    </div>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-100 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Flash Message */}
          {flash?.success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{flash.success}</div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
              {Object.values(errors).map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                My Tasks Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option>All</option>
                <option>Today</option>
                <option>Yesterday</option>
                <option>Upcoming</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl shadow-lg p-6 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-600" /> {editingTaskId ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  value={data.text}
                  onChange={(e) => setData("text", e.target.value)}
                  placeholder="Enter task name..."
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    errors.text ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => setData("dueDate", e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    errors.dueDate ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-700">Time</label>
                <input
                  type="time"
                  value={data.dueTime}
                  onChange={(e) => setData("dueTime", e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emeraldleave-400 ${
                    errors.dueTime ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-700">Priority</label>
                <select
                  value={data.priority}
                  onChange={(e) => setData("priority", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={processing}
                  className={`flex-1 bg-gradient-to-br from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 flex justify-center items-center gap-2 ${
                    processing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Plus className="w-5 h-5" /> {processing ? "Saving..." : editingTaskId ? "Update Task" : "Add Task"}
                </button>
                {editingTaskId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105 flex justify-center items-center gap-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(renderTaskCard)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-200">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks for selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Todo;