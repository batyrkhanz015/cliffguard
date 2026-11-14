export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        CliffGuard
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Take the gig. Keep your health subsidy.
      </h1>
      <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Find out in 60 seconds if earning more will cost you your health
        subsidy, and how to avoid it.
      </p>
    </main>
  );
}
