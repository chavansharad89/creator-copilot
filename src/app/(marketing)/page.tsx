import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Creator Copilot
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        AI-powered content generation built for fitness coaches and personal
        trainers.
      </p>

      <div className="mt-8 flex gap-4">
        <SignedOut>
          <Link
            href="/sign-up"
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Get started
          </Link>
          <Link
            href="/sign-in"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-100"
          >
            Sign in
          </Link>
        </SignedOut>

        <SignedIn>
          <Link
            href="/dashboard"
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Go to dashboard
          </Link>
        </SignedIn>
      </div>
    </main>
  );
}