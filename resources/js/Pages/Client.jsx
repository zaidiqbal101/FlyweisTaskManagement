import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Package, Calendar, User, FileText } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

const Client = ({ clientName, tasks = [] }) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  const allTasks = localTasks;
  const isAllClients = !clientName;

  const handleClientRemarkChange = (id, value) => {
    setLocalTasks(localTasks.map(t => t.id === id ? { ...t, clientRemark: value } : t));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'In Progress':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4" />;
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
  const totalTasks = allTasks.length;
  const pendingInProgress = allTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-8 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            📊 {isAllClients ? 'All Clients Dashboard' : `${clientName} Dashboard`}
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Total Projects", totalTasks, "from-blue-500 to-blue-600", <Package size={24} />],
            [
              "Pending/In Progress",
              pendingInProgress,
              "from-yellow-500 to-yellow-600",
              <Clock size={24} />,
            ],
            [
              "Completed",
              completedTasks,
              "from-purple-500 to-purple-600",
              <CheckCircle size={24} className="text-white/80" />,
            ],
          ].map(([label, count, color, icon]) => (
            <div
              key={label}
              className={`bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm opacity-90">{label}</h2>
                  <p className="text-3xl font-bold mt-2">{count}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-full">{icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Task Cards */}
        {allTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tasks available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTasks.map(task => (
              <div 
                key={task.id} 
                className="bg-white border border-gray-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Header Section */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">{task.client}</h2>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{task.task}</h3>
                  
                  {task.projectName && (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 mb-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{task.projectName}</span>
                    </div>
                  )}

                  {task.projectSummary && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">{task.projectSummary}</p>
                  )}
                </div>

                {/* Developer Info */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">Developer:</span> {task.developer}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-4 pb-4 border-b border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      <span className="font-semibold">Expected:</span> {task.projectedTimeline}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-sm ${isOverdue(task.due) ? 'text-red-600 font-semibold' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span>
                      <span className="font-semibold">Due:</span> {task.due}
                    </span>
                  </div>

                  {task.deliveredDate && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        <span className="font-semibold">Delivered:</span> {task.deliveredDate}
                      </span>
                    </div>
                  )}
                </div>

                {/* Developer Remark */}
                {task.devRemark && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-900">Developer Note</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{task.devRemark}</p>
                  </div>
                )}

                {/* Client Feedback */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Your Feedback
                  </label>
                  <textarea
                    value={task.clientRemark || ''}
                    placeholder="Share your thoughts or requirements..."
                    onChange={e => handleClientRemarkChange(task.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Client;