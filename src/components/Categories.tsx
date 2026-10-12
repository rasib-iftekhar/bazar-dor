import CategoryNavigation from "./CategoryNavigation";

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
      <CategoryNavigation categories={categories} />
    </div>
  );
};

export default Categories;
