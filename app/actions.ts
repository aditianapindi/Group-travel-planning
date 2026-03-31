"use server";

import { getSupabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";

export async function createTrip(formData: FormData) {
  const name = formData.get("name") as string;
  const createdBy = formData.get("createdBy") as string;
  const destinationsRaw = formData.get("destinations") as string;
  const deadlineDays = formData.get("deadlineDays") as string;

  if (!name?.trim() || !createdBy?.trim() || !destinationsRaw?.trim()) {
    throw new Error("Please fill in all required fields.");
  }

  const destinations = destinationsRaw
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  if (destinations.length < 2) {
    throw new Error("Add at least 2 destination options to vote on.");
  }

  const slug = generateSlug(name);
  const manageKey = randomBytes(8).toString("hex");

  const deadline = deadlineDays
    ? new Date(Date.now() + parseInt(deadlineDays) * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const db = getSupabase();
  const { error } = await db.from("trips").insert({
    name: name.trim(),
    slug,
    created_by: createdBy.trim(),
    destinations,
    deadline,
    manage_key: manageKey,
  });

  if (error) {
    throw new Error("Failed to create trip. Try again.");
  }

  redirect(`/trip/${slug}?key=${manageKey}`);
}
