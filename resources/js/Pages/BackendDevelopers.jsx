// BackendDevelopers.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Eye,
} from "lucide-react";

const employees = [
  {
    id: 2,
    name: "Bob",
    manager: "Jane Smith",
    projects: [{ name: "Backend API", timeline: "2025-10-20", client: "Client B" }],
  },
  {
    id: 8,
    name: "David",
    manager: "Jane Smith",
    projects: [{ name: "Database Optimization", timeline: "2025-10-30", client: "Client B" }],
  },
];

const BackendDevelopers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date('2025-10-15');
  const getProjectStatus = (timeline) => {
    const due = new Date(timeline);
    if (due < today) return "Overdue";
    if (due.toDateString() === today.toDateString()) return "Due Today";
    return "On Track";
  };

  const getDaysLeft = (timeline) => {
    const due = new Date(timeline);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "On Track":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Due Today":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800 border-green-200";
      case "Due Today":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDaysColor = (daysLeft, status) => {
    if (status === "Overdue") return "text-red-600 font-semibold";
    if (daysLeft <= 7) return "text-yellow-600 font-semibold";
    return "text-gray-700";
  };

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.projects[0]?.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.projects[0]?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDevelopers = employees.length;
  const dueTodayCount = employees.filter((e) =>
    e.projects.some((p) => getProjectStatus(p.timeline) === "Due Today")
  ).length;
  const overdueCount = employees.filter((e) =>
    e.projects.some((p) => getProjectStatus(p.timeline) === "Overdue")
  ).length;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 space-y-8">
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <button
          onClick={() => navigate("/manager")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          🖥️ Backend Developers
        </h1>
        <div className="w-32" /> {/* Spacer for alignment */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          [
            "Total Backend Developers",
            totalDevelopers,
            "from-blue-500 to-blue-600",
            <Users size={24} />,
          ],
          [
            "Due Today",
            dueTodayCount,
            "from-yellow-500 to-yellow-600",
            <Clock size={24} />,
          ],
          [
            "Overdue",
            overdueCount,
            "from-red-500 to-red-600",
            <AlertCircle size={24} className="text-white/80" />,
          ],
        ].map(([label, count, color, icon]) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm opacity-90 tracking-wide">{label}</h2>
                <p className="text-3xl font-bold mt-2">{count}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, manager, client, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                {[
                  "Name",
                  "Assigned Manager",
                  "Client",
                  "Project Working On",
                  "Status",
                  "Timeline",
                  "Projected Days Left",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((e) => {
                const timeline = e.projects[0]?.timeline || "";
                const status = getProjectStatus(timeline);
                const daysLeft = getDaysLeft(timeline);
                const projectedDays = status === "Overdue" ? "Overdue" : `${daysLeft} days`;
                return (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50/50 transition-all duration-200 cursor-pointer border-b border-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {getInitials(e.name)}
                        </div>
                        <span className="font-medium text-gray-900">{e.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {e.manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {e.projects[0]?.client || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-xs truncate">
                      {e.projects[0]?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          status
                        )} shadow-sm`}
                      >
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono">
                      {timeline || "N/A"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${getDaysColor(daysLeft, status)}`}>
                      {projectedDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => navigate(`/employee/${e.id}`)}
                        className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 bg-gray-50">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No backend developers found matching the search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendDevelopers;