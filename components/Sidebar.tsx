import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

interface SidebarClient {
  id: string;
  name: string;
}

export default function Sidebar({
  accountName,
  clients,
}: {
  accountName: string;
  clients: SidebarClient[];
}) {
  return (
    <aside className="w-64 shrink-0 border-r border-line bg-paper px-5 py-6 hidden md:flex md:flex-col gap-6">
      <div>
        <Link href="/dashboard" className="block">
          <div className="font-mono text-xs uppercase tracking-widest text-turquoise mb-1">
            Swiftflow<span className="text-ink/40">.</span> multi-agent marketing
          </div>
          <div className="font-semibold text-ink leading-tight truncate">{accountName}</div>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            Clients
          </span>
          <Link href="/dashboard" className="font-mono text-[11px] text-turquoise hover:underline">
            + nouveau
          </Link>
        </div>
        <ul className="flex flex-col gap-0.5 text-sm">
          {clients.length === 0 && (
            <li className="text-ink/40 text-sm py-1">Aucun client encore.</li>
          )}
          {clients.map((c) => (
            <li key={c.id}>
              <Link
                href={`/dashboard/clients/${c.id}`}
                className="block rounded px-2 py-1.5 hover:bg-line/60 transition-colors truncate"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <form action={logoutAction}>
          <button
            type="submit"
            className="font-mono text-xs text-ink/40 hover:text-ink/70 transition-colors"
          >
            ← se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
