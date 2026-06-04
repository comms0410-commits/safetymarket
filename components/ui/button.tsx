import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
  secondary: "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
};

export function Button({ className, variant = "primary", href, children, type, ...props }: Props) {
  const classes = cn("inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className);
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button type={type ?? "submit"} className={classes} {...props}>{children}</button>;
}
