import { Link, NavLink, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f0e8] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.24),transparent_34%),radial-gradient(circle_at_75%_10%,rgba(20,184,166,0.22),transparent_28%),linear-gradient(135deg,#f8f4eb_0%,#e9f2ef_100%)]" />
      <header className="border-b border-white/70 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link className="group inline-flex items-center gap-3" to="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-amber-300 shadow-lg shadow-slate-900/20">
              W
            </span>
            <span>
              <span className="block text-base font-black tracking-tight text-slate-950">Workflow Tracker</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Applications</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-white"
                }`
              }
              to="/"
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-white"
                }`
              }
              to="/applications/new"
            >
              New application
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
