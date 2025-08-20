"use client";
import { ReactNode } from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GraduationCap,
  UserCheck,
  BookOpen,
  UserCog,
  UsersRound,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  { name: "Teachers", href: "/teachers", icon: <GraduationCap size={20} /> },
  { name: "Students", href: "/students", icon: <UserCheck size={20} /> },
  { name: "Courses", href: "/courses", icon: <BookOpen size={20} /> },
  { name: "Assign Courses to Teachers", href: "/assign-teachers", icon: <UserCog size={20} /> },
  { name: "Assign Courses to Students", href: "/assign-students", icon: <UsersRound size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#1E40AF] text-white flex items-center justify-between px-4 py-3 z-50 shadow-md">
        {/* Logo + Heading */}
        <div className="flex items-center gap-2">
          <div className="bg-white text-[#1E40AF] p-2 rounded-xl shadow-lg">
            <LayoutGrid size={20} />
          </div>
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#2f5ef9] p-2 rounded-md shadow-lg"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1E40AF] text-white shadow-xl p-4 flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:min-h-screen`}
      >
        {/* Logo / Heading (hidden on mobile because topbar already has it) */}
        <div className="hidden sm:flex items-center gap-3 mb-8 px-2">
          <div className="bg-white text-[#1E40AF] p-2 rounded-xl shadow-lg">
            <LayoutGrid size={22} />
          </div>
          <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 mt-14 sm:mt-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#2f5ef9] shadow-md scale-[1.02]"
                    : "hover:bg-[#587fff] hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto flex justify-center">
          <Link
            href="/login"
            className="text-sm w-full text-white font-medium px-4 py-2 text-center rounded-xl bg-[#2f5ef9] hover:bg-red-600 transition duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
