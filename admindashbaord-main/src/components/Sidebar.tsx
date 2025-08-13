"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Building2, Users, Megaphone, FileText } from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const menuItems: MenuItem[] = [
  { name: "Categories", href: "/categories", icon: <LayoutGrid size={20} /> },
  { name: "Companies", href: "/companies", icon: <Building2 size={20} /> },
  { name: "Users", href: "/users", icon: <Users size={20} /> },
  { name: "Ads", href: "/ads", icon: <Megaphone size={20} /> },
  { name: "Terms", href: "/terms", icon: <FileText size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white min-h-screen shadow-xl p-4 flex flex-col">
      {/* Logo / Heading */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-white text-green-900 p-2 rounded-xl shadow-lg">
          <LayoutGrid size={22} />
        </div>
        <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                  ? "bg-green-600 shadow-md scale-[1.02]"
                  : "hover:bg-green-700 hover:shadow-lg hover:scale-[1.02]"
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
          className="text-sm
          w-full text-white font-medium px-4 py-2 text-center font-medium rounded-xl shadow-md bg-green-600 hover:bg-red-600 transition duration-300 shadow-md"
        >
          Logout
        </Link>
      </div>

    </aside>
  );
}