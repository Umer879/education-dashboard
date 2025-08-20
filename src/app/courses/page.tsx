"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import api from "@/utils/api"; // Axios instance

interface Course {
  _id: string;
  title: string;
  description: string;
  duration?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 600);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      if (editCourse) {
        // PUT request
        const res = await api.put(`/courses/${editCourse._id}`, formData);
        setCourses((prev) =>
          prev.map((c) => (c._id === editCourse._id ? res.data : c))
        );
      } else {
        // POST request
        const res = await api.post("/courses", formData);
        setCourses((prev) => [...prev, res.data]);
      }
      setFormData({ title: "", description: "", duration: "" });
      setEditCourse(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

const handleDelete = async (id: string) => {
  const result = await MySwal.fire({
    title: "Are you sure?",
    text: "This course will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1E40AF",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));

      await MySwal.fire({
        title: "Deleted!",
        text: "Course has been deleted.",
        icon: "success",
        confirmButtonColor: "#1E40AF",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      await MySwal.fire({
        title: "Error!",
        text: "There was a problem deleting the course.",
        icon: "error",
        confirmButtonColor: "#1E40AF",
      });
    }
  }
};

  const openAddModal = () => {
    setEditCourse(null);
    setFormData({ title: "", description: "", duration: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
    });
    setIsModalOpen(true);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCourses.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + recordsPerPage);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <p className="text-center mt-10">Loading courses...</p>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#1E40AF] tracking-tight">Courses</h1>
          <button
            onClick={openAddModal}
            className="bg-[#1E40AF] hover:bg-[#1a46d9] text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200"
          >
            + Add Course
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8ca7ff] transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table for desktop / Cards for mobile */}
        {!isMobile ? (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1E40AF] text-white">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((c) => (
                  <tr key={c._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">{c.title}</td>
                    <td className="p-4">{c.description}</td>
                    <td className="p-4">{c.duration || "-"}</td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedCourses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="block md:hidden space-y-4">
            {paginatedCourses.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#1E40AF]">{c.title}</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(c)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-red-600">Description:</span> {c.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-red-600">Duration:</span> {c.duration || "-"}
                </p>
              </div>
            ))}
            {paginatedCourses.length === 0 && (
              <p className="text-center text-gray-500 italic">No courses found</p>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg shadow-sm transition ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1c47d5]"
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg shadow-sm transition ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1744d7]"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-[#1E40AF]">
                {editCourse ? "Edit Course" : "Add Course"}
              </h2>
              <input
                type="text"
                placeholder="Course Title"
                className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#678af9]"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#7192ff]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Duration (optional)"
                className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#7495ff]"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1644da] transition"
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
