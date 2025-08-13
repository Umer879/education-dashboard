"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  password: string;
  confirmpassword: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: "Tech Solutions",
      email: "info@tech.com",
      phone: "03001234567",
      city: "Karachi",
      area: "DHA",
      password: "******",
      confirmpassword: "******",
    },
    {
      id: 2,
      name: "ABC Traders",
      email: "abc@traders.com",
      phone: "03007654321",
      city: "Lahore",
      area: "Gulberg",
      password: "******",
      confirmpassword: "******",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Omit<Company, "id">>({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    password: "",
    confirmpassword: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const filteredCompanies = companies.filter((comp) =>
    comp.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handleSave = () => {
    if (!formData.name || !formData.email) return;
    if (editCompany) {
      setCompanies((prev) =>
        prev.map((comp) =>
          comp.id === editCompany.id ? { ...comp, ...formData } : comp
        )
      );
    } else {
      setCompanies((prev) => [
        ...prev,
        { id: Date.now(), ...formData },
      ]);
    }
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
      confirmpassword: "",
    });
    setEditCompany(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this company?")) {
      setCompanies((prev) => prev.filter((comp) => comp.id !== id));
    }
  };

  const openAddModal = () => {
    setEditCompany(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
      confirmpassword: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (company: Company) => {
    setEditCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      city: company.city,
      area: company.area,
      password: company.password,
      confirmpassword: company.confirmpassword,
    });
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 tracking-tight">
            Companies
          </h1>
          <button
            onClick={openAddModal}
            className="bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-800 active:scale-95 transition-transform"
          >
            + Add Company
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-800 text-white">
                {["Name", "Email", "Phone", "City", "Area", "Actions"].map((header) => (
                  <th key={header} className="p-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCompanies.map((comp) => (
                <tr
                  key={comp.id}
                  className="border-b last:border-0 hover:bg-green-50 transition-colors"
                >
                  <td className="p-3">{comp.name}</td>
                  <td className="p-3">{comp.email}</td>
                  <td className="p-3">{comp.phone}</td>
                  <td className="p-3">{comp.city}</td>
                  <td className="p-3">{comp.area}</td>
                  <td className="p-3 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(comp)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No companies found
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
            className={`px-4 py-2 rounded-lg shadow-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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
            className={`px-4 py-2 rounded-lg shadow-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800 transition"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 g-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl transform animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-green-900">
                {editCompany ? "Edit Company" : "Add Company"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {["name", "email", "phone", "city", "area", "password", "confirmpassword"].map((field, i) => (
                  <input
                    key={field}
                    type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                    placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                    className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 active:scale-95 transition-transform"
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