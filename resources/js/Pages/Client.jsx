import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Users, Package, Calendar, User, FileText, Sparkles, TrendingUp } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
// Sample tasks
const initialTasks = [
  {
    id: 1,
    task: 'Frontend Dashboard',
    projectName: 'User Management System',
    projectSummary: 'A system to manage users, roles, and permissions',
    developer: 'Alice',
    client: 'Client A',
    type: 'Frontend',
    projectedTimeline: '2025-10-15',
    deliveredDate: '2025-10-15',
    status: 'In Progress',
    due: '2025-10-15',
    devRemark: 'Working on UI components',
    clientRemark: 'Needs to be responsive'
  },
  {
    id: 2,
    task: 'Backend API',
    projectName: 'E-commerce API',
    projectSummary: 'Backend API to handle products, orders, and payments',
    developer: 'Bob',
    client: 'Client B',
    type: 'Backend',
    projectedTimeline: '2025-10-20',
    deliveredDate: '2025-10-20',
    status: 'Pending',
    due: '2025-10-20',
    devRemark: '',
    clientRemark: ''
  },
  {
    id: 3,
    task: 'UI Fixes',
    projectName: 'Admin Dashboard',
    projectSummary: 'Fixing UI issues for admin dashboard',
    developer: 'Charlie',
    client: 'Client A',
    type: 'Frontend',
    projectedTimeline: '2025-10-10',
    deliveredDate: '2025-10-10',
    status: 'Completed',
    due: '2025-10-10',
    devRemark: 'Fixed all UI bugs',
    clientRemark: 'Approved'
  },
  {
    id: 4,
    task: 'Database Migration',
    projectName: 'Legacy DB Upgrade',
    projectSummary: 'Migrate old database to new server with optimized schema',
    developer: 'Alice',
    client: 'Client C',
    type: 'Backend',
    projectedTimeline: '2025-10-18',
    deliveredDate: '2025-10-18',
    status: 'Pending',
    due: '2025-10-18',
    devRemark: '',
    clientRemark: ''
  },
  {
    id: 5,
    task: 'Client Portal',
    projectName: 'Client Interaction Portal',
    projectSummary: 'Portal for clients to track projects, submit tickets and communicate',
    developer: 'Bob',
    client: 'Client A',
    type: 'Frontend',
    projectedTimeline: '2025-10-22',
    deliveredDate: '2025-10-22',
    status: 'In Progress',
    due: '2025-10-22',
    devRemark: 'Starting with login module',
    clientRemark: ''
  },
  {
    id: 6,
    task: 'Analytics Dashboard',
    projectName: 'Sales Analytics Dashboard',
    projectSummary: 'Dashboard to visualize sales data and generate reports',
    developer: 'Charlie',
    client: 'Client B',
    type: 'Frontend',
    projectedTimeline: '2025-10-25',
    deliveredDate: '2025-10-26',
    status: 'Pending',
    due: '2025-10-25',
    devRemark: '',
    clientRemark: ''
  },
  {
    id: 7,
    task: 'Bug Fix Release 1.1',
    projectName: 'Mobile App Maintenance',
    projectSummary: 'Fixing bugs in the mobile application and release version 1.1',
    developer: 'Alice',
    client: 'Client A',
    type: 'Frontend',
    projectedTimeline: '2025-10-17',
    deliveredDate: '2025-10-14',
    status: 'In Progress',
    due: '2025-10-17',
    devRemark: 'Fixing login bugs',
    clientRemark: 'Reported issue on mobile'
  },
  {
    id: 8,
    task: 'Payment Gateway Integration',
    projectName: 'E-commerce API',
    projectSummary: 'Integrate payment gateway with secure transaction system',
    developer: 'Bob',
    client: 'Client B',
    type: 'Backend',
    projectedTimeline: '2025-10-28',
    deliveredDate: '2025-10-28',
    status: 'Pending',
    due: '2025-10-28',
    devRemark: '',
    clientRemark: ''
  },
  {
    id: 9,
    task: 'Marketing Landing Page',
    projectName: 'Website Revamp',
    projectSummary: 'Create a modern landing page to improve user engagement',
    developer: 'Charlie',
    client: 'Client C',
    type: 'Frontend',
    projectedTimeline: '2025-10-23',
    deliveredDate: '2025-10-21',
    status: 'In Progress',
    due: '2025-10-23',
    devRemark: 'Working on responsive design',
    clientRemark: ''
  },
  {
    id: 10,
    task: 'Email Automation',
    projectName: 'CRM System',
    projectSummary: 'Automate email campaigns and notifications for clients',
    developer: 'Alice',
    client: 'Client A',
    type: 'Backend',
    projectedTimeline: '2025-10-30',
    deliveredDate: '2025-11-04',
    status: 'Pending',
    due: '2025-10-30',
    devRemark: '',
    clientRemark: ''
  }
];

