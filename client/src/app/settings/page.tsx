"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";

import {
  Moon,
  Sun,
  Menu,
  Monitor,
  Smartphone,
  Palette,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const dispatch = useAppDispatch();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleDarkMode = () => dispatch(setIsDarkMode(!isDarkMode));
  const toggleSidebar = () =>
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-12 animate-fadeIn">

      {/* PAGE HEADER */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Manage preferences and personalize your experience.
        </p>
      </header>

      {/* ========================= APPEARANCE ========================= */}
      <section className="bg-white rounded-3xl shadow-lg border p-8 space-y-8">

        {/* Section Header */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Appearance
          </h2>
        </div>

        {/* THEME PREVIEW */}
        <div className="rounded-2xl overflow-hidden border shadow-sm group transition duration-300">
          <div
            className={`p-6 transition-all ${
              isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
            }`}
          >
            <h3 className="font-semibold text-lg">
              {isDarkMode ? "Dark Theme" : "Light Theme"}
            </h3>
            <p className="text-sm opacity-70 mt-1">
              Preview of the current visual theme.
            </p>
          </div>
          <div
            className={`h-24 transition-all duration-300 ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-800 to-gray-700"
                : "bg-gradient-to-r from-white to-gray-200"
            }`}
          />
        </div>

        {/* DARK MODE TOGGLE */}
        <div
          onClick={toggleDarkMode}
          className="flex items-center justify-between px-4 py-4 rounded-2xl border cursor-pointer
                     hover:bg-gray-50 transition shadow-sm"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Sun size={22} className="text-yellow-500" />
            ) : (
              <Moon size={22} className="text-gray-700" />
            )}
            <span className="font-medium text-gray-900">Enable Dark Mode</span>
          </div>

          {/* Toggle Switch */}
          <div
            className={`w-14 h-7 rounded-full p-1 flex items-center transition-all
                        ${isDarkMode ? "bg-blue-600" : "bg-gray-400"}`}
          >
            <div
              className={`h-5 w-5 bg-white rounded-full shadow transform transition 
                          ${isDarkMode ? "translate-x-7" : "translate-x-0"}`}
            />
          </div>
        </div>

        {/* SIDEBAR COLLAPSE TOGGLE */}
        <div
          onClick={toggleSidebar}
          className="flex items-center justify-between px-4 py-4 rounded-2xl border cursor-pointer
                     hover:bg-gray-50 transition shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Menu size={22} className="text-gray-700" />
            <span className="font-medium text-gray-900">Collapse Sidebar</span>
          </div>
          <ChevronRight size={20} className="text-gray-500" />
        </div>
      </section>

      {/* ========================= LAYOUT ========================= */}
      <section className="bg-white rounded-3xl shadow-lg border p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Monitor className="text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Layout Options
          </h2>
        </div>

        {/* Desktop Mode */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border hover:bg-gray-50 cursor-pointer transition shadow-sm">
          <Monitor className="text-gray-800" size={26} />
          <div>
            <h3 className="font-medium text-gray-900">Desktop Layout</h3>
            <p className="text-sm text-gray-500">
              Optimized for larger displays and wide workspaces.
            </p>
          </div>
        </div>

        {/* Mobile Mode */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border hover:bg-gray-50 cursor-pointer transition shadow-sm">
          <Smartphone className="text-gray-800" size={26} />
          <div>
            <h3 className="font-medium text-gray-900">Mobile Layout</h3>
            <p className="text-sm text-gray-500">
              Compact interface tailored for smaller screens.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= ABOUT ========================= */}
      <section className="bg-white rounded-3xl shadow-lg border p-8 space-y-2 text-gray-900">
        <h2 className="text-lg font-semibold">About</h2>
        <p className="text-sm text-gray-600">
          Your Grocery — Smart Grocery Management & Inventory Tracking.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Version 1.0.0 • © {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}
