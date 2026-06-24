import { currentUser } from "@clerk/nextjs/server";

// Placeholder dashboard — proves the auth + middleware + layout chain works.
// Generator features land in Sprint 2.
export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}
      </h1>
      <p className="mt-2 text-gray-600">
        Your dashboard is set up. Generators arrive in Sprint 2.
      </p>
    </div>
  );
}