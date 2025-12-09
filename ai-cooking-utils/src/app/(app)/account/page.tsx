"use server";

import { NewProfileForm } from "@/components/account/new-profile-form";
import { getAuthUser, getUserProfileAction } from "@/server-actions/account";
import { User } from "next-auth";

export default async function AccountPage() {
  const authuser = await getAuthUser();

  if (!authuser) {
    return <div>User not found</div>;
  }

  const newestUser = await getUserProfileAction(authuser.id);
  if (newestUser === null) {
    return <div>User profile not found</div>;
  }

  const user: User & { aiContext: string | null; id: string } = {
    id: newestUser.id,
    name: newestUser?.name ?? "Default Name",
    email: newestUser?.email,
    image: newestUser?.image,
    aiContext: newestUser?.aiContext ? newestUser.aiContext : "",
  };

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
