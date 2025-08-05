"use client";

// import { useState } from "react";
import { User, Search, ShoppingCart } from "lucide-react";

export default function HeaderNavAction() {
  // const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex justify-end items-center gap-4 w-4/10">
      <button
        className="p-2 rounded-md transition-colors"
        aria-label="User profile"
      >
        <User className="w-5 h-5 stroke-1" />
      </button>
      <button
        className="p-2 rounded-md transition-colors"
        aria-label="Business profile"
      >
        <ShoppingCart className="w-5 h-5 stroke-1" />
      </button>
      <button>
        <Search className="w-5 h-5 stroke-1" />
      </button>
      {/* <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        // className={`px-3 py-1.5 rounded-md bg-indigo-800 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-28 sm:w-36 md:w-48 ${
        //   isRtl ? "text-right" : "text-left"
        // }`}
        // dir={isRtl ? "rtl" : "ltr"}
      /> */}
    </div>
  );
}
