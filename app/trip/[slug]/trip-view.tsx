"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { getWinningDate } from "@/lib/calendar";
import { ShareBar } from "./share-bar";
import { ParticipantForm } from "./participant-form";
import { StatusBar } from "./status-bar";
import { VoteResults } from "./vote-results";
import { GenerateButton, ItineraryView, CalendarLinks } from "./itinerary-view";

type DateOption = {
  start: string;
  end: string;
  label: string;
  days: number;
};

type Trip = {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  destinations: string[];
  date_options: DateOption[];
  status: string;
  deadline: string | null;
};

type Participant = {
  id: string;
  trip_id: string;
  name: string;
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
  date_votes: DateOption[];
  response_token: string | null;
  headcount: number;
  has_kids: boolean;
  group_type: string;
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
  const [itinerary, setItinerary] = useState<Itinerary | null>(existingItinerary ?? null);
  const [tripStatus, setTripStatus] = useState(trip.status);

  // Check if this user already responded (token + id persisted in localStorage)
  const tokenKey = `nod-token-${trip.id}`;
  const idKey = `nod-pid-${trip.id}`;
  const [responseToken, setResponseToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(tokenKey);
  });
  const [myParticipant, setMyParticipant] = useState<Participant | null>(() => {
    if (typeof window === "undefined") return null;
    const pid = localStorage.getItem(idKey);
    if (!pid) return null;
    return participants.find((p) => p.id === pid) ?? null;
  });
  const hasResponded = responseToken !== null;
  const [isEditing, setIsEditing] = useState(false);

  // Realtime subscription for new participants
  useEffect(() => {
    if (tripStatus !== "collecting") return;

    const db = getSupabase();
    if (!db) return;

    const channel = db
      .channel(`trip-${trip.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participants",
          filter: `trip_id=eq.${trip.id}`,
        },
        (payload) => {
          setLocalParticipants((prev) => {
            // Avoid duplicates (e.g. if the submitter's own insert triggers this)
            if (prev.some((p) => p.id === payload.new.id)) return prev;
            return [...prev, payload.new as Participant];
          });
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error — falling back to manual refresh");
        }
      });

    return () => {
      db.removeChannel(channel);
    };
  }, [trip.id, tripStatus]);

  function handleNewParticipant(participant: Participant) {
    setLocalParticipants((prev) => {
      if (prev.some((p) => p.id === participant.id)) return prev;
      return [...prev, participant];
    });
    if (participant.response_token) {
      setResponseToken(participant.response_token);
      setMyParticipant(participant);
      localStorage.setItem(tokenKey, participant.response_token);
      localStorage.setItem(idKey, participant.id);
    }
    setIsEditing(false);
  }

  function handleUpdatedParticipant(participant: Participant) {
    setLocalParticipants((prev) =>
      prev.map((p) => p.id === participant.id ? participant : p)
    );
    setMyParticipant(participant);
    setIsEditing(false);
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
  const deadlinePassed = trip.deadline ? new Date(trip.deadline).getTime() < Date.now() : false;
  const canRespond = isCollecting && !deadlinePassed;

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-ink break-words">{trip.name}</h1>
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

      {/* Empty state — organizer sees this when no one has responded yet */}
      {isOrganizer && isCollecting && localParticipants.length === 0 && !hasResponded && (
        <div className="rounded-xl bg-surface px-4 py-4 mb-2">
          <p className="text-sm text-ink font-medium">No responses yet.</p>
          <p className="text-sm text-secondary mt-1">
            Share the link above — responses will appear here automatically.
          </p>
        </div>
      )}

      {/* Motivation block — show to participants who haven't responded yet */}
      {canRespond && !hasResponded && !isOrganizer && (
        <MotivationBlock
          participants={localParticipants}
          organizer={trip.created_by}
          deadline={trip.deadline}
        />
      )}

      {/* Participant input — new response or editing existing */}
      {canRespond && (!hasResponded || isEditing) && (
        <ParticipantForm
          tripId={trip.id}
          destinations={trip.destinations}
          dateOptions={trip.date_options}
          onSubmit={isEditing ? handleUpdatedParticipant : handleNewParticipant}
          organizerName={isOrganizer ? trip.created_by : undefined}
          existingParticipant={isEditing && myParticipant ? { ...myParticipant, response_token: responseToken } : undefined}
        />
      )}

      {/* Deadline passed — form hidden, show message */}
      {isCollecting && deadlinePassed && !hasResponded && (
        <div className="mt-6 rounded-xl bg-surface px-4 py-4">
          <p className="text-sm text-ink font-medium">Voting has closed.</p>
          <p className="text-sm text-secondary mt-1">
            The deadline passed. {isOrganizer ? "You can still lock the trip and generate a plan." : `Reach out to ${trip.created_by} if you want to add your input.`}
          </p>
        </div>
      )}

      {/* Confirmation after responding — with edit option */}
      {hasResponded && !isEditing && (
        <ConfirmationBlock
          participants={localParticipants}
          organizer={trip.created_by}
          isOrganizer={isOrganizer}
          canEdit={canRespond}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* Vote results — always visible */}
      {localParticipants.length > 0 && (
        <VoteResults
          participants={localParticipants}
          destinations={trip.destinations}
          dateOptions={trip.date_options}
          isOrganizer={isOrganizer}
          tripId={trip.id}
          tripStatus={tripStatus}
          manageKey={manageKey}
          onLocked={handleLocked}
        />
      )}

      {/* Calendar links — shown once locked, if dates were voted on */}
      {(isLocked || isPlanned) && (() => {
        const winDate = getWinningDate(localParticipants, trip.date_options);
        if (!winDate) return null;
        return (
          <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-4 py-4">
            <p className="text-sm font-medium text-primary">Trip dates locked</p>
            <CalendarLinks
              tripName={`${trip.name}`}
              destination={trip.destinations[0] ?? ""}
              startDate={winDate.start}
              endDate={winDate.end}
              groupSize={localParticipants.filter(p => p.rsvp === "yes").length}
              budgetRange={null}
              tripSlug={trip.slug}
            />
          </div>
        );
      })()}

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
      {itinerary && (
        <ItineraryView
          itinerary={itinerary}
          isOrganizer={isOrganizer}
          organizerName={trip.created_by}
          winningDate={getWinningDate(localParticipants, trip.date_options)}
          tripSlug={trip.slug}
        />
      )}
    </main>
  );
}

function MotivationBlock({
  participants,
  organizer,
  deadline,
}: {
  participants: Participant[];
  organizer: string;
  deadline: string | null;
}) {
  const yesNames = participants.filter((p) => p.rsvp === "yes").map((p) => p.name);
  const maybeNames = participants.filter((p) => p.rsvp === "maybe").map((p) => p.name);

  let deadlineUrgency: string | null = null;
  if (deadline) {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) {
      deadlineUrgency = "Voting has closed.";
    } else if (diff < 86400000) {
      const hours = Math.ceil(diff / 3600000);
      deadlineUrgency = `Votes close in ${hours}h — after that, the majority decides without you.`;
    } else {
      const deadlineDate = new Date(deadline);
      const dayName = deadlineDate.toLocaleDateString("en-IN", { weekday: "long" });
      deadlineUrgency = `Votes close ${dayName} — after that, the majority decides without you.`;
    }
  }

  return (
    <div className="mt-4 mb-2 rounded-xl bg-surface px-4 py-4">
      {yesNames.length > 0 ? (
        <p className="text-sm text-ink">
          <strong>{formatNames(yesNames)}</strong>
          {yesNames.length === 1 ? " is" : " are"} in.
          {maybeNames.length > 0 && (
            <span className="text-secondary"> {formatNames(maybeNames)} {maybeNames.length === 1 ? "is" : "are"} on the fence.</span>
          )}
        </p>
      ) : (
        <p className="text-sm text-ink">
          Be the first to share your preferences.
        </p>
      )}
      <p className="text-sm text-secondary mt-1.5">
        Takes 30 seconds — once everyone responds, {organizer} locks the plan.
      </p>
      {deadlineUrgency && (
        <p className="text-sm text-primary font-medium mt-1.5">
          {deadlineUrgency}
        </p>
      )}
    </div>
  );
}

function ConfirmationBlock({
  participants,
  organizer,
  isOrganizer,
  canEdit,
  onEdit,
}: {
  participants: Participant[];
  organizer: string;
  isOrganizer: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
}) {
  const yesNames = participants.filter((p) => p.rsvp === "yes").map((p) => p.name);
  const uniqueYesNames = [...new Set(yesNames)];
  const yesCount = uniqueYesNames.length;

  if (isOrganizer) {
    return (
      <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-4 py-4" role="status">
        <p className="text-sm text-primary font-medium">Your preferences are saved.</p>
        <p className="text-sm text-ink mt-1.5">
          {yesCount} {yesCount === 1 ? "person" : "people"} confirmed so far.
          {yesCount >= 2
            ? " You can lock the trip when you\u2019re ready."
            : " Waiting for more responses before you can lock."}
        </p>
        {canEdit && onEdit && (
          <button onClick={onEdit} className="mt-2 text-sm text-primary underline underline-offset-2 hover:text-primary-hover transition-colors min-h-[44px]">
            Edit your response
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-4 py-4" role="status">
      <p className="text-sm text-primary font-medium">You&apos;re in!</p>
      <p className="text-sm text-ink mt-1.5">
        {yesCount} {yesCount === 1 ? "person has" : "people have"} responded.
        {" "}{organizer} will lock the plan once everyone&apos;s in.
      </p>
      {yesCount >= 2 && (
        <p className="text-sm text-secondary mt-1">
          {formatNames(uniqueYesNames)} — so far.
        </p>
      )}
      {canEdit && onEdit && (
        <button onClick={onEdit} className="mt-2 text-sm text-primary underline underline-offset-2 hover:text-primary-hover transition-colors min-h-[44px]">
          Edit your response
        </button>
      )}
    </div>
  );
}

function formatNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
