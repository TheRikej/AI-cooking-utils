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
import { toggleFavoriteAction } from "@/server-actions/favorites";
import { Trash2, Star, StarOff } from "lucide-react";
import { checkUserEditRights } from "@/server/recipes";

type RecipeCardProps = {
  recipe: Recipe & { isFavorite?: boolean };
};

export async function RecipeCard({ recipe }: RecipeCardProps) {
  const deleteWithId = deleteRecipeAction.bind(null, recipe.id);
  const toggleFavorite = toggleFavoriteAction.bind(null, recipe.id);
  const hasEditRights = await checkUserEditRights(recipe.id);

  return (
    <Card className="flex h-full flex-col relative">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            {recipe.title}
          </CardTitle>

          <div className="flex items-center gap-2">
            

            <form action={toggleFavorite}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="Toggle Favorite"
                className="text-yellow-500 hover:bg-yellow-50"
              >
                {recipe.isFavorite ? (
                  <Star className="h-4 w-4 fill-yellow-500" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            </form>
            {hasEditRights &&
            <form action={deleteWithId}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                aria-label="Delete recipe"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>}
          </div>
        </div>

        {recipe.description && (
          <CardDescription className="line-clamp-2 text-xs md:text-sm">
            {recipe.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="mt-auto flex items-center justify-between pt-0 text-xs text-muted-foreground">
        <Badge variant={recipe.isPublic ? "default" : "outline"}>
              {recipe.isPublic ? "Public" : "Private"}
        </Badge>
        <Button asChild size="sm" variant="outline">
          <Link href={`/recipes/${recipe.id}`}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
