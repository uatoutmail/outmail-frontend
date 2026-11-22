"use client";
import { Play, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { DEMO_VIDEO } from "@/content/landing";

/**
 * "Watch demo" button + the dialog that plays the product video.
 *
 * Uses the native <dialog> (showModal): focus trap, Esc to close, top layer
 * and an inert page behind it come from the browser, with no extra library.
 *
 * Nothing is downloaded until the visitor clicks: the <video> only mounts
 * while the dialog is open, so the hero's load cost is just this button.
 * Closing unmounts it, which stops playback and the download.
 */
const track = (name, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, { video_title: DEMO_VIDEO.title, ...params });
  }
};

export default function WatchDemo({ video = DEMO_VIDEO }) {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);
  const reported = useRef({ play: false, half: false });

  const show = () => {
    reported.current = { play: false, half: false };
    setOpen(true);
    track("demo_open");
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal?.();
    const onClose = () => setOpen(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, [open]);

  const onTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (!reported.current.half && v.duration && v.currentTime / v.duration >= 0.5) {
      reported.current.half = true;
      track("demo_progress", { percent: 50 });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="group inline-flex items-center gap-3 rounded-pill border border-white/15 bg-white/5 py-2 pl-2 pr-6 font-syne font-semibold text-white transition-colors duration-300 hover:border-accent-light/60 hover:bg-white/10"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-primary transition-transform duration-300 group-hover:scale-110">
          <Play size={16} fill="currentColor" aria-hidden />
        </span>
        {video.button}
        <span className="text-sm font-normal text-white/40">{video.length}</span>
      </button>

      {/* Clicking the dimmed backdrop (the dialog element itself, outside the
          video) closes it — a mouse convenience. Keyboard users get Esc from the
          native dialog and the focusable close button, so no key handler here. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        aria-label={video.title}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[min(92vw,1100px)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="relative">
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={20} aria-hidden />
            </button>
            <video
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onPlay={() => {
                if (!reported.current.play) {
                  reported.current.play = true;
                  track("demo_play");
                }
              }}
              onTimeUpdate={onTimeUpdate}
              onEnded={() => track("demo_complete")}
              className="aspect-video w-full rounded-2xl bg-black shadow-[0_40px_120px_-20px_var(--brand-primary)]"
            >
              {video.captions && (
                <track kind="captions" src={video.captions} srcLang="en" label="English" />
              )}
            </video>
          </div>
        )}
      </dialog>
    </>
  );
}
