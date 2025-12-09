import { db } from "@/db";
import { users } from "@/db/schema/users";
import type { User } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function getUserDetails(userId: string): Promise<User | null> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0] ?? null;
}

export async function updateUserProfile(
  userId: string,
  input: {
    name: string;
    image?: string | null;
    aiContext?: string;
  }
): Promise<void> {
  await db
    .update(users)
    .set({
      name: input.name,
      image: input.image ?? null,
      aiContext: input.aiContext,
    })
    .where(eq(users.id, userId));
}
