import Link from "next/link";

export interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

// বাংলা সংখ্যায় রূপান্তর করার ফাংশন
export const toBengaliNumber = (num: number | string | undefined | null) => {
  if (num === undefined || num === null) return "০";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (digit) => bnDigits[parseInt(digit)] ?? digit);
};

// Unit থেকে বাংলায় রূপান্তর ফাংশন
export const getUnitBn = (unit: string) => {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "কেজি";
    case "liter":
    case "litre":
      return "লিটার";
    case "dozen":
      return "ডজন";
    case "pcs":
    case "piece":
      return "পিস";
    default:
      return unit || "কেজি";
  }
};

const Marquee = async () => {
  let products: Product[] = [];

  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      { next: { revalidate: 60 } },
    );
    const data = await res.json();
    products = Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("Failed to fetch marquee data:", error);
  }

  if (!products.length) return null;

  return (
    <div className="marquee-viewport w-full bg-[var(--brand-green-soft)] border-y border-[var(--brand-green-border)] py-2 text-gray-800">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {[...products, ...products].map((item, index) => {
          const pct = item.change?.pct ?? 0;
          const isUp = item.change?.dir === "up" || pct > 0;
          const isDown = item.change?.dir === "down" || pct < 0;

          return (
            <Link
              key={`${item.id}-${index}`}
              href={`/product/${item.slug}`}
              className="inline-flex items-center gap-2 mx-6 text-sm hover:opacity-80 transition-opacity"
            >
              <span className="text-base">
                {item.categoryIcon || item.image || "🛒"}
              </span>
              <span className="font-medium text-gray-800">{item.nameBn}</span>
              <span className="text-gray-600">
                {toBengaliNumber(item.today)} টাকা/{getUnitBn(item.unit)}
              </span>
              <span
                className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
                  isUp
                    ? "text-[var(--brand-green)] bg-[var(--brand-green-muted)]"
                    : isDown
                      ? "text-rose-600 bg-rose-100/80"
                      : "text-gray-600 bg-gray-100"
                }`}
              >
                {isUp && "▲ "}
                {isDown && "▼ "}
                {!isUp && !isDown && "— "}
                {toBengaliNumber(Math.abs(pct).toFixed(1))}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Marquee;
