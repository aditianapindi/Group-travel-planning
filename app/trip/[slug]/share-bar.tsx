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
          className="rounded-lg bg-[#25D366] text-white w-[44px] min-h-[44px] inline-flex items-center justify-center hover:bg-[#20bd5a] transition-colors"
          aria-label={`Share ${tripName} on WhatsApp`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a
          href={`sms:&body=${encodeURIComponent(`Vote on "${tripName}" — pick a destination and share your budget (takes 30 seconds):\n${shareUrl}`)}`}
          className="rounded-lg bg-[#34C759] text-white w-[44px] min-h-[44px] inline-flex items-center justify-center hover:bg-[#2db84e] transition-colors"
          aria-label={`Share ${tripName} via iMessage`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
