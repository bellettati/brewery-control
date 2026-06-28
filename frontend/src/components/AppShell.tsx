import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/arbrain-logo.svg";
import {
  LayoutDashboard,
  Beer,
  Cylinder,
  ClipboardList,
  History,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/beers", label: "Cervejas", icon: Beer, end: true },
  { to: "/tanks", label: "Tanques", icon: Cylinder, end: true },
  { to: "/records", label: "Registros", icon: ClipboardList, end: true },
  { to: "/batches", label: "Historico de Lotes", icon: History, end: true },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen font-sans">
      <aside className="w-64 bg-mist text-white flex flex-col gap-8 rounded-br-2xl rounded-tr-2xl p-4">
        <div className="text-xl font-bold text-brand">
          <img src={logo} alt="ArBrain" className="h-10" />
        </div>
        <nav className="flex flex-col gap-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded transition-colors text-sm border-b border-white/10 last:border-0 text-grey px-3 py-2 flex gap-2 ${
                  isActive
                    ? "bg-grey/10 text-ink font-semibold"
                    : "hover:bg-grey/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-white p-8">
        <Outlet />
      </main>
    </div>
  );
}
