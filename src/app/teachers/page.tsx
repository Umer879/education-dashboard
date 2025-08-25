"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

import api from "@/utils/api";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  contact: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherContact, setTeacherContact] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // GET teachers from API
  useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers", {
        withCredentials: true, // 👈 yahan add kar do
      });
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };
  fetchTeachers();
}, []);


  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTeachers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // POST or PUT teacher
  const handleSave = async () => {
    if (
      !teacherName.trim() ||
      !teacherEmail.trim() ||
      !teacherContact.trim() ||
      (!editTeacher && !teacherPassword.trim())
    )
      return;

    try {
      if (editTeacher) {
        const res = await api.put(`/teachers/${editTeacher._id}`, {
          name: teacherName,
          email: teacherEmail,
          contact: teacherContact,
        });
        setTeachers((prev) =>
          prev.map((t) => (t._id === editTeacher._id ? res.data : t))
        );
      } else {
        const res = await api.post("/teachers", {
          name: teacherName,
          email: teacherEmail,
          contact: teacherContact,
          password: teacherPassword,
          courses: [],
        });
        setTeachers((prev) => [...prev, res.data]);
      }

      // Reset form
      setTeacherName("");
      setTeacherEmail("");
      setTeacherContact("");
      setTeacherPassword("");
      setEditTeacher(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving teacher:", err);
    }
  };

  // delete method
  const handleDelete = async (id: string) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "This teacher will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1E40AF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await api.delete(`/teachers/${id}`);
        setTeachers((prev) => prev.filter((t) => t._id !== id));

        await MySwal.fire({
          title: "Deleted!",
          text: "Teacher has been deleted.",
          icon: "success",
          confirmButtonColor: "#1E40AF",
        });
      }
    } catch (err) {
      console.error("Error deleting teacher:", err);
      await MySwal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#1E40AF",
      });
    }
  };

  const openAddModal = () => {
    setEditTeacher(null);
    setTeacherName("");
    setTeacherEmail("");
    setTeacherContact("");
    setTeacherPassword("");
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditTeacher(teacher);
    setTeacherName(teacher.name);
    setTeacherEmail(teacher.email);
    setTeacherContact(teacher.contact);
    setTeacherPassword("");
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E40AF] tracking-tight">
            Teachers
          </h1>
          <button
            onClick={openAddModal}
            className="bg-[#1E40AF] text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            + Add Teacher
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search teachers..."
            className="border border-gray-300 p-2 pl-10 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8ca7ff] transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* ✅ Table (md and above) */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E40AF] text-white">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.map((t) => (
                <tr
                  key={t._id}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  <td className="p-4">{t.name}</td>
                  <td className="p-4">{t.email}</td>
                  <td className="p-4">{t.contact}</td>
                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(t)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedTeachers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Cards (below md) */}
        <div className="block md:hidden space-y-4">
          {paginatedTeachers.length > 0 ? (
            paginatedTeachers.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-[#1E40AF]"> {t.name}</h3>
                <p className="text-gray-600">
                  <span className="text-red-600">Email:</span> {t.email}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="text-red-600">Contact:</span> {t.contact}
                </p>

                <div className="flex justify-end gap-4 mt-3">
                  <button
                    onClick={() => openEditModal(t)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 italic">
              No teachers found
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg shadow ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1743d3] transition"
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg shadow ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1d45c7] transition"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-[#1E40AF]">
                {editTeacher ? "Edit Teacher" : "Add Teacher"}
              </h2>
              <input
                type="text"
                placeholder="Teacher Name"
                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Teacher Email"
                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Teacher Contact"
                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]"
                value={teacherContact}
                onChange={(e) => setTeacherContact(e.target.value)}
              />
              {!editTeacher && (
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                />
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg shadow-md hover:bg-[#1945d5] transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.2s ease-out;
          }
        `}</style>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
