import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Fellacoo Web</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <Link href="/builder/new" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
            Create website
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Websites" value="0" />
          <Metric label="Leads" value="0" />
          <Metric label="Published" value="0" />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Projects</h2>
          <div className="mt-4 rounded-xl border border-gray-200 p-4">
            <div className="font-medium">Your first website</div>
            <p className="mt-1 text-sm text-gray-500">Create a conversion-focused website from a business brief.</p>
            <Link href="/builder/new" className="mt-4 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium">
              Open builder
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}