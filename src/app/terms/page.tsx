import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Terms() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Terms (CRUD)</h1>
        <p>Here will be the Terms CRUD operations...</p>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
