"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  Clipboard,
  Layout,
  SlidersHorizontal,
  LucideIcon,
  Menu,
  CircleDollarSign,
  TrendingUp,   // ⭐ ADDED ICON
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* =========================
   Sidebar Link Component
========================= */
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`flex items-center cursor-pointer gap-3 transition-all
          ${
            isCollapsed
              ? "justify-center py-4"
              : "px-8 py-4 justify-start text-gray-700"
          }
          ${
            isActive
              ? "bg-green-600 text-white shadow-sm"
              : "hover:bg-green-100 hover:text-green-700"
          }`}
      >
        <Icon className="w-6 h-6 transition-colors" />
        {!isCollapsed && <span className="font-medium">{label}</span>}
      </div>
    </Link>
  );
};

/* =========================
   Sidebar Component
========================= */

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `
    fixed flex flex-col h-full z-40 bg-white shadow-md transition-all duration-300 overflow-hidden
    ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex items-center gap-4 pt-8 transition-all
        ${isSidebarCollapsed ? "justify-center px-5" : "justify-start px-8"}
      `}
      >
        {!isSidebarCollapsed && (
          <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900">
            <span className="text-green-600">Your</span> Grocery
          </h1>
        )}

        {isSidebarCollapsed && (
          <span className="text-green-600 font-extrabold text-xl">YG</span>
        )}

        <button
          className="md:hidden ml-auto px-3 py-3 bg-gray-100 rounded-full hover:bg-green-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* NAV LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />

        {/* ⭐ NEW PREDICTIONS LINK */}
        <SidebarLink
          href="/predictions"
          icon={TrendingUp}
          label="Predictions"
          isCollapsed={isSidebarCollapsed}
        />

        <SidebarLink
          href="/recipes"
          icon={Archive}
          label="AI Recipes"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      {!isSidebarCollapsed && (
        <div className="mb-10">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Your Grocery
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
