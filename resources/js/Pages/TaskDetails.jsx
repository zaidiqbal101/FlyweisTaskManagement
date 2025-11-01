// resources/js/Pages/TaskDetails.jsx
import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  X,
  PlusCircle,
  User,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  Trash2,
  Search,
  FilePlus,
  FileText,
  Calendar,
} from "lucide-react";

const TaskDetails = () => {
  const { task: taskData, flash } = usePage().props;
  const [searchTerm, setSearchTerm] = useState("");
  const [newDocument, setNewDocument] = useState({ name: "", note: "" });

  if (!taskData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-6">
            Task not found. Please return to the dashboard.
          </p>
          <button
            onClick={() => router.visit("/manager")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            Back to Manager
          </button>
        </div>
      </div>
    );
  }

  const [localTaskData, setLocalTaskData] = useState({
    ...taskData,
    managerRemarks: taskData?.managerRemarks || ["", "", ""],
    overallRemark: taskData?.overallRemark || "",
    documents: taskData?.documents || [],
  });

  const handleStatusChange = (status) =>
    setLocalTaskData({ ...localTaskData, status });

  const handleUpdateManagerRemark = (index, value) => {
    const updatedRemarks = [...localTaskData.managerRemarks];
    updatedRemarks[index] = value;
    setLocalTaskData({ ...localTaskData, managerRemarks: updatedRemarks });
  };

  const handleUpdateTestingPoint = (id, updates) => {
    setLocalTaskData({
      ...localTaskData,
      testingPoints: localTaskData.testingPoints.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const handleAddDocument = () => {
    if (newDocument.name && newDocument.note.trim()) {
      setLocalTaskData({
        ...localTaskData,
        documents: [
          ...localTaskData.documents,
          {
            name: newDocument.name,
            note: newDocument.note,
          },
        ],
      });
      setNewDocument({ name: "", note: "" });
    }
  };

  const handleRemoveDocument = (index) => {
    setLocalTaskData({
      ...localTaskData,
      documents: localTaskData.documents.filter((_, i) => i !== index),
    });
  };

  // --------------------------------------------------------------
  //  NEW: proper handleSave (replaces the old `x` function)
  // --------------------------------------------------------------
  const handleSave = () => {
    router.put(
      `/task/${localTaskData.id}`,
      {
        status: localTaskData.status,
        devRemark: localTaskData.devRemark,
        clientRemark: localTaskData.clientRemark,
        overallRemark: localTaskData.overallRemark,
        managerRemarks: localTaskData.managerRemarks,
        testingPoints: localTaskData.testingPoints,
        documents: localTaskData.documents,
      },
      {
        onSuccess: () => {
          // Optional: go back to manager after successful save
          // router.visit("/manager");
        },
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const filteredTestingPoints = localTaskData.testingPoints.filter((p) =>
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.remark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.testerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.managerRemark?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canFinish =
    localTaskData.status === "In Progress" &&
    localTaskData.testingPoints.length > 0 &&
    localTaskData.testingPoints.every((p) => p.passed);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Finished":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Flash Message */}
          {flash?.success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
              {flash.success}
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                    <CheckCircle className="text-white w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {localTaskData.task}
                  </h2>
                </div>
                <div className="flex items-center gap-2 ml-14">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                      localTaskData.status
                    )}`}
                  >
                    {localTaskData.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.visit("/manager")}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
              >
                <X size={18} /> Close
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search testing points, remarks, tester names..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Task Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Developer
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">
                {localTaskData.developer}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Client
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">
                {localTaskData.client}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Manager Timeline
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">
                {localTaskData.due}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Developer Expected
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">
                {localTaskData.expectedTimeline || "Not set"}
              </p>
            </div>
          </div>

          {/* Status Selector */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Task Status
            </label>
            <select
              value={localTaskData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium cursor-pointer"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>On Hold</option>
              <option>Finished</option>
            </select>
          </div>

          {/* Remarks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
              <label className="block font-semibold mb-3 text-blue-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Developer Remark
              </label>
              <input
                type="text"
                value={localTaskData.devRemark}
                readOnly
                className="rounded-xl p-3 w-full border-2 border-blue-200 bg-white cursor-not-allowed text-gray-700"
              />
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
              <label className="block font-semibold mb-3 text-purple-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Client Remark
              </label>
              <input
                type="text"
                value={localTaskData.clientRemark}
                readOnly
                className="rounded-xl p-3 w-full border-2 border-purple-200 bg-white cursor-not-allowed text-gray-700"
              />
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm border border-red-200">
              <label className="block font-semibold mb-3 text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Issues Found
              </label>
              <div className="space-y-3">
                {["1.", "2.", "3."].map((label, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="font-bold text-sm text-red-700 self-start mt-3">
                      {label}
                    </span>
                    <input
                      type="text"
                      value={localTaskData.managerRemarks[index] || ""}
                      onChange={(e) =>
                        handleUpdateManagerRemark(index, e.target.value)
                      }
                      placeholder={`Issue ${index + 1}...`}
                      className="flex-1 border-2 border-red-200 bg-white rounded-xl p-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Managers Overall Remark Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <label className="block font-semibold mb-3 text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Managers Overall Remark
            </label>
            <textarea
              value={localTaskData.overallRemark}
              onChange={(e) =>
                setLocalTaskData({
                  ...localTaskData,
                  overallRemark: e.target.value,
                })
              }
              placeholder="Add overall remark..."
              className="w-full border-2 border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-vertical min-h-[100px]"
            />
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="text-indigo-600 w-5 h-5" />
              </div>
              Documents & Files
            </h3>

            {localTaskData.documents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FilePlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 italic">
                  No documents uploaded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {localTaskData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {doc.name}
                        </p>
                        <p className="text-sm text-gray-500">{doc.note}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 items-end bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-2 border-indigo-200">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  placeholder="Enter file name"
                  value={newDocument.name}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, name: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <input
                  type="text"
                  value={newDocument.note}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, note: e.target.value })
                  }
                  placeholder="Add a note for this document..."
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white transition-all"
                />
              </div>
              <button
                onClick={handleAddDocument}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <FilePlus size={18} /> Add
              </button>
            </div>
          </div>

          {/* Testing Data Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600 w-5 h-5" />
              </div>
              Testing Data & Results
            </h3>

            {filteredTestingPoints.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <AlertCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 italic text-lg">
                  {searchTerm
                    ? `No testing data matches "${searchTerm}".`
                    : "No testing data available yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tester Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tester Remark
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Manager Remark
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredTestingPoints.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-blue-50 transition-colors duration-150 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {localTaskData.task}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {p.testerName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {p.addedDate || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          {p.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 p-1.5 text-xs font-bold rounded-full border-2 ${
                              p.passed
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            {p.passed ? "Passed" : "Failed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          {p.remark || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={p.managerRemark || ""}
                            onChange={(e) =>
                              handleUpdateTestingPoint(p.id, {
                                managerRemark: e.target.value,
                              })
                            }
                            placeholder="Add remark..."
                            className="border-2 border-gray-200 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm transition-all"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            {canFinish && (
              <button
                onClick={() => handleStatusChange("Finished")}
                className="flex-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:scale-105"
              >
                <CheckCircle size={24} /> Mark Task as Finished
              </button>
            )}

            <button
              onClick={handleSave}
              className={`${
                canFinish ? "flex-1" : "w-full"
              } bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg`}
            >
              <Save size={22} /> Save & Return
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TaskDetails;