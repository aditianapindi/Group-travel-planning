import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { tripId, manageKey } = await request.json();

  if (!tripId || !manageKey) {
    return Response.json({ error: "Missing tripId or manageKey" }, { status: 400 });
  }

  const db = getSupabase();

  // Verify organizer
  const { data: trip } = await db
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .eq("manage_key", manageKey)
    .single();

  if (!trip) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get participants
  const { data: participants } = await db
    .from("participants")
    .select("*")
    .eq("trip_id", tripId);

  if (!participants || participants.length === 0) {
    return Response.json({ error: "No participants yet" }, { status: 400 });
  }

  const yesParticipants = participants.filter((p) => p.rsvp === "yes");

  // Compute group context
  const voteCounts = trip.destinations.map((dest: string) => ({
    destination: dest,
    votes: yesParticipants.filter((p) => p.destination_votes.includes(dest)).length,
  }));
  voteCounts.sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes);
  const winningDestination = voteCounts[0]?.destination ?? trip.destinations[0];

  const budgets = yesParticipants
    .filter((p) => p.budget_min != null && p.budget_max != null)
    .map((p) => ({ min: p.budget_min!, max: p.budget_max! }));

  const budgetOverlap = budgets.length >= 2
    ? { min: Math.max(...budgets.map((b) => b.min)), max: Math.min(...budgets.map((b) => b.max)) }
    : budgets.length === 1
      ? budgets[0]
      : null;

  const totalHeadcount = yesParticipants.reduce((sum, p) => sum + (p.headcount || 1), 0);
  const names = yesParticipants.map((p) => {
    const hc = p.headcount || 1;
    return hc > 1 ? `${p.name} (+${hc - 1})` : p.name;
  }).join(", ");
  const hasKids = yesParticipants.some((p) => p.has_kids);
  const groupTypes = [...new Set(yesParticipants.map((p) => p.group_type || "mixed").filter((t) => t !== "mixed"))];

  // Build composition description
  const compositionParts: string[] = [];
  if (hasKids) compositionParts.push("includes children");
  if (groupTypes.includes("family")) compositionParts.push("family trip");
  if (groupTypes.includes("couples")) compositionParts.push("couples");
  if (groupTypes.includes("all-women")) compositionParts.push("all-women group");
  if (groupTypes.includes("all-men")) compositionParts.push("all-men group");
  const compositionStr = compositionParts.length > 0 ? compositionParts.join(", ") : "mixed group";

  // Build prompt with group context
  const prompt = `You are a travel planning assistant. Generate a 3-day itinerary for a group trip with OPTIONS for each time slot.

GROUP CONTEXT:
- Destination: ${winningDestination}
- Total people: ${totalHeadcount} (${names})
- Group composition: ${compositionStr}${hasKids ? " — MUST include kid-friendly options" : ""}
- Budget per person: ${budgetOverlap ? `₹${budgetOverlap.min.toLocaleString("en-IN")} to ₹${budgetOverlap.max.toLocaleString("en-IN")}` : "not specified"}
- Vote results: ${voteCounts.map((v: { destination: string; votes: number }) => `${v.destination} (${v.votes} votes)`).join(", ")}

RULES:
- Return ONLY valid JSON, no markdown, no code fences
- Structure as an array of day objects
- Each day has: day (number), title (string), slots (array)
- Each slot has: time (string like "9:00 AM"), label (string like "Morning Activity" or "Lunch"), options (array of 2-3 choices)
- Each option has: name (string), description (string, 1 sentence max), estimatedCost (string like "₹500/person"), why (string, 1 sentence explaining why this fits the group)
- 3-4 time slots per day
- Options within a slot should be genuinely different (e.g. adventure vs cultural vs relaxation)
- Keep all options budget-appropriate
- The "why" must reference specific group context (composition, budget, group size)${hasKids ? "\n- At least one option per slot MUST be kid-friendly" : ""}${groupTypes.includes("all-women") ? "\n- Prioritize safety-conscious venues and women-friendly spaces" : ""}`;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return Response.json({ error: "AI not configured" }, { status: 500 });
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API error:", errText);
      return Response.json({ error: "AI generation failed" }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return Response.json({ error: "Empty AI response" }, { status: 502 });
    }

    const itinerary = JSON.parse(rawText);

    // Save to database
    const { error: dbError } = await db.from("itineraries").insert({
      trip_id: tripId,
      content: {
        destination: winningDestination,
        groupSize: totalHeadcount,
        budgetRange: budgetOverlap,
        days: itinerary,
      },
    });

    if (dbError) {
      console.error("DB save error:", dbError);
    }

    // Update trip status
    await db
      .from("trips")
      .update({ status: "planned" })
      .eq("id", tripId);

    return Response.json({
      destination: winningDestination,
      groupSize: totalHeadcount,
      budgetRange: budgetOverlap,
      days: itinerary,
    });
  } catch (e) {
    console.error("Itinerary generation error:", e);
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
