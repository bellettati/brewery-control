import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/beers", label: "Cervejas", end: true },
  { to: "/tanks", label: "Tanques", end: true },
  { to: "/records", label: "Registros", end: true },
  { to: "/batches", label: "Historico de Lotes", end: true },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen font-sans">
      <aside className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6 text-xl font-bold text-brand">ArBrain</div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-brand text-ink"
                    : "text-steel hover:bg-white/10"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-mist p-8">
        <Outlet />
      </main>
    </div>
  );
}
