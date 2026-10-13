"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfileUpdatePage() {
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(
        "/signin?callbackURL=%2Fprofile%2Fupdate&notice=profile-protected",
      );
    }
  }, [isPending, router, session]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name")).trim();

    if (!name) {
      toast.error("নাম লিখুন।");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        toast.error(error.message || "প্রোফাইল আপডেট করা যায়নি।");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে।");
      router.replace("/profile");
      router.refresh();
    } catch {
      toast.error("প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10">
        <div className="w-full max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-48 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10 sm:py-12">
      <section className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">তথ্য আপডেট</h1>
        <p className="mt-1 text-sm text-gray-500">
          আপনার প্রোফাইলের নাম পরিবর্তন করুন।
        </p>

        <form
          className="mt-6 rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm sm:p-6"
          onSubmit={handleUpdate}
        >
          <label className="block text-sm font-medium text-gray-700">
            নাম
            <input
              autoComplete="name"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#fbfcfb] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-(--brand-green) focus:ring-2 focus:ring-(--brand-green-ring)"
              defaultValue={session.user.name}
              maxLength={100}
              name="name"
              required
            />
          </label>

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link
              className="inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              href="/profile"
            >
              বাতিল
            </Link>
            <button
              className="rounded-lg bg-(--brand-green) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--brand-green-hover) disabled:cursor-wait disabled:opacity-70"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
