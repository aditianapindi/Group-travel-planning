import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { TripView } from "./trip-view";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: trip } = await getSupabase()
    .from("trips")
    .select("name, created_by, destinations")
    .eq("slug", slug)
    .single();

  if (!trip) {
    return { title: "Trip not found — Nod" };
  }

  const description = `${trip.created_by} invited you to help plan "${trip.name}." Tap to vote and share your budget.`;

  return {
    title: `${trip.name} — Nod`,
    description,
    openGraph: {
      title: `${trip.name} — Nod`,
      description,
    },
  };
}

export default async function TripPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { key } = await searchParams;

  const db = getSupabase();

  const { data: trip } = await db
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!trip) {
    notFound();
  }

  const { data: participants } = await db
    .from("participants")
    .select("*")
    .eq("trip_id", trip.id)
    .order("created_at", { ascending: true });

  const isOrganizer = key === trip.manage_key;

  // Load existing itinerary if trip is planned
  let existingItinerary = null;
  if (trip.status === "planned") {
    const { data: itineraryRow } = await db
      .from("itineraries")
      .select("content")
      .eq("trip_id", trip.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (itineraryRow) {
      existingItinerary = itineraryRow.content;
    }
  }

  return (
    <TripView
      trip={trip}
      participants={participants ?? []}
      isOrganizer={isOrganizer}
      manageKey={isOrganizer ? key : undefined}
      existingItinerary={existingItinerary}
    />
  );
}
