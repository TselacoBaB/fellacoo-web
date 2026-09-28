import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="flex items-center justify-between">
          <div className="font-semibold tracking-tight">Fellacoo Web</div>
          <Link href="/dashboard" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
            Open dashboard
          </Link>
        </header>

        <section className="grid gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-medium text-gray-500">AI website builder + conversion engine</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
              Build the website. Then make it work for the business.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-gray-600">
              Fellacoo Web is being rebuilt from scratch around a visual website builder,
              AI generation, publishing, analytics, leads and conversion automation.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-medium">Core product layers</div>
            <div className="grid gap-3">
              {["Visual Website Builder","AI Website Engine","Conversion Engine","Leads + Analytics","Publishing + Domains"].map((item) => (
                <div key={item} className="rounded-xl border border-gray-200 px-4 py-3 text-sm">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}