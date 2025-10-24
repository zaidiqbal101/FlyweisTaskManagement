import React, { useState } from "react";
import { router } from '@inertiajs/inertia-react';
import AppLayout from "@/Layouts/AppLayout";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  PlusCircle,
  X,
  Save,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    task: "Frontend Dashboard",
    developer: "Alice",
    client: "Client A",
    status: "In Progress",
    due: "2025-10-15",
    devRemark: "Working on UI",
    clientRemark: "Needs to be responsive",
    managerRemark: "",
    testingPoints: [],
    projectedTimeline: {
      devRemark: "2025-10-16",
      clientRemark: "2025-10-18",
    },
    workNumbers: {
      manager: 8,
      client: 4,
    },
    documents: [],
  },
  {
    id: 2,
    task: "Backend API",
    developer: "Bob",
    client: "Client B",
    status: "Pending",
    due: "2025-10-20",
    devRemark: "",
    clientRemark: "",
    managerRemark: "",
    testingPoints: [],
    projectedTimeline: {
      devRemark: "",
      clientRemark: "",
    },
    workNumbers: {
      manager: 0,
      client: 0,
    },
    documents: [],
  },
  {
    id: 3,
    task: "UI Fixes",
    developer: "Charlie",
    client: "Client A",
    status: "Finished",
    due: "2025-10-10",
    devRemark: "Fixed all bugs",
    clientRemark: "Approved",
    managerRemark: "Overall approved after testing",
    testingPoints: [
      {
        id: 1,
        number: 1,
        description: "Test bug fixes",
        passed: true,
        remark: "All tests passed",
        testerName: "QA Tester",
        addedDate: "2025-10-08",
        managerRemark: "Reviewed and approved",
      },
      {
        id: 2,
        number: 2,
        description: "Verify UI consistency",
        passed: true,
        remark: "UI looks consistent",
        testerName: "QA Tester",
        addedDate: "2025-10-09",
        managerRemark: "Additional checks passed",
      },
    ],
    projectedTimeline: {
      devRemark: "2025-10-12",
      clientRemark: "2025-10-14",
    },
    workNumbers: {
      manager: 12,
      client: 6,
    },
    documents: [],
  },
];

const Tester = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState({ developer: "", client: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newIssue, setNewIssue] = useState({
    description: "",
    remark: "",
    passed: false,
    testerName: "QA Tester",
  });

  // Filter tasks suitable for testing (e.g., In Progress or Finished)
  const filteredTasks = tasks
    .filter(
      (t) =>
        (t.status === "In Progress" || t.status === "Finished") &&
        t.task.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filter.developer === "" || t.developer === filter.developer) &&
        (filter.client === "" || t.client === filter.client)
    );

  const developers = [...new Set(tasks.map((t) => t.developer))];
  const clients = [...new Set(tasks.map((t) => t.client))];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Finished":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Finished":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const handleOpenAddIssue = (task) => {
    setSelectedTask(task);
    setNewIssue({
      description: "",
      remark: "",
      passed: false,
      testerName: "QA Tester",
    });
    setShowAddIssueModal(true);
  };

  const handleCloseModal = () => {
    setShowAddIssueModal(false);
    setSelectedTask(null);
  };

  const handleSaveIssue = () => {
    if (!newIssue.description.trim() || !newIssue.remark.trim()) {
      alert("Please fill in description and remark.");
      return;
    }

    const maxId = selectedTask.testingPoints.length > 0 ? Math.max(...selectedTask.testingPoints.map(p => p.id)) : 0;
    const maxNumber = selectedTask.testingPoints.length > 0 ? Math.max(...selectedTask.testingPoints.map(p => p.number)) : 0;
    const newTestingPoint = {
      id: maxId + 1,
      number: maxNumber + 1,
      description: newIssue.description,
      passed: newIssue.passed,
      remark: newIssue.remark,
      testerName: newIssue.testerName,
      addedDate: new Date().toISOString().split('T')[0],
      managerRemark: "",
    };

    const updatedTask = {
      ...selectedTask,
      testingPoints: [...selectedTask.testingPoints, newTestingPoint],
    };

    setTasks(prevTasks =>
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );

    handleCloseModal();
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          🧪 Tester Dashboard
        </h1>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter.developer}
            onChange={(e) =>
              setFilter({ ...filter, developer: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Developers</option>
            {developers.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={filter.client}
            onChange={(e) => setFilter({ ...filter, client: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Clients</option>
            {clients.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          [
            "Total Projects for Testing",
            filteredTasks.length,
            "from-blue-500 to-blue-600",
            <Users size={24} />,
          ],
          [
            "In Progress Testing",
            filteredTasks.filter((t) => t.status === "In Progress").length,
            "from-yellow-500 to-yellow-600",
            <Clock size={24} />,
          ],
          [
            "Ready for Review",
            filteredTasks.filter((t) => t.status === "Finished").length,
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

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Project Name",
                  "Developer",
                  "Client",
                  "Status",
                  "Completion Timeline",
                  "Testing Points",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {t.task}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {t.developer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {t.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        t.status
                      )}`}
                    >
                      {getStatusIcon(t.status)}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatDate(t.due)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                    {t.testingPoints.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() =>
                          router.visit(`/task/${t.id}`)
                        }
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-all duration-200 font-medium"
                      >
                        Add Remarks
                      </button>
                      <button
                        onClick={() => handleOpenAddIssue(t)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-all duration-200 font-medium flex items-center gap-1"
                      >
                        <PlusCircle size={12} />
                        Add New Issue
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No projects available for testing.</p>
          </div>
        )}
      </div>

      {/* Add Issue Modal */}
      {showAddIssueModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Issue to {selectedTask.task}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  placeholder="Describe the issue..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={newIssue.passed}
                      onChange={(e) => setNewIssue({ ...newIssue, passed: true })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Passed</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={!newIssue.passed}
                      onChange={(e) => setNewIssue({ ...newIssue, passed: false })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Failed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tester Name
                </label>
                <input
                  type="text"
                  value={newIssue.testerName}
                  onChange={(e) => setNewIssue({ ...newIssue, testerName: e.target.value })}
                  placeholder="Your name..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tester Remark
                </label>
                <textarea
                  value={newIssue.remark}
                  onChange={(e) => setNewIssue({ ...newIssue, remark: e.target.value })}
                  placeholder="Add your remark..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveIssue}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Add Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
  );
};

export default Tester;