"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CompetitorStatus, InterestLevel, ThreatLevel } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

function values(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    serviceName: String(formData.get("serviceName") ?? ""),
    competitorType: String(formData.get("competitorType") ?? ""),
    marketArea: String(formData.get("marketArea") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") || "") || null,
    appAndroidUrl: String(formData.get("appAndroidUrl") || "") || null,
    appIosUrl: String(formData.get("appIosUrl") || "") || null,
    keywords: String(formData.get("keywords") ?? "").split(",").map((keyword) => keyword.trim()).filter(Boolean),
    description: String(formData.get("description") || "") || null,
    strengths: String(formData.get("strengths") || "") || null,
    weaknesses: String(formData.get("weaknesses") || "") || null,
    responseStrategy: String(formData.get("responseStrategy") || "") || null,
    threatLevel: formData.get("threatLevel") as ThreatLevel,
    interestLevel: formData.get("interestLevel") as InterestLevel,
    status: formData.get("status") as CompetitorStatus,
    internalMemo: String(formData.get("internalMemo") || "") || null,
  };
}

export async function createCompetitor(formData: FormData) {
  await prisma.competitor.create({ data: values(formData) });
  revalidatePath("/competitors");
  redirect("/competitors");
}

export async function updateCompetitor(id: string, formData: FormData) {
  await prisma.competitor.update({ where: { id }, data: values(formData) });
  revalidatePath("/competitors");
  redirect(`/competitors/${id}`);
}

export async function deleteCompetitor(id: string) {
  await prisma.competitor.delete({ where: { id } });
  revalidatePath("/competitors");
  redirect("/competitors");
}
