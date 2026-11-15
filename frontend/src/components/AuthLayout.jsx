function AuthLayout({ title, description, children, footer, notice }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl"
      />

      <section className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white p-7 shadow-2xl shadow-indigo-950/20 sm:p-10">
        <header className="mb-8 text-center">
          <p className="mb-7 text-sm font-bold uppercase tracking-[0.24em] text-indigo-600">
            Portal
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </header>

        {notice && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              notice.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
            role={notice.type === 'error' ? 'alert' : 'status'}
          >
            {notice.message}
          </div>
        )}

        {children}

        <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
          {footer}
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
