"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {  FiTrash2,  FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import api from "@/utils/api";

// Interfaces
interface CourseCategory {
  _id: string;
  name: string;
}

interface Assignment {
  _id: string;
  studentName: string;
  courseName: string;
  courseCategory: CourseCategory;
  description: string;
  durationWeeks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  category: CourseCategory;
  description?: string;
  durationWeeks?: number;
}

export default function AssignCoursesToStudentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentId, setStudentId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const totalPages = Math.ceil(assignments.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAssignments = assignments.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // const [viewItem, setViewItem] = useState<Assignment | null>(null);
  const [editItem, setEditItem] = useState<Assignment | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    _id: "",
    studentName: "",
    courseName: "",
    courseCategory: { _id: "", name: "" },
    description: "",
    durationWeeks: 0,
    status: "active",
  });

  // Fetch students and courses
  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get("/students"),
          api.get("/courses"),
        ]);

        setStudents(studentsRes.data);
        setCourses(coursesRes.data);

        if (studentsRes.data.length > 0) {
          setStudentId(studentsRes.data[0]._id);
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch students or courses", "error");
      }
    };

    fetchStudentsAndCourses();
  }, []);

  // Fetch assignments for selected student
  const fetchAssignments = async () => {
    if (!studentId) return;

    try {
      const res = await api.get(`/student-courses/${studentId}/courses`);
      console.log("Student courses raw:", res.data);

      const coursesData = Array.isArray(res.data.courses)
        ? res.data.courses
        : [];
      setAssignments(
        coursesData.map((c) => ({
          _id: c._id,
          studentName: res.data.name,
          courseName: c.course.title,
          description: c.description || "",
          durationWeeks: c.course.duration,
          status: c.status || "active",
        }))
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch student assignments", "error");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [studentId]);

  // Assign new course to student
  const handleAssignCourse = async () => {
    if (!studentId || !newAssignment.courseName) {
      Swal.fire("Error", "Please select student and course", "error");
      return;
    }

    try {
      await api.post("/student-courses/assign", {
        studentId,
        courseId: newAssignment._id,
        durationWeeks: newAssignment.durationWeeks,
      });

      Swal.fire("Success", "Course assigned successfully!", "success");
      setShowAssignModal(false);
      setNewAssignment({
        _id: "",
        studentName: "",
        courseName: "",
        durationWeeks: 0,
        status: "active",
      });
      fetchAssignments();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to assign course", "error");
    }
  };

 const handleDelete = async (id: string) => {
  console.log("Deleting subdocument _id:", id);
  console.log("StudentId:", studentId);

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
        // 👇 send subdocument _id in URL and studentId in body
        await api.delete(`/student-courses/remove/${id}`, {
          data: { studentId },
        });

        // update state on frontend
        setAssignments((prev) => prev.filter((a) => a._id !== id));

        Swal.fire("Deleted!", "Assignment deleted successfully", "success");
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete assignment", "error");
      }
    }
  });
};


  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
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

        <section>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="custom-select"
          >
            <option value="">Select a Student</option>
            {students.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </section>

        {/* Assignment Cards */}
        {/* Desktop / Tablet: Table */}
        <div className="hidden md:table w-full overflow-x-auto mt-5 bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E40AF] text-white">
                <th className="p-4">Course Name</th>
                <th className="p-4">Student</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr
                  key={a._id}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  <td className="p-4">{a.courseName}</td>
                  <td className="p-4">{a.studentName}</td>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Cards */}
        <div className="block md:hidden space-y-4 mt-5">
          {paginatedAssignments.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <h2 className="text-lg font-bold text-[#1E40AF]">
                {item.courseName}
              </h2>
              <p className="text-gray-600">Student: {item.studentName}</p>
              <p className="text-gray-600">Duration: {item.durationWeeks}</p>
              <div className="flex justify-end gap-3 mt-4">
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

        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-[#1e4be1] mb-4">
                Assign New Course
              </h2>

              {/* Student Selection */}
              <label className="block mb-2 font-semibold">Select Student</label>
              <select
                value={studentId || ""}
                onChange={(e) => setStudentId(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Course Selection */}
              <label className="block mb-2 font-semibold">Select Course</label>
              <select
                value={newAssignment._id || ""}
                onChange={(e) => {
                  const selected = courses.find(
                    (c) => c._id === e.target.value
                  );
                  if (selected) {
                    setNewAssignment({
                      ...newAssignment,
                      _id: selected._id,
                      courseName: selected.title,
                      courseCategory: selected.category,
                      description: selected.description,
                      image: selected.image || "",
                      durationWeeks: selected.durationWeeks || 0,
                      startDate: selected.startDate,
                      endDate: selected.endDate,
                    });
                  }
                }}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>

              {/* Duration */}
              <label className="block mb-2 font-semibold">
                Duration 
              </label>
              <input
                type="text "
                value={newAssignment.durationWeeks || 0}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    durationWeeks: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 rounded w-full mb-4"
                min={1}
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

        {/* View & Edit Modals remain same as your previous code */}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
