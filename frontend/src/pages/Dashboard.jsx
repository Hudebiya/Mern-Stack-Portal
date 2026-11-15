function Dashboard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl shadow-indigo-950/10 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Portal
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Welcome to your dashboard
        </h1>
        <p className="mt-3 text-slate-600">
          You’re signed in. Your dashboard content will appear here.
        </p>
      </section>
    </main>
  )
}

export default Dashboard
