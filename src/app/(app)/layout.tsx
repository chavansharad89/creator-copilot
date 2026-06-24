import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// Authenticated shell. Middleware already guarantees a signed-in user
// reaches this layout — no auth check duplicated here.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <Link href="/dashboard" className="font-semibold">
          Creator Copilot
        </Link>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}