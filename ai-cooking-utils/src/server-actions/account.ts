"use server";

import { updateUserProfile } from "@/server/users";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(
  userId: string,
  name: string,
  image: string | null
) {
  await updateUserProfile(userId, { name, image });
  revalidatePath("/account");
}

import { getUserDetails } from "@/server/users";

export async function getUserProfileAction(userId: string) {
  const user = await getUserDetails(userId);
  return user;
}
