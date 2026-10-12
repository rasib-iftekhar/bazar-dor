"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";

function getCallbackURL() {
  const requestedURL = new URLSearchParams(window.location.search).get(
    "callbackURL",
  );

  if (!requestedURL) return "/";

  try {
    const destination = new URL(requestedURL, window.location.origin);
    if (destination.origin !== window.location.origin) return "/";

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (
      isSignup &&
      formData.get("password") !== formData.get("confirmPassword")
    ) {
      setNotice("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }

    setNotice("");
    setIsSubmitting(true);

    try {
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const callbackURL = getCallbackURL();

      if (isSignup) {
        const { error } = await authClient.signUp.email({
          name: String(formData.get("name")),
          email,
          password,
          callbackURL,
        });

        if (error) {
          setNotice(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
          return;
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL,
        });

        if (error) {
          setNotice(error.message || "সাইন ইন করা যায়নি।");
          return;
        }
      }

      router.replace(callbackURL);
      router.refresh();
    } catch {
      setNotice("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10 sm:py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {isSignup
            ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
            : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
        </p>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white/80 p-5 text-left shadow-sm sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <label className="block text-sm font-medium text-gray-800">
                নাম
                <input
                  autoComplete="name"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#fbfcfb] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green-ring)]"
                  name="name"
                  placeholder="যেমন: রহিম উদ্দিন"
                  required
                />
              </label>
            )}

            <label className="block text-sm font-medium text-gray-800">
              ইমেইল
              <input
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#fbfcfb] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green-ring)]"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>

            <label className="block text-sm font-medium text-gray-800">
              পাসওয়ার্ড
              <input
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#fbfcfb] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green-ring)]"
                name="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                minLength={8}
                type="password"
              />
            </label>

            {isSignup && (
              <label className="block text-sm font-medium text-gray-800">
                পাসওয়ার্ড নিশ্চিত করুন
                <input
                  autoComplete="new-password"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#fbfcfb] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green-ring)]"
                  name="confirmPassword"
                  placeholder="আবার লিখুন"
                  required
                  minLength={8}
                  type="password"
                />
              </label>
            )}

            <button
              className="w-full rounded-lg bg-[var(--brand-green)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-green-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-green)] disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? "অপেক্ষা করুন..."
                : isSignup
                  ? "অ্যাকাউন্ট তৈরি করুন"
                  : "সাইন ইন"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
            <span className="h-px flex-1 bg-gray-200" />
            <span>অথবা</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-2.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-green)]"
              onClick={() => setNotice("Google sign-in এখনো সংযুক্ত করা হয়নি।")}
              type="button"
            >
              <span aria-hidden="true" className="font-bold text-[#4285f4]">
                G
              </span>
              <span className="truncate">Google দিয়ে চালিয়ে যান</span>
            </button>
            <button
              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-2.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-green)]"
              onClick={() => setNotice("GitHub sign-in এখনো সংযুক্ত করা হয়নি।")}
              type="button"
            >
              <span aria-hidden="true" className="font-bold">
                ◉
              </span>
              <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {notice && (
            <p
              aria-live="polite"
              className="mt-4 text-center text-xs text-gray-600"
              role="status"
            >
              {notice}
            </p>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            {isSignup ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
            <Link
              className="font-medium text-[var(--brand-green)] hover:text-[var(--brand-green-hover)]"
              href={isSignup ? "/signin" : "/signup"}
            >
              {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
            </Link>
          </p>
        </section>

        <Link
          className="mt-5 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-800"
          href="/"
        >
          <span aria-hidden="true">←</span> হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
