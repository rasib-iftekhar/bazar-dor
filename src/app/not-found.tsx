import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12 bg-[#f8f9fa]">
      <div className="text-6xl mb-4">🧺</div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
        পাতাটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="text-gray-600 text-sm sm:text-base max-w-md mb-8">
        আপনি যে পণ্য বা পাতাটি খুঁজছেন সেটি সরানো হয়েছে বা কখনো ছিল না।
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm text-sm sm:text-base"
        >
          হোম পেজে যান
        </Link>
        <Link
          href="/compare"
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm sm:text-base"
        >
          বাজার তুলনা দেখুন
        </Link>
      </div>
    </div>
  );
}