const Client = ({ clientName = 'Client A' }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const clientTasks = tasks.filter(t => t.client === clientName);

  const handleClientRemarkChange = (id, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, clientRemark: value } : t));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-300';
      case 'In Progress': return 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300';
      case 'Pending': return 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-300';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Frontend' 
      ? 'bg-purple-100 text-purple-700 border-purple-200' 
      : 'bg-indigo-100 text-indigo-700 border-indigo-200';
  };

  const isOverdue = (due) => {
    const today = new Date();
    const dueDate = new Date(due);
    return dueDate < today && dueDate.toDateString() !== today.toDateString();
  };

  // Summary counts
  const totalTasks = clientTasks.length;
  const pendingInProgress = clientTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const completedTasks = clientTasks.filter(t => t.status === 'Completed').length;

  return (
    <AppLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {clientName} Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-16">Welcome back! Here's an overview of your projects and tasks.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-600 mb-1">Total Projects</h2>
              <p className="text-4xl font-bold text-gray-800">{totalTasks}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-600 mb-1">In Progress</h2>
              <p className="text-4xl font-bold text-gray-800">{pendingInProgress}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-600 mb-1">Completed</h2>
              <p className="text-4xl font-bold text-gray-800">{completedTasks}</p>
            </div>
          </div>
        </div>

        {/* Task Cards */}
        {clientTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientTasks.map(task => (
              <div 
                key={task.id} 
                className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:from-blue-400/20 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-4">
                    {/* Client Name Bold at Top */}
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-bold text-gray-800 leading-tight">{clientName}</h2>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getTypeColor(task.type)}`}>
                        {task.type}
                      </span>
                    </div>
                    
                    {/* Developer */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700"><span className="font-semibold">Developer:</span> {task.developer}</span>
                    </div>

                    {/* Project Name */}
                    <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-lg p-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">{task.projectName}</span>
                    </div>

                    {/* Project Summary */}
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{task.projectSummary}</p>

                    {/* Timelines */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600"><span className="font-semibold">Projected:</span> {task.projectedTimeline}</span>
                      </div>
                      {task.deliveredDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600"><span className="font-semibold">Delivered:</span> {task.deliveredDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Status and Due Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-4 py-1.5 text-white rounded-full text-xs font-bold shadow-md border-2 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                        isOverdue(task.due) 
                          ? 'bg-red-100 text-red-700 border-2 border-red-200' 
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{task.due}</span>
                      </div>
                    </div>

                    {/* Developer Remark */}
                    {task.devRemark && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-bold text-blue-900">Developer Note</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{task.devRemark}</p>
                      </div>
                    )}
                  </div>

                  {/* Client Remark */}
                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Your Feedback
                    </label>
                    <textarea
                      value={task.clientRemark}
                      placeholder="Share your thoughts or requirements..."
                      onChange={e => handleClientRemarkChange(task.id, e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 hover:bg-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </AppLayout>
  );
};

export default Client;