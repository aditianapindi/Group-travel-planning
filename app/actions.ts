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
  const dateOptionsRaw = formData.get("dateOptions") as string;

  if (!name?.trim() || !createdBy?.trim() || !destinationsRaw?.trim()) {
    throw new Error("Please fill in all required fields.");
  }

  // Server-side length limits (M3)
  if (name.trim().length > 80) {
    throw new Error("Trip name must be 80 characters or less.");
  }
  if (createdBy.trim().length > 50) {
    throw new Error("Name must be 50 characters or less.");
  }

  const destinations = destinationsRaw
    .split(",")
    .map((d) => d.trim().slice(0, 100))
    .filter(Boolean);

  if (destinations.length < 2) {
    throw new Error("Add at least 2 destination options to vote on.");
  }
  if (destinations.length > 6) {
    throw new Error("Maximum 6 destination options.");
  }

  const slug = generateSlug(name);
  const manageKey = randomBytes(8).toString("hex");

  // Validate deadline (M7)
  let deadline: string | null = null;
  if (deadlineDays) {
    const days = parseInt(deadlineDays);
    if (!isNaN(days) && days > 0 && days <= 30) {
      deadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  // Safe JSON parse for date options (M6)
  let dateOptions: unknown[] = [];
  if (dateOptionsRaw) {
    try {
      const parsed = JSON.parse(dateOptionsRaw);
      if (Array.isArray(parsed)) dateOptions = parsed.slice(0, 3);
    } catch {
      // Invalid JSON — ignore, proceed without dates
    }
  }

  const db = getSupabase();
  const { error } = await db.from("trips").insert({
    name: name.trim(),
    slug,
    created_by: createdBy.trim(),
    destinations,
    date_options: dateOptions,
    deadline,
    manage_key: manageKey,
  });

  if (error) {
    throw new Error("Failed to create trip. Try again.");
  }

  redirect(`/trip/${slug}?key=${manageKey}`);
}
