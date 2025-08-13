"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  password: string;
  confirmpassword: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Ali Khan",
      email: "ali@student.com",
      phone: "03001234567",
      city: "Karachi",
      area: "DHA",
      password: "******",
      confirmpassword: "******",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      email: "sara@student.com",
      phone: "03007654321",
      city: "Lahore",
      area: "Gulberg",
      password: "******",
      confirmpassword: "******",
    },
  ]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const filteredStudents = students.filter((stu) =>
    stu.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((stu) => stu.id !== id));
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E40AF] tracking-tight">
            Students
          </h1>
          <button className="bg-[#1E40AF] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#1944d2] active:scale-95 transition-transform">
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

        {/* Table for Desktop / Cards for Mobile */}
        {!isMobile ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E40AF] text-white">
                  {["Name", "Email", "Phone", "City", "Area", "Actions"].map(
                    (header) => (
                      <th key={header} className="p-3 text-sm font-semibold">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((stu) => (
                  <tr
                    key={stu.id}
                    className="border-b last:border-0 hover:bg-green-50 transition-colors"
                  >
                    <td className="p-3">{stu.name}</td>
                    <td className="p-3">{stu.email}</td>
                    <td className="p-3">{stu.phone}</td>
                    <td className="p-3">{stu.city}</td>
                    <td className="p-3">{stu.area}</td>
                    <td className="p-3 flex justify-center gap-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(stu.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-gray-500 italic"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedStudents.map((stu) => (
              <div
                key={stu.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-[#1E40AF]">
                    {stu.name}
                  </h2>
                  <div className="flex gap-3">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(stu.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {stu.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {stu.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">City:</span> {stu.city}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Area:</span> {stu.area}
                </p>
              </div>
            ))}
            {paginatedStudents.length === 0 && (
              <p className="text-center text-gray-500 italic">
                No students found
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg shadow-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1a48df] transition"
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
            className={`px-4 py-2 rounded-lg shadow-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#1E40AF] text-white hover:bg-[#1844d3] transition"
            }`}
          >
            Next
          </button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
