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
  isOrganizer: initialIsOrganizer,
  manageKey: initialManageKey,
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

  // Strip manage_key from URL immediately (C3 security fix)
  // Save to localStorage so organiser access persists without exposing key in address bar
  const manageKeyStore = `nod-manage-${trip.id}`;
  const [manageKey, setManageKey] = useState<string | undefined>(initialManageKey);
  const [isOrganizer, setIsOrganizer] = useState(initialIsOrganizer);

  useEffect(() => {
    // If key is in URL, save it and strip from address bar
    if (initialManageKey) {
      localStorage.setItem(manageKeyStore, initialManageKey);
      const url = new URL(window.location.href);
      if (url.searchParams.has("key")) {
        url.searchParams.delete("key");
        window.history.replaceState({}, "", url.pathname);
      }
    } else {
      // Return visit — check localStorage
      const storedKey = localStorage.getItem(manageKeyStore);
      if (storedKey) {
        setManageKey(storedKey);
        setIsOrganizer(true);
      }
    }
  }, [initialManageKey, manageKeyStore]);


  // Check if this user already responded (token + id persisted in localStorage)
  // Use useEffect to avoid hydration mismatch — server always renders null
  const tokenKey = `nod-token-${trip.id}`;
  const idKey = `nod-pid-${trip.id}`;
  const [responseToken, setResponseToken] = useState<string | null>(null);
  const [myParticipant, setMyParticipant] = useState<Participant | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    setResponseToken(token);
    const pid = localStorage.getItem(idKey);
    if (pid) {
      const found = participants.find((p) => p.id === pid) ?? null;
      setMyParticipant(found);
    }
    setHydrated(true);
  }, [tokenKey, idKey, participants]);

  const hasResponded = hydrated && responseToken !== null;
  const [isEditing, setIsEditing] = useState(false);

  // Realtime subscriptions — participants + trip status changes
  useEffect(() => {
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
            if (prev.some((p) => p.id === payload.new.id)) return prev;
            return [...prev, payload.new as Participant];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participants",
          filter: `trip_id=eq.${trip.id}`,
        },
        (payload) => {
          setLocalParticipants((prev) =>
            prev.map((p) => p.id === payload.new.id ? payload.new as Participant : p)
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "trips",
          filter: `id=eq.${trip.id}`,
        },
        (payload) => {
          const newStatus = (payload.new as { status: string }).status;
          if (newStatus && newStatus !== tripStatus) {
            setTripStatus(newStatus);
          }
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error");
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
        <h1 className="font-heading text-3xl text-ink" style={{ overflowWrap: "break-word" }}>{trip.name}</h1>
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

      {/* Confirmation after responding — only while collecting */}
      {hasResponded && !isEditing && isCollecting && (
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

      {/* Calendar links — compact inline, shown once locked */}
      {(isLocked || isPlanned) && (() => {
        const winDate = getWinningDate(localParticipants, trip.date_options);
        if (!winDate) return null;
        return (
          <CalendarLinks
            tripName={`${trip.name}`}
            destination={trip.destinations[0] ?? ""}
            startDate={winDate.start}
            endDate={winDate.end}
            groupSize={localParticipants.filter(p => p.rsvp === "yes").length}
            budgetRange={null}
            tripSlug={trip.slug}
          />
        );
      })()}

      {/* Generate itinerary — organizer only */}
      {isLocked && !itinerary && isOrganizer && (
        <div className="mt-6">
          <GenerateButton
            tripId={trip.id}
            manageKey={manageKey!}
            onGenerated={handleItineraryGenerated}
          />
        </div>
      )}

      {/* Itinerary — visible to everyone once generated */}
      {itinerary && (
        <>
          <ItineraryView
            itinerary={itinerary}
            isOrganizer={isOrganizer}
            organizerName={trip.created_by}
            winningDate={getWinningDate(localParticipants, trip.date_options)}
            tripSlug={trip.slug}
          />

          {/* Share plan button — organizer only */}
          {isOrganizer && (
            <SharePlanBar
              slug={trip.slug}
              tripName={trip.name}
              destination={itinerary.destination}
            />
          )}

          {/* Next steps — booking links */}
          <NextSteps
            destination={itinerary.destination}
            winningDate={getWinningDate(localParticipants, trip.date_options)}
            groupSize={localParticipants.filter(p => p.rsvp === "yes").length}
          />
        </>
      )}

      {/* Participant view — locked but itinerary not yet generated */}
      {isLocked && !itinerary && !isOrganizer && (
        <div className="mt-6 rounded-xl bg-surface px-4 py-4 text-center">
          <p className="text-sm text-ink font-medium">Trip is locked.</p>
          <p className="text-sm text-secondary mt-1">
            {trip.created_by} is preparing the itinerary for the group.
          </p>
        </div>
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
          <button onClick={onEdit} className="mt-1.5 text-sm text-primary underline underline-offset-2 hover:text-primary-hover transition-colors">
            Edit
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
        {` ${organizer} will lock the plan once everyone\u2019s in.`}
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

function SharePlanBar({ slug, tripName, destination }: { slug: string; tripName: string; destination: string }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(`/trip/${slug}`);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/trip/${slug}`);
  }, [slug]);

  const shareText = encodeURIComponent(
    `Our ${tripName} plan is ready! ${destination} - check it out:\n${shareUrl}`
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4 rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-medium text-ink mb-2">Share the plan with your group</p>
      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-left text-secondary hover:border-primary transition-colors min-h-[44px]"
          aria-label="Copy trip link"
        >
          <span className="truncate flex-1">{copied ? "Copied!" : shareUrl}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
            {copied ? (
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border bg-white w-[44px] min-h-[44px] inline-flex items-center justify-center hover:border-[#25D366] transition-colors"
          aria-label="Share plan on WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a
          href={`sms:&body=${encodeURIComponent(`Our ${tripName} plan is ready! ${destination} - check it out:\n${shareUrl}`)}`}
          className="rounded-lg border border-border bg-white w-[44px] min-h-[44px] inline-flex items-center justify-center hover:border-ink transition-colors"
          aria-label="Share plan via iMessage"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B6B6B" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

type DateOptionForSteps = { start: string; end: string; label: string; days: number };

function NextSteps({
  destination,
  winningDate,
  groupSize,
}: {
  destination: string;
  winningDate?: DateOptionForSteps | null;
  groupSize: number;
}) {
  const dest = encodeURIComponent(destination);
  const checkin = winningDate?.start ?? "";
  const checkout = winningDate?.end ?? "";
  const adults = groupSize || 2;

  const links = [
    {
      category: "Stay",
      items: [
        {
          name: "Booking.com",
          url: `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${checkin}&checkout=${checkout}&group_adults=${adults}`,
        },
        {
          name: "Airbnb",
          url: `https://www.airbnb.com/s/${dest}/homes?checkin=${checkin}&checkout=${checkout}&adults=${adults}`,
        },
      ],
    },
    {
      category: "Flights & Trains",
      items: [
        {
          name: "MakeMyTrip",
          url: `https://www.makemytrip.com`,
        },
        {
          name: "ixigo",
          url: `https://www.ixigo.com`,
        },
      ],
    },
    {
      category: "Car Rental",
      items: [
        {
          name: "Zoomcar",
          url: `https://www.zoomcar.com`,
        },
      ],
    },
    {
      category: "Activities",
      items: [
        {
          name: "Klook",
          url: `https://www.klook.com/search/?query=${dest}`,
        },
        {
          name: "Viator",
          url: `https://www.viator.com/search/${dest}`,
        },
      ],
    },
  ];

  const icons: Record<string, React.ReactNode> = {
    Stay: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
    "Flights & Trains": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    "Car Rental": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h.5l1.5-3h10l1.5 3H19a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2M19 17v2" />
        <circle cx="7.5" cy="13" r="1.5" /><circle cx="16.5" cy="13" r="1.5" />
      </svg>
    ),
    Activities: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-ink mb-3">Next steps</h3>
      <div className="grid grid-cols-2 gap-2">
        {links.map((group) => (
          <div key={group.category} className="rounded-xl bg-white border border-border px-3 py-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-primary">{icons[group.category]}</span>
              <p className="text-xs font-medium text-ink">{group.category}</p>
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-surface px-2.5 py-2 text-sm text-ink hover:bg-primary/5 hover:text-primary transition-colors min-h-[36px]"
                >
                  {item.name}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-muted" aria-hidden="true">
                    <path d="M6 3h7v7M13 3L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
