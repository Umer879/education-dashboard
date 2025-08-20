"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {  FiTrash2, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import api from "@/utils/api";

// Interfaces
interface Teacher {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string; // Backend field fixed
  category: { _id: string; name: string };
}

interface Assignment {
  _id: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseName: string;
  courseCategory: { _id: string; name: string };
  description: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AssignCoursesToTeachersPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teacherKiId, setTeacherKiId] = useState(teachers[0]?._id || "");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  const totalPages = Math.ceil(assignments.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAssignments = assignments.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [editAssignment, setEditAssignment] = useState<Partial<Assignment>>({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    teacherId: "",
    courseId: "",
    description: "",
    startDate: "",
    endDate: "",
    durationWeeks: 0,
    status: "active",
  });

  // Fetch data
  // Fetch teachers and courses initially
  useEffect(() => {
    const fetchTeachersAndCourses = async () => {
      try {
        const [teacherRes, courseRes] = await Promise.all([
          api.get("/teachers"),
          api.get("/courses"),
        ]);

        const fetchedTeachers = teacherRes.data;
        setTeachers(fetchedTeachers);
        setCourses(courseRes.data);
        // Set first teacher as default
        if (fetchedTeachers.length > 0) {
          setTeacherKiId(fetchedTeachers[0]._id);
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch data", "error");
      }
    };

    fetchTeachersAndCourses();
  }, []);

  // When teacher changes
  useEffect(() => {
    console.log("Selected teacher ID:", teacherKiId);
    fetchAssignments();
  }, [teacherKiId]);

  // Fetch assignments (courses) for selected teacher
  const fetchAssignments = async () => {
    try {
      if (!teacherKiId) return;

      const res = await api.get(`/teacher-courses/${teacherKiId}/courses`);

      console.log("Raw API response:", res.data);

      const coursesData = Array.isArray(res.data.courses)
        ? res.data.courses
        : [];

      console.log("Courses for teacher:", coursesData);

      setAssignments(
        coursesData.map((c: any) => ({
          _id: c._id,
          courseName: c.title,
          description: c.description,
          durationWeeks: c.duration,
        }))
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch courses", "error");
    }
  };

  // ✅ Delete assignment
  const handleDelete = async (courseId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This assignment will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#166534",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/teacher-courses/remove`, {
            data: { teacherId: teacherKiId, courseId },
          });
          setAssignments((prev) => prev.filter((a) => a._id !== courseId));
          Swal.fire("Deleted!", "The assignment has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete assignment", "error");
        }
      }
    });
  };

  // ✅ Open Edit Modal
  const openEditModal = (assignment: Assignment) => {
    setEditAssignment(assignment);
    setShowEditModal(true);
  };

  // ✅ Update assignment
  const handleUpdateAssignment = async () => {
    if (!editAssignment._id || !editAssignment.courseId) {
      Swal.fire("Error", "Missing required fields", "error");
      return;
    }

    try {
      await api.put("/teacher-courses/update", {
        teacherId: teacherKiId,
        oldCourseId: editAssignment._id, // old assigned course
        newCourseId: editAssignment.courseId, // new selected course
      });

      await fetchAssignments(); // Refresh list
      Swal.fire("Success", "Assignment updated successfully!", "success");
      setShowEditModal(false);
    } catch (error) {
      Swal.fire("Error", "Failed to update assignment", "error");
    }
  };

  // Add assignment
  const handleAddAssignment = async () => {
    console.log("sbdf", newAssignment.teacherId);
    if (!newAssignment.teacherId || !newAssignment.courseId) {
      Swal.fire("Error", "Please select a teacher and a course.", "error");
      return;
    }
    try {
      await api.post("/teacher-courses/assign", {
        teacherId: newAssignment.teacherId,
        courseId: newAssignment.courseId,
      });

      // await fetchAssignments();
      Swal.fire("Success", "Course assigned successfully!", "success");
      setNewAssignment({
        teacherId: "",
        courseId: "",
        description: "",
        startDate: "",
        endDate: "",
        durationWeeks: 0,
        status: "active",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to assign course", "error");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1E40AF]">
            Assign Courses to Teachers
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1c49db]"
          >
            <FiPlus /> Assign Course
          </button>
        </div>

        <select
          value={teacherKiId}
          onChange={(e) => setTeacherKiId(e.target.value)}
          className="custom-select"
        >
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Assignment Cards */}
        {/* ✅ Table (only for md and above) */}
        <div className="hidden md:block w-full overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100 mt-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E40AF] text-white">
                <th className="p-4">Course Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b hover:bg-green-50 transition-colors"
                  >
                    <td className="p-4">{a.courseName}</td>
                    <td className="p-4">{a.description}</td>
                    <td className="p-4">{a.durationWeeks}</td>
                    <td className="p-4 flex justify-center gap-4">
                      
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No courses assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Cards (only for sm) */}
        <div className="block md:hidden space-y-4 mt-5">
          {assignments.length > 0 ? (
            assignments.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-[#1E40AF]">
                  {a.courseName}
                </h3>
                <p className="text-gray-600 mt-1">{a.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {a.durationWeeks}
                </p>

                <div className="flex justify-end gap-4 mt-3">
                  <button className="text-blue-500 hover:text-blue-700 transition">
                    <FiEdit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No courses assigned</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1744d8]"
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
                : "bg-[#1E40AF] text-white hover:bg-[#1946d8]"
            }`}
          >
            Next
          </button>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-bold text-[#1E40AF] mb-4">
                Assign New Course
              </h2>

              <select
                value={newAssignment.teacherId || ""}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    teacherId: e.target.value,
                  })
                }
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <select
                value={newAssignment.courseId || ""}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    courseId: e.target.value,
                  })
                }
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Description"
                value={newAssignment.description || ""}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    description: e.target.value,
                  })
                }
                className="border p-2 rounded w-full mb-2"
              />


        

              <input
                type="text"
                placeholder="Duration"
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAssignment}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1b46d3]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
