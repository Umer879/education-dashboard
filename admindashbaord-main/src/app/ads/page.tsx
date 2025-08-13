"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Swal from "sweetalert2";

interface Category {
  _id: string;
  name: string;
}

interface Ad {
  _id: string;
  category_id: Category;
  user_id: string;
  subject: string;
  description: string;
  photos: string[];
  from: string;
  to: string;
  preferredDate: string;
  preferredTime: string;
  phone: string;
  email: string;
  budget: string;
  status: string;
  accepted_by: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([
    {
      _id: "68981da67efa53918215b80a",
      category_id: { _id: "6896ffb173a11a21c0922bfd", name: "Cleaning" },
      user_id: "6896ee8fbc9593dbebfd2ef4",
      subject: "Moving Chairs",
      description: "I need to Move Chairs",
      photos: [
        "1754799526702-391882606-xcvxcvxcvxcvfd.PNG",
        "1754799526704-268790349-xdz.PNG",
        "1754799526708-967561107-xsdfsdf.PNG"
      ],
      from: "Manchester",
      to: "London",
      preferredDate: "12-09-2025",
      preferredTime: "10:00",
      phone: "03030333033",
      email: "yasirkh261@gmail.com",
      budget: "5000",
      status: "pending",
      accepted_by: null,
      createdAt: "2025-08-10T04:18:46.745Z",
      updatedAt: "2025-08-10T04:18:46.745Z"
    },
    {
      _id: "68981db67efa53918215b80c",
      category_id: { _id: "6896ffb173a11a21c0922bfd", name: "Cleaning" },
      user_id: "6896ee8fbc9593dbebfd2ef4",
      subject: "Cleaning Kitchen",
      description: "I need to clean kitchen",
      photos: [
        "1754799542705-24739588-xcvxcvxcvxcvfd.PNG",
        "1754799542706-656427902-xdz.PNG",
        "1754799542707-933846504-xsdfsdf.PNG"
      ],
      from: "Manchester",
      to: "London",
      preferredDate: "12-09-2025",
      preferredTime: "10:00",
      phone: "03030333033",
      email: "yasirkh261@gmail.com",
      budget: "5000",
      status: "pending",
      accepted_by: null,
      createdAt: "2025-08-10T04:19:02.714Z",
      updatedAt: "2025-08-10T04:19:02.714Z"
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalPages = Math.ceil(ads.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAds = ads.slice(startIndex, startIndex + recordsPerPage);

  const [viewAd, setViewAd] = useState<Ad | null>(null);
  const [editAd, setEditAd] = useState<Ad | null>(null);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This ad will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#166534",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setAds((prev) => prev.filter((ad) => ad._id !== id));
        Swal.fire("Deleted!", "The ad has been deleted.", "success");
      }
    });
  };

  const handleEditSave = () => {
    if (!editAd) return;
    setAds((prev) => prev.map((a) => (a._id === editAd._id ? editAd : a)));
    setEditAd(null);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">Ads</h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAds.map((ad) => (
            <div
              key={ad._id}
              className="bg-white shadow rounded-lg overflow-hidden border"
            >
              <img
                src={ad.photos[0]}
                alt={ad.subject}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-green-800">{ad.subject}</h2>
                <p className="text-gray-600">Budget: ${ad.budget}</p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setViewAd(ad)}
                    className="text-green-800 hover:text-green-600"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => setEditAd(ad)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
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
                : "bg-green-800 text-white hover:bg-green-700"
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
                : "bg-green-800 text-white hover:bg-green-700"
            }`}
          >
            Next
          </button>
        </div>

        {/* View Modal */}
        {viewAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                {viewAd.subject}
              </h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {viewAd.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Photo ${i}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
              <p className="mb-2"><strong>Description:</strong> {viewAd.description}</p>
              <p className="mb-2"><strong>Category:</strong> {viewAd.category_id.name}</p>
              <p className="mb-2"><strong>From:</strong> {viewAd.from}</p>
              <p className="mb-2"><strong>To:</strong> {viewAd.to}</p>
              <p className="mb-2"><strong>Preferred Date:</strong> {viewAd.preferredDate}</p>
              <p className="mb-2"><strong>Preferred Time:</strong> {viewAd.preferredTime}</p>
              <p className="mb-2"><strong>Phone:</strong> {viewAd.phone}</p>
              <p className="mb-2"><strong>Email:</strong> {viewAd.email}</p>
              <p className="mb-2"><strong>Budget:</strong> ${viewAd.budget}</p>
              <p className="mb-2"><strong>Status:</strong> {viewAd.status}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setViewAd(null)}
                  className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editAd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Edit Ad
              </h2>
              <input
                type="text"
                placeholder="Subject"
                value={editAd.subject}
                onChange={(e) => setEditAd({ ...editAd, subject: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={editAd.description}
                onChange={(e) => setEditAd({ ...editAd, description: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Budget"
                value={editAd.budget}
                onChange={(e) => setEditAd({ ...editAd, budget: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setEditAd({
                    ...editAd,
                    photos: e.target.files
                      ? Array.from(e.target.files).map((f) => URL.createObjectURL(f))
                      : editAd.photos
                  })
                }
                className="mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditAd(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700"
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
