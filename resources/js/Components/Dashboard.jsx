// resources/js/Components/Dashboard.jsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Calendar, Users, BarChart3, ClipboardList, Check, Clock, AlertCircle, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

const Dashboard = ({ tasks = [], onNavigate }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [activeView, setActiveView] = useState('month');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Generate calendar days dynamically
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const generateCalendarDays = () => {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    // Previous month days to fill the first week
    const prevMonthDays = [];
    if (firstDay !== 1) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      const daysInPrevMonth = prevMonth.getDate();
      const offset = firstDay === 0 ? 6 : firstDay - 1;
      for (let i = offset; i > 0; i--) {
        const dateStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-${String(daysInPrevMonth - i + 1).padStart(2, '0')}`;
        prevMonthDays.push({
          date: daysInPrevMonth - i + 1,
          month: 'prev',
          events: tasks.filter(task => task.dueDate === dateStr).length,
        });
      }
    }

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const date = i + 1;
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      return {
        date,
        month: 'current',
        events: tasks.filter(task => task.dueDate === dateStr).length,
      };
    });

    return [...prevMonthDays, ...currentMonthDays];
  };

  const calendarDays = generateCalendarDays();

  // Group tasks by date for calendar display
  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      acc[task.dueDate] = acc[task.dueDate] || [];
      acc[task.dueDate].push(task);
    }
    return acc;
  }, {});

  // Filter urgent tasks (High priority, due within 1 day)
  const urgentTasks = tasks.filter(task => {
    if (task.priority !== 'High' || task.completed) return false;
    const due = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
    const diff = (due - today) / (1000 * 60 * 60 * 24);
    return diff <= 1;
  });

  // Filter daily tasks (due today)
  const dailyTasks = tasks.filter(task => task.dueDate === todayStr);

  // Sample important clients (static, as no equivalent in Todo model)
  const importantClients = [
    { name: 'Acme Corp', meeting: 'Nov 22, 2:00 PM', status: 'upcoming', priority: 'high' },
    { name: 'TechStart Inc', meeting: 'Nov 23, 10:00 AM', status: 'upcoming', priority: 'high' },
    { name: 'Global Solutions', meeting: 'Nov 24, 3:30 PM', status: 'upcoming', priority: 'medium' },
  ];

  // Sample upcoming timelines (static, as no equivalent in Todo model)
  const upcomingTimelines = [
    { project: 'Website Redesign', milestone: 'Design Review', date: 'Nov 25', progress: 75 },
    { project: 'Mobile App Launch', milestone: 'Beta Testing', date: 'Dec 1', progress: 60 },
    { project: 'Marketing Campaign', milestone: 'Content Creation', date: 'Nov 28', progress: 40 },
  ];

  const getTasksForDate = (date, month) => {
    const year = month === 'prev' ? today.getFullYear() - (today.getMonth() === 0 ? 1 : 0) : today.getFullYear();
    const monthIndex = month === 'prev' ? (today.getMonth() === 0 ? 11 : today.getMonth() - 1) : today.getMonth();
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return tasksByDate[dateStr] || [];
  };

  const toggleTaskCompletion = (taskId, completed) => {
    router.put(
      `/todo/${taskId}`,
      { completed: !completed },
      {
        preserveState: true,
        onError: (errors) => {
          console.error('Error updating task:', errors);
        },
      }
    );
  };

  const handleTodoRedirect = () => {
    onNavigate('/todo');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-600';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'Low':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">←</button>
            <button className="text-gray-400 hover:text-gray-600">→</button>
            <input
              type="text"
              placeholder="Search for people, conversations or files"
              className="w-96 px-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">Flyweis</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-400 text-white rounded-lg text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Chat
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium"
            onClick={handleTodoRedirect}
          >
            <ClipboardList className="w-4 h-4" />
            Task Board
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
            <Users className="w-4 h-4" />
            Timeline
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'calendar' ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <BarChart3 className="w-4 h-4" />
            Reports
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Important Clients */}
          <div className="col-span-4 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Important Clients
              </h2>
            </div>
            <div className="space-y-3">
              {importantClients.map((client, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{client.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${client.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {client.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    {client.meeting}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Tasks */}
          <div className="col-span-4 bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTodoRedirect}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Urgent Tasks
              </h2>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{urgentTasks.length}</span>
            </div>
            <div className="space-y-3">
              {urgentTasks.length > 0 ? (
                urgentTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id, task.completed);
                      }}
                      className="mt-0.5 w-5 h-5 border-2 border-red-400 rounded flex items-center justify-center hover:bg-red-100"
                    >
                      {task.completed && <Check className="w-3 h-3 text-red-600" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.text}
                      </p>
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        Due {task.dueTime ? `at ${task.dueTime}` : 'today'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No urgent tasks.</p>
              )}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto">
                View all urgent tasks
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="col-span-4 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Daily Tasks
              </h2>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {dailyTasks.filter(t => t.completed).length}/{dailyTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {dailyTasks.length > 0 ? (
                dailyTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={handleTodoRedirect}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id, task.completed);
                      }}
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tasks due today.</p>
              )}
            </div>
            <button
              onClick={handleTodoRedirect}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View All Todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Timelines */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Upcoming Project Timelines
          </h2>
          <div className="space-y-4">
            {upcomingTimelines.map((timeline, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{timeline.project}</h3>
                    <p className="text-sm text-gray-600">{timeline.milestone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-indigo-600">{timeline.date}</p>
                    <p className="text-xs text-gray-500">{timeline.progress}% complete</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${timeline.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h1>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'day' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView('day')}
              >
                DAY
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'week' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView('week')}
              >
                WEEK
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'month' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView('month')}
              >
                MONTH
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'year' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView('year')}
              >
                YEAR
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          {activeView === 'month' && (
            <div className="grid grid-cols-7 gap-4">
              {/* Week Day Headers */}
              {weekDays.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, idx) => {
                const dayTasks = getTasksForDate(day.date, day.month);
                return (
                  <div
                    key={idx}
                    className={`min-h-28 p-3 rounded-lg border relative ${
                      day.month === 'prev'
                        ? 'bg-gray-50 border-gray-100'
                        : day.date === today.getDate() && day.month === 'current'
                        ? 'bg-blue-100 border-blue-200'
                        : 'bg-white border-gray-200'
                    } hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => onNavigate(`/todo?filter=Today&date=${day.date}&month=${day.month}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-sm font-semibold ${day.month === 'prev' ? 'text-gray-400' : 'text-gray-700'}`}>
                        {day.date < 10 ? `0${day.date}` : day.date}
                      </span>
                      {day.events > 0 && (
                        <span className="text-xs text-gray-400">📋 {day.events}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task, eIdx) => (
                        <div
                          key={eIdx}
                          className={`text-xs px-2 py-1 rounded truncate ${getPriorityColor(task.priority)}`}
                        >
                          {task.text}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500">+{dayTasks.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activeView !== 'month' && (
            <p className="text-gray-500">Only month view is supported in this implementation.</p>
          )}

          {/* Floating Add Button */}
          <button
            onClick={handleTodoRedirect}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl z-10"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;