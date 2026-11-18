"use client";

import { useState } from "react";
import { Play, Youtube } from "lucide-react";
import { ytSearch, ytEmbed } from "@/lib/learn/guide";

/**
 * A click-to-load YouTube facade: keeps the page light and only loads an
 * iframe once the visitor actually wants to watch. Falls back to a search
 * link when we don't have a specific embeddable video.
 */
export default function VideoEmbed({ video, title }) {
  const [playing, setPlaying] = useState(false);

  // No specific video → link out to a YouTube search.
  if (!video?.id) {
    const href = ytSearch(video?.search || `${title} tabla`);
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-panel2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-panel to-panel2 p-5 text-center text-indigo-200 transition hover:text-saffron-300"
        >
          <Youtube size={40} className="text-saffron-400" />
          <span className="max-w-[240px] text-xs leading-relaxed">
            Find a performance on YouTube
          </span>
        </a>
      </div>
    );
  }

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={`${ytEmbed(video.id)}&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className="group relative flex aspect-video w-full flex-col items-center justify-center gap-2 overflow-hidden bg-black text-indigo-100"
      style={{
        backgroundImage: `linear-gradient(rgba(10,10,12,.35),rgba(10,10,12,.72)), url(https://i.ytimg.com/vi/${video.id}/hqdefault.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-saffron-400/90 text-onaccent shadow-soft transition group-hover:scale-110">
        <Play size={26} className="translate-x-[2px]" fill="currentColor" />
      </span>
      <span className="text-xs tracking-wide text-cream-50/90">Play reference</span>
    </button>
  );
}
