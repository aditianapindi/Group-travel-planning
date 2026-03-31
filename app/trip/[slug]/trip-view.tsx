"use client";

import { useState } from "react";
import { ShareBar } from "./share-bar";
import { ParticipantForm } from "./participant-form";
import { StatusBar } from "./status-bar";
import { VoteResults } from "./vote-results";
import { GenerateButton, ItineraryView } from "./itinerary-view";

type Trip = {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  destinations: string[];
  status: string;
  deadline: string | null;
  manage_key: string;
};

type Participant = {
  id: string;
  trip_id: string;
  name: string;
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
  created_at: string;
};

type Itinerary = {
  destination: string;
  groupSize: number;
  budgetRange: { min: number; max: number } | null;
  days: { day: number; title: string; slots: { time: string; label: string; options: { name: string; description: string; estimatedCost: string; why: string }[] }[] }[];
};

export function TripView({
  trip,
  participants,
  isOrganizer,
  manageKey,
  existingItinerary,
}: {
  trip: Trip;
  participants: Participant[];
  isOrganizer: boolean;
  manageKey?: string;
  existingItinerary?: Itinerary | null;
}) {
  const [localParticipants, setLocalParticipants] = useState(participants);
  const [hasResponded, setHasResponded] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(existingItinerary ?? null);
  const [tripStatus, setTripStatus] = useState(trip.status);

  function handleNewParticipant(participant: Participant) {
    setLocalParticipants((prev) => [...prev, participant]);
    setHasResponded(true);
  }

  function handleItineraryGenerated(newItinerary: Itinerary) {
    setItinerary(newItinerary);
    setTripStatus("planned");
  }

  function handleLocked() {
    setTripStatus("locked");
  }

  const isCollecting = tripStatus === "collecting";
  const isLocked = tripStatus === "locked";
  const isPlanned = tripStatus === "planned";

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-ink">{trip.name}</h1>
        <p className="mt-1 text-secondary text-sm">
          by {trip.created_by}
        </p>
      </div>

      {/* Stat bar */}
      <StatusBar
        participants={localParticipants}
        deadline={trip.deadline}
        status={tripStatus}
      />

      {/* Share bar — organizer only */}
      {isOrganizer && (
        <ShareBar slug={trip.slug} tripName={trip.name} />
      )}

      {/* Participant input — show if collecting and hasn't responded (organizer too) */}
      {isCollecting && !hasResponded && (
        <ParticipantForm
          tripId={trip.id}
          destinations={trip.destinations}
          onSubmit={handleNewParticipant}
        />
      )}

      {/* Confirmation after responding */}
      {hasResponded && (
        <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3" role="status">
          <p className="text-sm text-primary font-medium">You&apos;re in.</p>
          <p className="text-sm text-secondary mt-0.5">
            Your vote and budget have been recorded. Come back to see the results.
          </p>
        </div>
      )}

      {/* Vote results — always visible */}
      {localParticipants.length > 0 && (
        <VoteResults
          participants={localParticipants}
          destinations={trip.destinations}
          isOrganizer={isOrganizer}
          tripId={trip.id}
          tripStatus={tripStatus}
          manageKey={manageKey}
          onLocked={handleLocked}
        />
      )}

      {/* Generate itinerary — locked phase, organizer sees button, participants see message */}
      {isLocked && !itinerary && (
        <div className="mt-6">
          {manageKey ? (
            <GenerateButton
              tripId={trip.id}
              manageKey={manageKey}
              onGenerated={handleItineraryGenerated}
            />
          ) : (
            <div className="rounded-xl bg-surface px-4 py-3 text-center">
              <p className="text-sm text-secondary">
                Trip is locked. Waiting for the organizer to generate the plan.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Itinerary — visible to everyone once generated */}
      {itinerary && <ItineraryView itinerary={itinerary} isOrganizer={isOrganizer} />}
    </main>
  );
}
