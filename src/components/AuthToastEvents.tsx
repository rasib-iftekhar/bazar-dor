"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const notices: Record<string, { message: string; type: "error" | "success" }> =
  {
    registered: {
      message: "অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।",
      type: "success",
    },
    "signin-success": {
      message: "সাইন ইন সফল হয়েছে।",
      type: "success",
    },
    "profile-protected": {
      message: "প্রোফাইল দেখতে আগে সাইন ইন করুন।",
      type: "error",
    },
    "product-protected": {
      message: "পণ্যের দাম দেখতে আগে সাইন ইন করুন।",
      type: "error",
    },
    "google-signin-success": {
      message: "Google দিয়ে সাইন ইন সফল হয়েছে।",
      type: "success",
    },
    "github-signin-success": {
      message: "GitHub দিয়ে সাইন ইন সফল হয়েছে।",
      type: "success",
    },
    "google-signin-error": {
      message: "Google দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।",
      type: "error",
    },
    "github-signin-error": {
      message: "GitHub দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।",
      type: "error",
    },
  };

export default function AuthToastEvents() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const notice = params.get("notice");
    const notification = notice ? notices[notice] : undefined;
    const authError = params.get("error");
    const errorDescription = params.get("error_description");

    if (notification) {
      toast[notification.type](notification.message, {
        id: `auth-notice-${notice}`,
      });
    } else if (authError) {
      const message =
        authError === "account_not_linked"
          ? "এই ইমেইলের account আগে থেকেই আছে। আগে ব্যবহৃত sign-in পদ্ধতিটি ব্যবহার করুন।"
          : errorDescription || "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
      toast.error(message, { id: `auth-error-${authError}` });
    }

    if (notification || authError) {
      params.delete("notice");
      params.delete("error");
      params.delete("error_description");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [pathname, router, search]);

  return null;
}
