"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";

interface CourseCategory {
  _id: string;
  name: string;
}

interface Assignment {
  _id: string;
  image: string;
  studentName: string;
  courseName: string;
  courseCategory: CourseCategory;
  description: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AssignCoursesToStudentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      _id: "1",
      image: "/assets/math.jpeg",
      studentName: "Ali Khan",
      courseName: "Mathematics 101",
      courseCategory: { _id: "c1", name: "Mathematics" },
      description: "Basic algebra and geometry for beginners.",
      startDate: "2025-09-01",
      endDate: "2025-12-01",
      durationWeeks: 12,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      image: "/assets/math.jpeg",
      studentName: "Sara Ahmed",
      courseName: "Physics for Engineers",
      courseCategory: { _id: "c2", name: "Physics" },
      description: "Introductory mechanics and thermodynamics.",
      startDate: "2025-09-05",
      endDate: "2025-12-15",
      durationWeeks: 14,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const totalPages = Math.ceil(assignments.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAssignments = assignments.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const [viewItem, setViewItem] = useState<Assignment | null>(null);
  const [editItem, setEditItem] = useState<Assignment | null>(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Assignment>({
    _id: "",
    image: "",
    studentName: "",
    courseName: "",
    courseCategory: { _id: "", name: "" },
    description: "",
    startDate: "",
    endDate: "",
    durationWeeks: 0,
    status: "active",
    createdAt: "",
    updatedAt: "",
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This assignment will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#166534",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setAssignments((prev) => prev.filter((a) => a._id !== id));
        Swal.fire("Deleted!", "The assignment has been deleted.", "success");
      }
    });
  };

  const handleEditSave = () => {
    if (!editItem) return;
    setAssignments((prev) =>
      prev.map((a) => (a._id === editItem._id ? editItem : a))
    );
    setEditItem(null);
  };

  const handleAssignCourse = () => {
    const newId = (assignments.length + 1).toString();
    setAssignments((prev) => [
      ...prev,
      {
        ...newAssignment,
        _id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setShowAssignModal(false);
    setNewAssignment({
      _id: "",
      image: "",
      studentName: "",
      courseName: "",
      courseCategory: { _id: "", name: "" },
      description: "",
      startDate: "",
      endDate: "",
      durationWeeks: 0,
      status: "active",
      createdAt: "",
      updatedAt: "",
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1E40AF]">
            Assign Courses to Students
          </h1>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1947dd]"
          >
            <FiPlus size={18} />
            Assign Course
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAssignments.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-lg overflow-hidden border p-4"
            >
              <div className="mb-4">
                <img
                  src={item.image}
                  alt={item.courseName}
                  className="rounded w-full h-40 object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-[#1E40AF]">
                {item.courseName}
              </h2>
              <p className="text-gray-600">Student: {item.studentName}</p>
              <p className="text-gray-600">
                Duration: {item.durationWeeks} weeks
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setViewItem({ ...item })}
                  className="text-[#1E40AF] hover:text-[#1c49dd]"
                >
                  <FiEye size={18} />
                </button>
                <button
                  onClick={() => setEditItem({ ...item })}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1945d4]"
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1947de]"
            }`}
          >
            Next
          </button>
        </div>

        {/* Assign Course Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-[#1e4be1] mb-4">
                Assign New Course
              </h2>
               {/* Image Upload */}
      <div className="mb-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const imageUrl = URL.createObjectURL(file);
              setNewAssignment({ ...newAssignment, image: imageUrl });
            }
          }}
          className="border p-2 rounded w-full"
        />
      </div>
              <input
                type="text"
                placeholder="Course Name"
                value={newAssignment.courseName}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, courseName: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Student Name"
                value={newAssignment.studentName}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, studentName: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Category Name"
                value={newAssignment.courseCategory.name}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    courseCategory: { _id: "", name: e.target.value },
                  })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, description: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newAssignment.startDate}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, startDate: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="date"
                placeholder="End Date"
                value={newAssignment.endDate}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, endDate: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="Duration (weeks)"
                value={newAssignment.durationWeeks || ""}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    durationWeeks: Number(e.target.value),
                  })
                }
                className="border p-2 rounded w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignCourse}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1b48db]"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <img
                src={viewItem.image}
                alt={viewItem.courseName}
                className="rounded mb-4 w-full h-48 object-cover"
              />
              <h2 className="text-xl font-bold text-[#1E40AF] mb-4">
                {viewItem.courseName}
              </h2>
              <p className="mb-2">
                <strong>Student:</strong> {viewItem.studentName}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {viewItem.courseCategory.name}
              </p>
              <p className="mb-2">
                <strong>Description:</strong> {viewItem.description}
              </p>
              <p className="mb-2">
                <strong>Start Date:</strong> {viewItem.startDate}
              </p>
              <p className="mb-2">
                <strong>End Date:</strong> {viewItem.endDate}
              </p>
              <p className="mb-2">
                <strong>Duration:</strong> {viewItem.durationWeeks} weeks
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {viewItem.status}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setViewItem(null)}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1b48dc]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-[#1E40AF] mb-4">
                Edit Assignment
              </h2>
              <input
                type="text"
                placeholder="Course Name"
                value={editItem.courseName || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, courseName: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Student Name"
                value={editItem.studentName || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, studentName: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={editItem.description || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="Duration (weeks)"
                value={editItem.durationWeeks || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    durationWeeks: Number(e.target.value),
                  })
                }
                className="border p-2 rounded w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1c48d9]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
