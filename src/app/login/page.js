import AuthForm from "@/components/AuthForm";
import TablaArt from "@/components/TablaArt";
import { PERSONAL_SITE } from "@/lib/config";

export const metadata = { title: "Sign in — ARTS" };

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      {/* Personal site link — top of the page, before sign-in */}
      <a
        href={PERSONAL_SITE}
        target="_blank"
        rel="noreferrer"
        className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur transition hover:border-saffron-400 hover:text-indigo-900 sm:right-6 sm:top-6"
      >
        Visit ajinkyaranade.com <span aria-hidden>↗</span>
      </a>

      {/* Left: brand panel (hidden on small screens) */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-indigo-800 p-12 text-cream-50 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-saffron-400 font-display text-2xl text-indigo-900">
            ॐ
          </span>
          <span>
            <span className="block font-display text-2xl leading-tight">ARTS</span>
            <span className="block text-xs tracking-wide text-saffron-300">
              Ajinkya Ranade Tabla School
            </span>
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="font-display text-4xl leading-tight">
            The journey of a thousand compositions begins with a single{" "}
            <span className="text-saffron-300">bol</span>.
          </h1>
          <p className="mt-4 text-indigo-200">
            A structured path through Indian classical Tabla — unlocking one
            lesson at a time, at the pace of a true guru–shishya tradition.
          </p>
        </div>

        <p className="text-sm text-indigo-300">
          © {new Date().getFullYear()} ARTS · Zaxis Ventures LLC
        </p>

        {/* decorative rotating arc + glow + tabla */}
        <div className="pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 animate-spin-slow rounded-full border-[24px] border-saffron-400/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-80 w-80 animate-float rounded-full bg-saffron-400/10 blur-3xl" />
        <TablaArt className="pointer-events-none absolute bottom-16 right-10 h-40 w-60 animate-float text-saffron-300/15" />
      </section>

      {/* Right: auth form */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-saffron-400 font-display text-xl text-indigo-900">
              ॐ
            </span>
            <span>
              <span className="block font-display text-xl leading-tight text-indigo-800">
                ARTS
              </span>
              <span className="block text-xs tracking-wide text-saffron-500">
                Ajinkya Ranade Tabla School
              </span>
            </span>
          </div>

          <h2 className="font-display text-3xl text-indigo-900">Welcome back</h2>
          <p className="mb-8 mt-1 text-indigo-500">
            Sign in to continue your Tabla practice.
          </p>

          <AuthForm />
        </div>
      </section>
    </main>
  );
}
