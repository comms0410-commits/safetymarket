"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) return setError("이메일 또는 비밀번호를 확인해주세요.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-slate-700">이메일
        <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">비밀번호
        <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-border px-3 py-2" />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="w-full" disabled={loading}>{loading ? "로그인 중..." : "로그인"}</Button>
    </form>
  );
}
