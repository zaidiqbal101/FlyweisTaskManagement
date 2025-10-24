import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/inertia-react';
import AppLayout from '@/Layouts/AppLayout';

const Developer = ({ tasks: initialTasks, employees: initialEmployees, flash }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState({ subCategory: "" });
  const [expandedTask, setExpandedTask] = useState(null);

  const frontendDevs = initialEmployees.filter(e => e.subCategory === "Frontend").map(e => e.name);
  const backendDevs = initialEmployees.filter(e => e.subCategory === "Backend").map(e => e.name);

  // Filter tasks based on subCategory
  const devTasks = filter.subCategory === "" 
    ? tasks 
    : filter.subCategory === "Frontend" 
      ? tasks.filter(t => frontendDevs.includes(t.developer))
      : tasks.filter(t => backendDevs.includes(t.developer));

  // Update developer remark (local + save on blur)
  const handleRemarkChange = (id, value) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, devRemark: value } : t)));
  };

  const handleRemarkBlur = (id, value) => {
    router.put(`/developer/task/${id}`, { devRemark: value }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Mark task as completed (local + save)
  const handleComplete = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setTasks(tasks.map(t => (t.id === id ? { ...t, status: 'Completed', deliveredDate: today } : t)));
    router.put(`/developer/task/${id}`, { status: 'Completed', delivered_date: today }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Helper for badge color
  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-500';
    if (status === 'In Progress') return 'bg-blue-500';
    if (status === 'Pending') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // Toggle task dropdown
  const toggleTaskDropdown = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  // Build a simple month calendar
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const dayTasks = devTasks.filter(
      (task) => task.due && new Date(task.due).toDateString() === date.toDateString()
    );
    return { date, tasks: dayTasks };
  });

  const tasksForSelectedDate =
    selectedDate &&
    devTasks.filter(
      (task) => task.due && new Date(task.due).toDateString() === selectedDate.toDateString()
    );

  return (
    <AppLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Flash Message */}
        {flash?.success && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
            {flash.success}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-[#6D93CD]">
          Developers Dashboard
        </h1>

        {/* Filter Dropdown */}
        <div className="flex gap-3 mb-6">
          <select
            value={filter.subCategory || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFilter({ ...filter, subCategory: val });
              if (val === "Frontend") {
                router.visit("/employees/frontend");
              } else if (val === "Backend") {
                router.visit("/employees/backend");
              }
            }}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Developers</option>
            <option value="Frontend">Frontend Developers</option>
            <option value="Backend">Backend Developers</option>
          </select>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Task Calendar - {today.toLocaleString('default', { month: 'long' })} {year}
          </h2>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map(({ date, tasks: dayTasks }) => (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`cursor-pointer p-2 border rounded-lg text-center transition-all ${
                  dayTasks.length > 0
                    ? 'bg-[#6D93CD] text-white hover:bg-[#5b82b8]'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-semibold">{date.getDate()}</div>
                {dayTasks.length > 0 && (
                  <div className="text-xs mt-1">{dayTasks.length} Task(s)</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* All Developers Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-[#6D93CD]">
            All Developers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(new Set(devTasks.map(t => t.developer))).map((dev) => {
              const developerTasks = devTasks.filter(t => t.developer === dev);
              const completed = developerTasks.filter(t => t.status === 'Completed').length;
              const inProgress = developerTasks.filter(t => t.status === 'In Progress').length;
              const pending = developerTasks.filter(t => t.status === 'Pending').length;
              const devType = frontendDevs.includes(dev) ? 'Frontend' : 'Backend';
              
              return (
                <div key={dev} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{dev}</h3>
                    <span className="text-xs px-2 py-1 bg-[#6D93CD] text-white rounded-full">
                      {devType}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Tasks:</span>
                      <span className="font-semibold text-gray-800">{developerTasks.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed:</span>
                      <span className="font-semibold text-green-600">{completed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">In Progress:</span>
                      <span className="font-semibold text-blue-600">{inProgress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="font-semibold text-yellow-600">{pending}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Tasks:</h4>
                    <div className="space-y-2">
                      {developerTasks.slice(0, 3).map(task => (
                        <div key={task.id} className="text-xs">
                          <div 
                            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded"
                            onClick={() => toggleTaskDropdown(task.id)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></span>
                              <span className="truncate text-gray-600">{task.task}</span>
                            </div>
                            <span className="text-gray-400 ml-2">
                              {expandedTask === task.id ? '▲' : '▼'}
                            </span>
                          </div>
                          
                          {expandedTask === task.id && (
                            <div className="ml-4 mt-1 p-2 bg-gray-50 rounded text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Timeline Given by Manager:</span>
                                <span className="font-semibold text-blue-600">{task.projectedTimeline}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Project Completed On:</span>
                                <span className={`font-semibold ${task.deliveredDate ? 'text-green-600' : 'text-gray-400'}`}>
                                  {task.deliveredDate || 'Not Completed'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#6D93CD]">
              Tasks for {selectedDate.toDateString()}
            </h2>

            {tasksForSelectedDate.length === 0 ? (
              <p className="text-gray-600">No tasks for this day.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg shadow p-4 bg-white flex flex-col justify-between"
                  >
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">{task.task}</h2>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Developer:</span> {task.developer}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Client:</span> {task.client}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Projected Timeline:</span> {task.projectedTimeline}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Delivered Date:</span> {task.deliveredDate || 'Not Delivered'}
                      </p>
                      <p
                        className={`mb-1 inline-block px-2 py-1 text-white rounded ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </p>
                      <p className="text-sm text-gray-500">Due: {task.due}</p>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Developer Remark
                        </label>
                        <textarea
                          value={task.devRemark}
                          placeholder="Add your remark"
                          onChange={(e) =>
                            handleRemarkChange(task.id, e.target.value)
                          }
                          onBlur={(e) => handleRemarkBlur(task.id, e.target.value)}
                          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D93CD]"
                          rows={3}
                        />
                      </div>
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleComplete(task.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Developer;