"use server";

import { updateUserProfile } from "@/server/users";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(
  userId: string,
  name: string,
  image: string | null,
  AIContext?: string
) {
  await updateUserProfile(userId, { name, image, AIContext: AIContext });

  const session = await auth();
  if (session?.user) {
    session.user.name = name;
    session.user.image = image ?? null;
  }
  console.log(`User updated successfully: username=${name}, image=${image}`);

  revalidatePath("/account");
}

import { getUserDetails } from "@/server/users";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function getUserProfileAction(userId: string) {
  const user = await getUserDetails(userId);

  return user;
}

export async function getUserAIContext(userId: string) {
  const user = await getUserDetails(userId);

  return user?.aiContext ?? null;
}

export const getAuthUser = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return session.user;
};

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
