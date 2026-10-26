"use client";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { DOWNLOAD_URLS, PLATFORM_LABEL, detectPlatform } from "@/lib/desktopDownload";

/**
 * The public download CTA — same DOWNLOAD_URLS/detectPlatform this dashboard
 * already uses in MailingAgentPanel, just presented to a signed-out visitor.
 *
 * Platform detection reads navigator, so it can only run after mount; a
 * server-rendered guess would always say "Mac" and flash-correct on
 * hydration for every Windows visitor. Rendering nothing platform-specific
 * until mounted avoids that hydration mismatch entirely.
 */
export default function DownloadCard() {
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // navigator is only available client-side, so this can't happen outside an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detectPlatform());
  }, []);

  const otherPlatform = platform === "win" ? "mac" : "win";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 md:p-10 text-center">
      <a
        href={platform ? DOWNLOAD_URLS[platform] : "#"}
        aria-disabled={!platform}
        className="inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-lg px-8 py-4 transition-colors min-w-[280px]"
      >
        <Download size={18} />
        {platform ? `Download for ${PLATFORM_LABEL[platform]}` : "Download the desktop app"}
      </a>
      {platform && (
        <p className="mt-4 text-sm text-white/40">
          <a href={DOWNLOAD_URLS[otherPlatform]} className="underline hover:text-white/70">
            Get it for {PLATFORM_LABEL[otherPlatform]} instead
          </a>
        </p>
      )}
      <p className="mt-6 text-xs text-white/30 max-w-md mx-auto leading-relaxed">
        The desktop app sends your outreach from your own Gmail account, from your own machine. Your
        Gmail credential never leaves this device.
      </p>
    </div>
  );
}
