// Content-Security-Policy: restricts where scripts/styles/connections/frames
// may come from, which is the main defense-in-depth against XSS and injection.
// Sources are limited to this origin plus the few third parties the app truly
// uses: Supabase (auth/data/realtime) and YouTube (lesson video embeds). The
// microphone-based voice assistant and the on-device AI are browser APIs that
// run locally and are not network sources, so they need no CSP allowance.
// ('unsafe-inline' is required for the Next.js app-router bootstrap, the inline
// theme script, and Tailwind's inline styles; React auto-escaping and the
// HTML-escaping lesson formatter already neutralize injected markup.)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' blob: https://*.supabase.co",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Security response headers (no UI/behaviour change — hardening only).
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Microphone allowed for THIS origin only (the voice assistant); camera and
  // geolocation stay fully disabled, and FLoC/topics is opted out.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // don't advertise the framework
  images: {
    // Allow remote media (YouTube thumbs, Supabase storage, etc.).
    // Add your own hostnames here as you plug in real content.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
