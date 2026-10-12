"use client";

import { Suspense, useState, useEffect, use } from "react";
import Link from "next/link";
import { toBengaliNumber, getUnitBn, Product } from "@/components/marquee";

// Skeleton Loader Component
const CategorySkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f0f5f1] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-200 shrink-0"></div>
          <div className="space-y-3 flex-1">
            <div className="h-7 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Count & Sort Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-5 bg-gray-200 rounded-md w-44"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-36"></div>
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-36"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-14"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

// Single Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const pct = product.change?.pct ?? 0;
  const isUp = product.change?.dir === "up" || pct > 0;
  const isDown = product.change?.dir === "down" || pct < 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-sm hover:shadow-md hover:border-black transition-all duration-200 flex flex-col justify-between group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
            {product.image || product.categoryIcon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[var(--brand-green)] transition-colors">
              {product.nameBn}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              প্রতি {getUnitBn(product.unit)}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">আজকের দাম</span>
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            {toBengaliNumber(product.today)}{" "}
            <span className="text-sm font-normal text-gray-600">টাকা</span>
          </span>
        </div>

        <span
          className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md ${
            isUp
              ? "text-[var(--brand-green)] bg-[var(--brand-green-soft)]"
              : isDown
                ? "text-rose-600 bg-rose-50"
                : "text-gray-600 bg-gray-50"
          }`}
        >
          {isUp && "▲ "}
          {isDown && "▼ "}
          {!isUp && !isDown && "— "}
          {toBengaliNumber(Math.abs(pct).toFixed(1))}%
        </span>
      </div>
    </Link>
  );
};

function CategoryPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<{
    nameBn: string;
    icon: string;
  } | null>(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`,
        );
        const data = await res.json();
        const items: Product[] = Array.isArray(data) ? data : data?.data || [];
        setProducts(items);

        if (items.length > 0) {
          setCategoryInfo({
            nameBn: items[0].categoryNameBn || "ক্যাটাগরি",
            icon: items[0].categoryIcon || "🛒",
          });
        }
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return a.today - b.today;
    if (sortOrder === "high-to-low") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return <CategorySkeleton />;
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#f0f5f1] flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          কোনো পণ্য পাওয়া যায়নি
        </h1>
        <p className="text-gray-500 mb-6 max-w-md">
          এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই অথবা ইউআরএলটি ভুল।
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f5f1] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl sm:text-4xl shrink-0">
            {categoryInfo?.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {categoryInfo?.nameBn}
            </h1>
            <p className="text-sm text-gray-500">
              {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Count & Sort Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">
            মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">সাজান</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:border-black shadow-sm cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-to-high">দাম: কম থেকে বেশি</option>
              <option value="high-to-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}
