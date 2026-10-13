import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUnitBn, toBengaliNumber, type Product } from "@/components/marquee";

interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetail extends Product {
  markets: MarketPrice[];
}

function ProductSkeleton() {
  return (
    <main className="min-h-screen flex-1 bg-[#f0f5f1] px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-4 w-52 rounded bg-gray-200" />
        <div className="h-28 rounded-xl border border-gray-200 bg-white" />
        <div className="h-[430px] rounded-xl border border-gray-200 bg-white" />
      </div>
    </main>
  );
}

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, requestHeaders] = await Promise.all([params, headers()]);
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect(`/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const response = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { next: { revalidate: 60 } },
  );

  if (!response.ok) notFound();

  const data: unknown = await response.json();
  const products: ProductDetail[] = Array.isArray(data)
    ? data
    : ((data as { data?: ProductDetail[] }).data ?? []);
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const marketPrices = product.markets ?? [];
  const lowestPrice = marketPrices.length
    ? Math.min(...marketPrices.map((market) => market.min))
    : product.today;
  const highestPrice = marketPrices.length
    ? Math.max(...marketPrices.map((market) => market.max))
    : product.today;
  const isUp = product.change?.dir === "up" || product.change?.pct > 0;
  const isDown = product.change?.dir === "down" || product.change?.pct < 0;

  return (
    <main className="min-h-screen flex-1 bg-[#f0f5f1] px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-base text-gray-500"
        >
          <Link className="transition hover:text-[var(--brand-green)]" href="/">
            হোম
          </Link>
          <span aria-hidden="true">&gt;</span>
          <Link
            className="transition hover:text-[var(--brand-green)]"
            href={`/category/${product.category}`}
          >
            {product.categoryNameBn}
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span aria-current="page" className="text-gray-700">
            {product.nameBn}
          </span>
        </nav>

        <section className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white/85 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-green-soft)] text-3xl sm:h-16 sm:w-16">
              {product.image || product.categoryIcon}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {product.nameBn}
              </h1>
              <p className="mt-1 text-base text-gray-600">
                প্রতি {getUnitBn(product.unit)} · {product.categoryNameBn}
              </p>
              <p
                className={`mt-1 text-sm font-medium ${
                  isUp
                    ? "text-[var(--brand-green)]"
                    : isDown
                      ? "text-rose-600"
                      : "text-gray-600"
                }`}
              >
                গতকালের তুলনায় আজ দাম{" "}
                {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "একই আছে"}{" "}
                {toBengaliNumber(Math.abs(product.change?.pct ?? 0).toFixed(1))}
                %
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-8 rounded-lg bg-[var(--brand-green-soft)] px-4 py-3 sm:min-w-36 sm:flex-col sm:items-center sm:gap-0 sm:px-5">
            <span className="text-sm text-gray-600">আজকের দাম</span>
            <span className="text-4xl font-bold text-gray-900">
              {toBengaliNumber(product.today)}
            </span>
            <span className="text-sm text-gray-600">
              টাকা / {getUnitBn(product.unit)}
            </span>
            <span
              className={`mt-1 text-sm font-semibold ${
                isUp
                  ? "text-[var(--brand-green)]"
                  : isDown
                    ? "text-rose-600"
                    : "text-gray-500"
              }`}
            >
              {isUp && "▲ "}
              {isDown && "▼ "}
              {!isUp && !isDown && "— "}
              {toBengaliNumber(Math.abs(product.change?.pct ?? 0).toFixed(1))}%
            </span>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white/85 p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-xl font-bold text-[var(--brand-green)]">
                {toBengaliNumber(lowestPrice)} টাকা
              </p>
              <p className="text-sm text-gray-500">বাজারভিত্তিক সর্বনিম্ন</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-xl font-bold text-rose-600">
                {toBengaliNumber(highestPrice)} টাকা
              </p>
              <p className="text-sm text-gray-500">বাজারভিত্তিক সর্বোচ্চ</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">গত সপ্তাহের দাম</p>
              <p className="mt-1 text-xl font-bold text-[var(--brand-green)]">
                {toBengaliNumber(product.lastWeek ?? product.today)} টাকা
              </p>
              <p className="text-sm text-gray-500">
                প্রতি {getUnitBn(product.unit)}
              </p>
            </div>
          </div>

          <h2 className="mb-3 mt-6 text-lg font-semibold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[620px] border-collapse text-left text-base">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-3 py-3 font-medium">বাজার</th>
                  <th className="px-3 py-3 font-medium">বিভাগ</th>
                  <th className="px-3 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th className="px-3 py-3 text-right font-medium">সর্বোচ্চ</th>
                  <th className="px-3 py-3 text-right font-medium">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {marketPrices.map((market) => (
                  <tr key={`${market.market}-${market.division}`}>
                    <td className="px-3 py-3">{market.market}</td>
                    <td className="px-3 py-3">{market.division}</td>
                    <td className="px-3 py-3 text-right">
                      {toBengaliNumber(market.min)} টাকা
                    </td>
                    <td className="px-3 py-3 text-right">
                      {toBengaliNumber(market.max)} টাকা
                    </td>
                    <td className="px-3 py-3 text-right">
                      {toBengaliNumber(
                        ((market.min + market.max) / 2).toFixed(1),
                      )}{" "}
                      টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Link
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-base font-medium text-gray-800 transition-colors hover:bg-gray-200"
          href={`/category/${product.category}`}
        >
          <span aria-hidden="true">{product.categoryIcon}</span>
          সব {product.categoryNameBn}
        </Link>
      </div>
    </main>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
