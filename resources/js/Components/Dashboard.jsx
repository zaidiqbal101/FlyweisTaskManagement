import React, { useState } from 'react';
import { Calendar, Users, BarChart3, ClipboardList, Check, Clock, AlertCircle, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

const Dashboard = ({ sidebarItems, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [activeView, setActiveView] = useState('month');

  const events = [
    { date: 30, day: 'Mon', events: ['Review with Brr...'] },
    { date: 31, day: 'Tue', events: ['Planning with cli...'] },
    { date: 1, day: 'Wed', events: ['Dinner with Jor...', 'Meeting with cli...', 'Work on Brand...'] },
    { date: 2, day: 'Thu', events: ['Meeting with cli...'] },
    { date: 3, day: 'Fri', events: ['Dinner with Brr...'] },
    { date: 4, day: 'Sat', events: ['Dinner with cli...'] },
    { date: 6, day: 'Mon', events: ['Dinner with bro...', 'Meeting with cli...'] },
    { date: 10, day: 'Fri', events: ['Dinner with Jer...', 'Meeting with cli...'] },
    { date: 16, day: 'Thu', events: ['Dinner with Brr...', 'Meeting with cli...', 'Work on Brand...'] }
  ];

  // Sample tasks data - should sync with Todo component
  const urgentTasks = [
    { id: 1, title: 'Finish React Component', deadline: '2 hours', completed: false, priority: 'High' },
    { id: 4, title: 'Setup Database', deadline: '1 day', completed: false, priority: 'High' }
  ];

  const dailyTasks = [
    { id: 1, title: 'Check emails', completed: true },
    { id: 2, title: 'Team standup meeting', completed: true },
    { id: 3, title: 'Write API Documentation', completed: true },
    { id: 4, title: 'Design Landing Page', completed: false },
    { id: 5, title: 'Review pull requests', completed: false }
  ];

  const importantClients = [
    { name: 'Acme Corp', meeting: 'Nov 22, 2:00 PM', status: 'upcoming', priority: 'high' },
    { name: 'TechStart Inc', meeting: 'Nov 23, 10:00 AM', status: 'upcoming', priority: 'high' },
    { name: 'Global Solutions', meeting: 'Nov 24, 3:30 PM', status: 'upcoming', priority: 'medium' }
  ];

  const upcomingTimelines = [
    { project: 'Website Redesign', milestone: 'Design Review', date: 'Nov 25', progress: 75 },
    { project: 'Mobile App Launch', milestone: 'Beta Testing', date: 'Dec 1', progress: 60 },
    { project: 'Marketing Campaign', milestone: 'Content Creation', date: 'Nov 28', progress: 40 }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = [
    { date: 30, month: 'prev', events: 0 },
    { date: 31, month: 'prev', events: 0 },
    { date: 1, month: 'current', events: 3 },
    { date: 2, month: 'current', events: 1 },
    { date: 3, month: 'current', events: 1 },
    { date: 4, month: 'current', events: 1 },
    { date: 5, month: 'current', events: 0 },
    { date: 6, month: 'current', events: 2 },
    { date: 7, month: 'current', events: 1 },
    { date: 8, month: 'current', events: 0 },
    { date: 9, month: 'current', events: 1 },
    { date: 10, month: 'current', events: 2 },
    { date: 11, month: 'current', events: 0 },
    { date: 12, month: 'current', events: 0 },
    { date: 13, month: 'current', events: 2 },
    { date: 14, month: 'current', events: 0 },
    { date: 15, month: 'current', events: 0 },
    { date: 16, month: 'current', events: 3 },
    { date: 17, month: 'current', events: 2 },
    { date: 18, month: 'current', events: 0 },
    { date: 19, month: 'current', events: 0 },
    { date: 20, month: 'current', events: 0 },
    { date: 21, month: 'current', events: 0 },
    { date: 22, month: 'current', events: 1 },
    { date: 23, month: 'current', events: 0 },
    { date: 24, month: 'current', events: 0 },
    { date: 25, month: 'current', events: 0 },
    { date: 26, month: 'current', events: 0 },
  ];

  const getEventsForDate = (date) => {
    return events.find(e => e.date === date)?.events || [];
  };

  const handleTodoRedirect = () => {
    if (onNavigate) {
      onNavigate('/todo');
    } else {
      // Fallback if onNavigate is not provided
      window.location.href = '/todo';
    }
  };

  const handleTaskClick = (taskId) => {
    handleTodoRedirect();
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'calendar' ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task.id);
                    }}
                    className="mt-0.5 w-5 h-5 border-2 border-red-400 rounded flex items-center justify-center hover:bg-red-100"
                  >
                    {task.completed && <Check className="w-3 h-3 text-red-600" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Due in {task.deadline}
                    </p>
                  </div>
                </div>
              ))}
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
              {dailyTasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={handleTodoRedirect}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task.id);
                    }}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
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
            <h1 className="text-2xl font-bold text-gray-800">Saturday, Nov 19th</h1>
            <div className="flex gap-2">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeView === 'day' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setActiveView('day')}>
                DAY
              </button>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeView === 'week' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setActiveView('week')}>
                WEEK
              </button>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeView === 'month' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setActiveView('month')}>
                MONTH
              </button>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeView === 'year' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setActiveView('year')}>
                YEAR
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {/* Week Day Headers */}
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day.date);
              return (
                <div 
                  key={idx} 
                  className={`min-h-28 p-3 rounded-lg border relative ${
                    day.month === 'prev' 
                      ? 'bg-gray-50 border-gray-100' 
                      : day.date === 1 
                      ? 'bg-blue-100 border-blue-200' 
                      : 'bg-white border-gray-200'
                  } hover:shadow-md transition-shadow`}
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
                    {dayEvents.slice(0, 3).map((event, eIdx) => (
                      <div key={eIdx} className="bg-blue-400 text-white text-xs px-2 py-1 rounded truncate">
                        {event}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

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