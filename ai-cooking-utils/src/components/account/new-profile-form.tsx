"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { updateUserProfileAction } from "@/server-actions/account";

export function NewProfileForm({
  user,
}: {
  user: {
    id: string;
    name?: string | undefined | null;
    email?: string | undefined | null;
    image?: string | null;
    aiContext?: string | null;
  };
}) {
  const [name, setName] = useState(user.name ?? "");
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [aiContext, setAIContext] = useState(user.aiContext || "");

  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateUserProfileAction(user.id, name, imageUrl, aiContext);

    router.refresh();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={imageUrl || "/default-avatar.jpg"}
            alt="User avatar"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="text-sm font-medium text-foreground"
        >
          Profile Image URL
        </label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/my-avatar.jpg"
        />
      </div>

      <div>
        <label
          htmlFor="aiContext"
          className="text-sm font-medium text-foreground"
        >
          Diatery preferences
        </label>
        <Input
          id="aiContext"
          value={aiContext}
          onChange={(e) => setAIContext(e.target.value)}
          placeholder="General info about your diatery preferences (used to tailor AI to your needs)"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
