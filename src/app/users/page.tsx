"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", password: "******" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "******" },
    { id: 3, name: "Ali Khan", email: "ali@example.com", password: "******" },
    { id: 4, name: "Sara Ali", email: "sara@example.com", password: "******" },
    { id: 5, name: "Mike Ross", email: "mike@example.com", password: "******" },
    { id: 6, name: "Jessica Pearson", email: "jessica@example.com", password: "******" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + recordsPerPage);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) return;
    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...formData } : u))
      );
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...formData }]);
    }
    setFormData({ name: "", email: "", password: "" });
    setEditUser(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const openAddModal = () => {
    setEditUser(null);
    setFormData({ name: "", email: "", password: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, password: user.password });
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-900 tracking-tight">Users</h1>
          <button
            onClick={openAddModal}
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200"
          >
            + Add User
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(u)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500 italic">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg shadow-sm transition ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800"
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
                : "bg-green-700 text-white hover:bg-green-800"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 g-black/50 
           flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-green-800">
                {editUser ? "Edit User" : "Add User"}
              </h2>
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
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