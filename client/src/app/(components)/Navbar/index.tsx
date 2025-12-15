"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";

import { Menu, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const dispatch = useAppDispatch();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  /* ----------------- Greeting Based on Time ----------------- */
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex justify-between items-center w-full mb-7">

      {/* LEFT SIDE - Sidebar toggle + greeting */}
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-semibold text-gray-700">
          {greeting}, <span className="text-blue-600">User 👋</span>
        </h2>
      </div>

      {/* RIGHT SIDE - Dark mode toggle only */}
      <div className="flex items-center gap-5">
        <button onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="cursor-pointer text-gray-600" size={24} />
          ) : (
            <Moon className="cursor-pointer text-gray-600" size={24} />
          )}
        </button>
      </div>

    </div>
  );
}
