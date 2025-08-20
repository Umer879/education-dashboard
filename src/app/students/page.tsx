"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import api from "@/utils/api";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  password?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [password, setPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // GET students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // POST / PUT student
  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !city.trim() || !area.trim() || (!editStudent && !password.trim())) return;

    try {
      if (editStudent) {
        const res = await api.put(`/students/${editStudent._id}`, {
          name,
          email,
          phone,
          city,
          area,
        });
        setStudents((prev) =>
          prev.map((s) => (s._id === editStudent._id ? res.data : s))
        );
      } else {
        const res = await api.post("/students", {
          name,
          email,
          phone,
          city,
          area,
          password,
        });
        setStudents((prev) => [...prev, res.data]);
      }

      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setArea("");
      setPassword("");
      setEditStudent(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

const handleDelete = async (id: string) => {
  const result = await MySwal.fire({
    title: "Are you sure?",
    text: "This student will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1E40AF",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));

      await MySwal.fire({
        title: "Deleted!",
        text: "Student has been deleted.",
        icon: "success",
        confirmButtonColor: "#1E40AF",
      });
    } catch (err) {
      console.error("Error deleting student:", err);
      await MySwal.fire({
        title: "Error!",
        text: "There was a problem deleting the student.",
        icon: "error",
        confirmButtonColor: "#1E40AF",
      });
    }
  }
};

  const openAddModal = () => {
    setEditStudent(null);
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setArea("");
    setPassword("");
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditStudent(student);
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
    setCity(student.city);
    setArea(student.area);
    setPassword("");
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E40AF] tracking-tight">
            Students
          </h1>
          <button
            onClick={openAddModal}
            className="bg-[#1E40AF] text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            + Add Student
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            className="border border-gray-300 p-2 pl-10 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8ca7ff] transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
     {/* ✅ Table for md and above */}
<div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-[#1E40AF] text-white">
        {["Name", "Email", "Phone", "City", "Area", "Actions"].map((h) => (
          <th key={h} className="p-4">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {paginatedStudents.map((s) => (
        <tr key={s._id} className="border-b hover:bg-green-50 transition-colors">
          <td className="p-4">{s.name}</td>
          <td className="p-4">{s.email}</td>
          <td className="p-4">{s.phone}</td>
          <td className="p-4">{s.city}</td>
          <td className="p-4">{s.area}</td>
          <td className="p-4 flex justify-center gap-4">
            <button onClick={() => openEditModal(s)} className="text-blue-500 hover:text-blue-700">
              <FiEdit size={18} />
            </button>
            <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700">
              <FiTrash2 size={18} />
            </button>
          </td>
        </tr>
      ))}
      {paginatedStudents.length === 0 && (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-500 italic">
            No students found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* ✅ Mobile Cards for < md */}
<div className="block md:hidden space-y-4">
  {paginatedStudents.length > 0 ? (
    paginatedStudents.map((s) => (
      <div
        key={s._id}
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
      >
        <h3 className="text-lg font-bold text-[#1E40AF]"> {s.name}</h3>
        <p><span className="text-red-600">Email:</span> {s.email}</p>
        <p><span className="text-red-600">Phone:</span> {s.phone}</p>
        <p><span className="text-red-600">City:</span> {s.city}</p>
        <p><span className="text-red-600">Area:</span> {s.area}</p>

        <div className="flex justify-end gap-4 mt-3">
          <button onClick={() => openEditModal(s)} className="text-blue-500 hover:text-blue-700 transition">
            <FiEdit size={18} />
          </button>
          <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 transition">
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 italic">No students found</p>
  )}
</div>


        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg shadow ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#1E40AF] text-white hover:bg-[#1743d3] transition"}`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg shadow ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#1E40AF] text-white hover:bg-[#1d45c7] transition"}`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-[#1E40AF]">
                {editStudent ? "Edit Student" : "Add Student"}
              </h2>
              <input type="text" placeholder="Name" className="border p-2 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email" className="border p-2 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="text" placeholder="Phone" className="border p-2 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input type="text" placeholder="City" className="border p-2 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]" value={city} onChange={(e) => setCity(e.target.value)} />
              <input type="text" placeholder="Area" className="border p-2 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]" value={area} onChange={(e) => setArea(e.target.value)} />
              {!editStudent && <input type="password" placeholder="Password" className="border p-2 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#8da7ff]" value={password} onChange={(e) => setPassword(e.target.value)} />}
              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg shadow-md hover:bg-[#1945d5] transition">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeIn { from {opacity:0} to {opacity:1} }
          @keyframes scaleIn { from {transform: scale(0.95); opacity:0} to {transform: scale(1); opacity:1} }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        `}</style>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
