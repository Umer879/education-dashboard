"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiTrash2, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import api from "@/utils/api";

// Interfaces
interface Teacher {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string; // Backend field fixed
  email: string;
}

interface Assignment {
  _id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignedAt: string;
}

export default function AssignStudentsToTeachersPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherId, setTeacherId] = useState(teachers[0]?._id || "");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(assignments.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAssignments = assignments.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    teacherId: "",
    studentId: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchTeachersAndStudents = async () => {
      try {
        const [teacherRes, studentRes] = await Promise.all([
          api.get("/teachers"),
          api.get("/students"),
        ]);
        const fetchedTeachers = teacherRes.data;
        setTeachers(fetchedTeachers);
        setStudents(studentRes.data);
        if (fetchedTeachers.length > 0) setTeacherId(fetchedTeachers[0]._id);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch data", "error");
      }
    };

    fetchTeachersAndStudents();
  }, []);

  // Fetch assignments when teacher changes
  useEffect(() => {
    if (teacherId) fetchAssignments();
  }, [teacherId]);

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/teacher-students/${teacherId}/students`);
      const studentsData = Array.isArray(res.data.students) ? res.data.students : [];
      setAssignments(
        studentsData.map((s: any) => ({
          _id: s._id,
          studentId: s._id,
          studentName: s.name,
          studentEmail: s.email,
        }))
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch assignments", "error");
    }
  };

  // Delete assignment
  const handleDelete = async (studentId: string) => {
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
          await api.delete(`/teacher-students/remove`, {
            data: { teacherId, studentId },
          });
          setAssignments((prev) => prev.filter((a) => a.studentId !== studentId));
          Swal.fire("Deleted!", "The assignment has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete assignment", "error");
        }
      }
    });
  };

  // Add assignment
  const handleAddAssignment = async () => {
    if (!newAssignment.teacherId || !newAssignment.studentId) {
      Swal.fire("Error", "Please select a teacher and a student.", "error");
      return;
    }
    try {
      await api.post("/teacher-students/assign", {
        teacherId: newAssignment.teacherId,
        studentId: newAssignment.studentId,
      });
      Swal.fire("Success", "Student assigned successfully!", "success");
      setNewAssignment({ teacherId: "", studentId: "" });
      setShowAddModal(false);
      fetchAssignments();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to assign student", "error");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1E40AF]">
            Assign Students to Teachers
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded hover:bg-[#1c49db]"
          >
            <FiPlus /> Assign Student
          </button>
        </div>

        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="custom-select mb-4"
        >
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Assignments Table */}
        <div className="hidden md:block w-full overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E40AF] text-white">
                <th className="p-4">Student Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                paginatedAssignments.map((a) => (
                  <tr key={a.studentId} className="border-b hover:bg-green-50 transition-colors">
                    <td className="p-4">{a.studentName}</td>
                    <td className="p-4">{a.studentEmail}</td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleDelete(a.studentId)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No students assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4 mt-5">
          {assignments.length > 0 ? (
            assignments.map((a) => (
              <div key={a.studentId} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-bold text-[#1E40AF]">{a.studentName}</h3>
                <p className="text-gray-600 mt-1">{a.studentEmail}</p>
                <div className="flex justify-end gap-4 mt-3">
                  <button
                    onClick={() => handleDelete(a.studentId)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No students assigned</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#1E40AF] text-white hover:bg-[#1744d8]"
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
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#1E40AF] text-white hover:bg-[#1946d8]"
            }`}
          >
            Next
          </button>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-bold text-[#1E40AF] mb-4">Assign New Student</h2>

              <select
                value={newAssignment.teacherId || ""}
                onChange={(e) => setNewAssignment({ ...newAssignment, teacherId: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>

              <select
                value={newAssignment.studentId || ""}
                onChange={(e) => setNewAssignment({ ...newAssignment, studentId: e.target.value })}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>

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
