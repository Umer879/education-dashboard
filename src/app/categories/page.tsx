"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
    { id: 4, name: "Furniture" },
    { id: 5, name: "Shoes" },
    { id: 6, name: "Toys" },
    { id: 7, name: "Sports" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handleSave = () => {
    if (categoryName.trim() === "") return;
    if (editCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editCategory.id ? { ...cat, name: categoryName } : cat
        )
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: categoryName },
      ]);
    }
    setCategoryName("");
    setEditCategory(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  const openAddModal = () => {
    setEditCategory(null);
    setCategoryName("");
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
          <h1 className="text-3xl font-extrabold text-green-800 tracking-wide">
            Categories
          </h1>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-700 to-green-900 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
          >
            + Add Category
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            className="border pl-10 pr-4 py-2 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="p-4">Name</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  <td className="p-4">{cat.name}</td>
                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg shadow ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800 transition"
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
                : "bg-green-700 text-white hover:bg-green-800 transition"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-green-800">
                {editCategory ? "Edit Category" : "Add Category"}
              </h2>
              <input
                type="text"
                placeholder="Category Name"
                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition"
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