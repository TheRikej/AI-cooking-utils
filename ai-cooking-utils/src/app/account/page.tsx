import { NewProfileForm } from "@/components/account/new-profile-form";
import { getUserDetails } from "@/server/users"; // Fetch the user details from the DB

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const userId = "admin-1"; //TODO
  const user = await getUserDetails(userId);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Account settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and preferences.
        </p>
      </header>
      <div>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <NewProfileForm user={user} />
    </div>
  );
}
