"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

function CategoryLinks({
  categories,
  pathname,
}: {
  categories: Category[];
  pathname: string;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-start gap-4 overflow-x-auto scrollbar-none">
      {categories.map((category) => {
        const isActive = pathname === `/category/${category.slug}`;

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              isActive
                ? "bg-emerald-700 text-white hover:bg-emerald-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium text-sm">{category.nameBn}</span>
          </Link>
        );
      })}
    </div>
  );
}

function ActiveCategoryLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return <CategoryLinks categories={categories} pathname={pathname} />;
}

export default function CategoryNavigation({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <Suspense fallback={<CategoryLinks categories={categories} pathname="" />}>
      <ActiveCategoryLinks categories={categories} />
    </Suspense>
  );
}
