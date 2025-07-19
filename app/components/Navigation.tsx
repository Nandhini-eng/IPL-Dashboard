"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/schedule", label: "Schedule" },
    { href: "/points-table", label: "Points Table" },
  ];

  return (
    <nav className="w-full bg-blue-50 shadow sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-6 p-4 justify-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white font-semibold border-b-2 border-blue-800"
                  : "text-blue-700 hover:text-blue-800 hover:bg-blue-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
