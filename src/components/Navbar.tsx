import Image from "next/image";
import Link from "next/link";
import Categories from "./Categories";
import CurrentDate from "./CurrentDate";
import Marquee from "./marquee";
import AuthActions from "./AuthActions";

const Navbar = () => {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        {/* Top Navbar Row */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Date */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[var(--brand-green)] p-2 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                className="h-6 w-6 object-contain filter brightness-0 invert"
                height={24}
                width={24}
                src={"/logo-icon.png"}
                alt="bazardor logo"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 leading-tight">
                বাজার দর
              </div>
              <div className="text-xs text-gray-500">
                <CurrentDate />
              </div>
            </div>
          </Link>

          {/* Right Action Buttons */}
          <AuthActions />
        </div>

        {/* Categories Bar */}
        <Categories />
      </header>

      {/* Marquee Price Ticker (সব পেজে দেখাবে) */}
      <Marquee />
    </>
  );
};

export default Navbar;
