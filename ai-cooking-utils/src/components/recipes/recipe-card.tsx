import type { Recipe } from "@/db/schema/recipes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteRecipeAction } from "@/server-actions/recipes";
import { Trash2 } from "lucide-react";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const deleteWithId = deleteRecipeAction.bind(null, recipe.id);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            {recipe.title}
          </CardTitle>
          <Badge variant={recipe.isPublic ? "default" : "outline"}>
            {recipe.isPublic ? "Public" : "Private"}
          </Badge>
          <form action={deleteWithId}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              aria-label="Delete recipe"
            >
              {<Trash2 className="h-4 w-4" />}
            </Button>
          </form>
        </div>
        {recipe.description && (
          <CardDescription className="line-clamp-2 text-xs md:text-sm">
            {recipe.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between pt-0 text-xs text-muted-foreground">
        <span>Recipe #{recipe.id}</span>
        <Button asChild size="sm" variant="outline">
          <Link href={`/recipes/${recipe.id}`}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
