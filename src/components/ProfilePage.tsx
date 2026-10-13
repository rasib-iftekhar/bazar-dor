"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin?callbackURL=%2Fprofile&notice=profile-protected");
    }
  }, [isPending, router, session]);

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("সাইন আউট সফল হয়েছে।");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10">
        <div className="w-full max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-24 rounded-2xl bg-white" />
          <div className="h-44 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10 sm:py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-(--brand-green-soft) text-xl font-bold text-(--brand-green)">
              {session.user.name.charAt(0).toLocaleUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {session.user.name}
              </p>
              <p className="truncate text-sm text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>
          <button
            className="shrink-0 rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            onClick={handleSignOut}
            type="button"
          >
            সাইন আউট
          </button>
        </section>

        <section className="mt-4 rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-gray-900">তথ্য</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">নাম</dt>
              <dd className="mt-1 font-medium text-gray-900">
                {session.user.name}
              </dd>
            </div>
          </dl>
          <Link
            className="mt-5 inline-flex rounded-lg bg-(--brand-green) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--brand-green-hover)"
            href="/profile/update"
          >
            আপডেট করুন
          </Link>
        </section>
      </div>
    </main>
  );
}
