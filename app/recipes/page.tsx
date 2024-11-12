"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { mvgApi } from "../mvg-api";
import { Member, Recipe, Situation } from "../ts-client";

type Difficulty = "easy" | "medium" | "hard";
type TimeOfDay = "breakfast" | "lunch" | "dinner";

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [member, setMember] = useState<Member>({ name: "", id: -1, user_sub: "" });
  const [timeFilter, setTimeFilter] = useState<number | ''>('');
  const [situationFilter, setSituationFilter] = useState<Situation | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  function fetchRecipes() {
    mvgApi.getAllRecipes().then(({data}) => {
      setRecipes(data);
    });
  }

  useEffect(() => {
    mvgApi.readCurrentUser().then(({data}) => {
      setMember(data);
    });
  }, []);

  function createRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const time = formData.get("time");
    const situation = formData.get("situation");
    const author_id = member.id;
    const image = formData.get("image");

    mvgApi.createRecipe(
      name as string,
      situation as Situation,
      description as string,
      parseInt(time as string),
      image as File,
    ).then(() => {
      fetchRecipes();
    });
  }

  function deleteRecipe(id: number) {
    mvgApi.deleteRecipe(id).then(() => {
      fetchRecipes();
    });
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesTime = !timeFilter || (recipe.time !== null && recipe.time <= timeFilter);
    const matchesSituation = !situationFilter || recipe.situation === situationFilter;
    const matchesSearch = !searchQuery || 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTime && matchesSituation && matchesSearch;
  });

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">Recipes</h1>
      <p className="text-gray-500 mb-4">MVG.life</p>

      {member.id === -1 && (
        <p className="mb-4">
          Please{" "}
          <a className="font-mono text-amber-800" href="https://api.mvg.life/auth/login">
            login
          </a>
        </p>
      )}
      {member.id !== -1 && (
        <p className="mb-4 font-mono">[Logged in as {member.name}]</p>
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <Input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="number"
          placeholder="Max time (minutes)"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value ? Number(e.target.value) : '')}
          className="max-w-xs"
        />
        <select 
          value={situationFilter}
          onChange={(e) => setSituationFilter(e.target.value as Situation | '')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background max-w-xs"
        >
          <option value="">All situations</option>
          {Object.values(Situation).map((situation) => (
            <option key={situation} value={situation}>
              {situation.charAt(0).toUpperCase() + situation.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <ul className="font-mono text-cyan-950 mb-8">
        {filteredRecipes.map(({ id, name, description, author, time, image_url }) => (
          <li
            className="mb-6 lg:mb-4 md:mb-4 border-l-gray-500 border-l-2 pl-1"
            key={id}
          >
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0">
                <img style={{width: "100%", height: "100%", borderRadius: "0.375rem"}} src={image_url ?? ""}></img>
              </div>
              <div>
                <span className="text-amber-800">{name} ({time} min)
                  <Link href={`/recipes/${id}`} className="font-mono text-blue-600">
                    [view]
                  </Link>
                  {author?.id === member.id && (
                    <>
                      <Link href={`/recipes/${id}/edit`} className="font-mono text-blue-600">
                        [edit]
                      </Link>
                      <Dialog>
                        <DialogTrigger className="text-red-600 mr-1">
                          [Delete]
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Recipe?</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this recipe? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-4 pt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteRecipe(id)}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </span>
                <p className="whitespace-nowrap overflow-hidden text-ellipsis">{description}</p>
                <p className="text-gray-500">by {author?.name}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Link href="/" className="font-mono">
        [go Home]
      </Link>

      <Dialog>
        <DialogTrigger className="font-mono text-blue-600">
          [add recipe]
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Recipe?</DialogTitle>
            <DialogDescription>
              Create a new recipe
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createRecipe} className="p-4">
            <Input
              type="text"
              className="block mb-4"
              name="name"
              placeholder="Recipe name"
              required
            />
            <Input
              type="text"
              className="block mb-4"
              name="description"
              placeholder="Description"
              required
            />
            <Input
              type="text"
              className="block mb-4"
              name="time"
              placeholder="Time"
              required
            />
            <select 
              name="situation" 
              className="block w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="">Select situation</option>
              {Object.values(Situation).map((situation) => (
                <option key={situation} value={situation}>
                  {situation.charAt(0).toUpperCase() + situation.slice(1)}
                </option>
              ))}
            </select>
            <Input
              type="file"
              className="block mb-4"
              name="image"
              accept="image/*"
              capture="environment"
              placeholder="Upload image"
            />
            <DialogClose asChild>
              <Button type="submit" variant="secondary">
                create
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
