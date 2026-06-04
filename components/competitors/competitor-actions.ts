"use server";

import { redirect } from "next/navigation";

export async function createCompetitor() {
  redirect("/competitors?demo=created");
}

export async function updateCompetitor(id: string) {
  redirect(`/competitors/${id}?demo=updated`);
}

export async function deleteCompetitor() {
  redirect("/competitors?demo=deleted");
}
