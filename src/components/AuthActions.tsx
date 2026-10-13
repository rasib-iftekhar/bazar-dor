"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthActions() {
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isPending) {
    return <div aria-hidden="true" className="h-10 w-36" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-1 sm:gap-3">
        <Link
          href="/signin"
          className="whitespace-nowrap rounded-lg px-1.5 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:px-4 sm:text-base"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="whitespace-nowrap rounded-lg bg-[var(--brand-green)] px-2 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[var(--brand-green-hover)] sm:px-5 sm:text-base"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
      } else {
        toast.success("সাইন আউট সফল হয়েছে।");
      }
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSigningOut(false);
      setIsMenuOpen(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-controls="profile-menu"
        aria-expanded={isMenuOpen}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
        onClick={() => setIsMenuOpen((open) => !open)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-green)] text-sm font-semibold text-white">
          {session.user.name.charAt(0).toLocaleUpperCase()}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 sm:inline">
          {session.user.name}
        </span>
        <span aria-hidden="true" className="text-xs text-gray-500">
          ▾
        </span>
      </button>

      {isMenuOpen && (
        <div
          className="absolute right-0 top-full z-60 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          id="profile-menu"
        >
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {session.user.name}
            </p>
            <p className="truncate text-xs text-gray-500">
              {session.user.email}
            </p>
          </div>
          <Link
            className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            href="/profile"
            onClick={() => setIsMenuOpen(false)}
          >
            আমার প্রোফাইল
          </Link>
          <button
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            {isSigningOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
          </button>
        </div>
      )}
    </div>
  );
}
