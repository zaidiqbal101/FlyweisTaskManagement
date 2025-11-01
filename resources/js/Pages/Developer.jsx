import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
export default function Developer({ developers, summary }) {
    const [expandedDevelopers, setExpandedDevelopers] = useState({});
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDeveloper = (developerId) => {
        setExpandedDevelopers(prev => ({
            ...prev,
            [developerId]: !prev[developerId]
        }));
    };

    const getStatusColor = (status) => {
        const colors = {
            'active': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'on-hold': 'bg-gray-100 text-gray-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const filteredDevelopers = developers.filter(dev => {
        const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            dev.tasks.some(task => task.task.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (filterStatus === 'all') return matchesSearch;
        if (filterStatus === 'with-tasks') return matchesSearch && dev.total_tasks > 0;
        if (filterStatus === 'no-tasks') return matchesSearch && dev.total_tasks === 0;
        return matchesSearch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <>
            <AppLayout>
            <Head title="Developers Dashboard" />
            
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Developers Dashboard</h1>
                        <p className="mt-2 text-gray-600">Overview of all developers and their assigned projects</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-500">Total Developers</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{summary.total_developers}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-500">Total Tasks</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{summary.total_tasks}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-500">Active Tasks</div>
                            <div className="mt-2 text-3xl font-bold text-blue-600">{summary.total_active_tasks}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-500">Completed Tasks</div>
                            <div className="mt-2 text-3xl font-bold text-green-600">{summary.total_completed_tasks}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-500">With Active Work</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{summary.developers_with_tasks}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search by developer or task name..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Developers</option>
                                    <option value="with-tasks">With Tasks</option>
                                    <option value="no-tasks">Without Tasks</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Developers List */}
                    <div className="space-y-4">
                        {filteredDevelopers.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500">No developers found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredDevelopers.map((developer) => (
                                <div key={developer.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    {/* Developer Header */}
                                    <div 
                                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleDeveloper(developer.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                                                        {developer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{developer.name}</h3>
                                                        <div className="flex items-center space-x-3 mt-1">
                                                            {developer.sub_category && (
                                                                <span className="text-sm text-gray-500">{developer.sub_category}</span>
                                                            )}
                                                            {developer.manager && (
                                                                <span className="text-sm text-gray-500">Manager: {developer.manager}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{developer.total_tasks}</div>
                                                    <div className="text-xs text-gray-500">Total</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{developer.active_tasks}</div>
                                                    <div className="text-xs text-gray-500">Active</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">{developer.completed_tasks}</div>
                                                    <div className="text-xs text-gray-500">Done</div>
                                                </div>
                                                <svg 
                                                    className={`w-6 h-6 text-gray-400 transition-transform ${expandedDevelopers[developer.id] ? 'transform rotate-180' : ''}`}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tasks List */}
                                    {expandedDevelopers[developer.id] && (
                                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                                            {developer.tasks.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">No tasks assigned</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {developer.tasks.map((task) => (
                                                        <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-3 mb-2">
                                                                        <h4 className="font-medium text-gray-900">{task.task}</h4>
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                                            {task.status}
                                                                        </span>
                                                                        {isOverdue(task.due) && task.status !== 'completed' && (
                                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                                Overdue
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                                                        {task.client && (
                                                                            <div className="flex items-center space-x-2">
                                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                                </svg>
                                                                                <span className="text-sm text-gray-600">Client: {task.client.name}</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center space-x-2">
                                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                            <span className="text-sm text-gray-600">Due: {formatDate(task.due)}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            <span className="text-sm text-gray-600">Expected: {formatDate(task.expected_timeline)}</span>
                                                                        </div>
                                                                    </div>
                                                                    {task.detail && (
                                                                        <div className="mt-3 text-sm text-gray-600">
                                                                            <p>{task.detail.description || 'No additional details'}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
        </AppLayout>
        </>
    );
}