"use client";

import { useEffect, useState } from "react";

export function ShareBar({
  slug,
  tripName,
}: {
  slug: string;
  tripName: string;
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(`/trip/${slug}`);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/trip/${slug}`);
  }, [slug]);

  const whatsappText = encodeURIComponent(
    `Vote on "${tripName}" — pick a destination and share your budget (takes 30 seconds):\n${shareUrl}`
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mb-6 rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-medium text-ink mb-2">
        Share this link with your group
      </p>
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
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-primary text-white px-4 min-h-[44px] inline-flex items-center text-sm font-medium hover:bg-primary-hover transition-colors"
          aria-label={`Share ${tripName} on WhatsApp`}
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
