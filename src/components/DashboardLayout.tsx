import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      {/* Add top padding for mobile to prevent content overlap */}
      <main className="flex-1  p-6 pt-20 md:pt-10">{children}</main>
    </div>
  );
}
