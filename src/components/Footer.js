import { PERSONAL_SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mx-auto mt-14 max-w-6xl border-t border-cream-200 pt-6 pb-2 text-center text-xs text-indigo-400">
      <p>
        © {new Date().getFullYear()} ARTS · Ajinkya Ranade Tabla School ·{" "}
        Zaxis Ventures LLC
      </p>
      <p className="mt-1">
        <a
          href={PERSONAL_SITE}
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-saffron-600"
        >
          ajinkyaranade.com ↗
        </a>
      </p>
    </footer>
  );
}
