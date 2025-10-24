import React, { useState } from "react";
import { CheckCircle, Plus, Trash2, Calendar, Clock, ClipboardList, Sparkles, Filter } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
const Todo = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Finish React Component",
      completed: false,
      createdAt: "2025-10-16 10:00:00",
      dueDate: "2025-10-16",
      dueTime: "15:00",
      priority: "High",
    },
    {
      id: 2,
      text: "Write API Documentation",
      completed: true,
      createdAt: "2025-10-15 09:30:00",
      dueDate: "2025-10-15",
      dueTime: "12:00",
      priority: "Medium",
    },
    {
      id: 3,
      text: "Design Landing Page",
      completed: false,
      createdAt: "2025-10-14 14:45:00",
      dueDate: "2025-10-17",
      dueTime: "10:00",
      priority: "Low",
    },
    {
      id: 4,
      text: "Setup Database",
      completed: false,
      createdAt: "2025-10-13 11:20:00",
      dueDate: "2025-10-18",
      dueTime: "16:30",
      priority: "High",
    },
    {
      id: 5,
      text: "Fix Login Bug",
      completed: true,
      createdAt: "2025-10-12 08:10:00",
      dueDate: "2025-10-16",
      dueTime: "09:00",
      priority: "Medium",
    },
  ]);

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");

  const addTask = () => {
    if (!taskName || !dueDate || !dueTime) return;

    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
      2,
      "0"
    )}:${String(now.getSeconds()).padStart(2, "0")}`;

    const newTask = {
      id: Date.now(),
      text: taskName,
      completed: false,
      createdAt,
      dueDate,
      dueTime,
      priority,
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setDueDate("");
    setDueTime("");
    setPriority("Medium");
  };

  const toggleComplete = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const isOverdue = (task) => {
    const now = new Date();
    const due = new Date(`${task.dueDate}T${task.dueTime}`);
    return due < now;
  };

  const filteredTasks = tasks.filter((task) => {
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

  // Format date & time in human-readable form
  const formatDateTime = (date, time) => {
    const dt = new Date(`${date}T${time}`);
    const formattedDate = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const formattedTime = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${formattedDate} at ${formattedTime}`;
  };

  const formatCreatedAt = (createdAt) => {
    const dt = new Date(createdAt);
    return dt.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
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
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
        onClick={() => toggleComplete(task.id)}
        className={`mt-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow transition-all ${
          task.completed
            ? "bg-gray-200 text-gray-700"
            : "bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
        }`}
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
            <Plus className="w-6 h-6 text-emerald-600" /> Add New Task
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <button
              onClick={addTask}
              className="bg-gradient-to-br from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 flex justify-center items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Task
            </button>
          </div>
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