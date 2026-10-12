import Link from "next/link";

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const Categories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/categories",
    { next: { revalidate: 60 } },
  );
  const categories: Category[] = await res.json();

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-start gap-4 overflow-x-auto scrollbar-none">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-xl text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium text-sm">{category.nameBn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
