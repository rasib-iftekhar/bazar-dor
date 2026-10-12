"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CurrentDate from "@/components/CurrentDate";
import { toBengaliNumber, getUnitBn, Product } from "@/components/marquee";

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

const ProductGridSkeleton = () => (
  <div
    role="status"
    aria-label="পণ্য লোড হচ্ছে"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="min-h-[148px] bg-white rounded-2xl p-5 border border-gray-100/80 shadow-sm motion-safe:animate-pulse"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-100" />
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-gray-100" />
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>
          <div className="h-6 w-14 rounded-md bg-gray-100" />
        </div>
      </div>
    ))}
    <span className="sr-only">পণ্য লোড হচ্ছে</span>
  </div>
);

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.data || [];
        setProducts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const topRisers = [...products]
    .filter((p) => p.change?.dir === "up" || p.change?.pct > 0)
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  const topFallers = [...products]
    .filter((p) => p.change?.dir === "down" || p.change?.pct < 0)
    .sort((a, b) => (a.change?.pct ?? 0) - (b.change?.pct ?? 0))
    .slice(0, 6);

  // Sorting logic for all products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return a.today - b.today;
    if (sortOrder === "high-to-low") return b.today - a.today;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#f0f5f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--brand-green-soft)] text-[var(--brand-green)]">
              <CurrentDate />
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <div className="pt-2">
              <a
                href="#সব-পণ্য"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white font-semibold transition-colors shadow-sm"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 max-w-md flex justify-center">
            <Image
              src="/bazar-hero.png"
              alt="Bazar Hero"
              width={400}
              height={300}
              priority
              className="object-contain"
            />
          </div>
        </section>

        {/* Section A — আজ দাম বেড়েছে ▲ */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[var(--brand-green)] font-bold text-xl">
              ▲
            </span>
            <h2 className="text-xl font-bold text-gray-900">আজ দাম বেড়েছে</h2>
          </div>
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRisers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Section B — আজ দাম কমেছে ▼ */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-rose-600 font-bold text-xl">▼</span>
            <h2 className="text-xl font-bold text-gray-900">আজ দাম কমেছে</h2>
          </div>
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topFallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Section C — সব পণ্য */}
        <section id="সব-পণ্য" className="space-y-6 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
              <p className="text-sm text-gray-500 mt-1">
                নিত্যপ্রয়োজনীয় সকল পণ্যের বর্তমান বাজারমূল্য ও তারতম্য
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">সাজান:</span>
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

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
