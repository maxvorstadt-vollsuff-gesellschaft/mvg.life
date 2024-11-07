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
  const [member, setMember] = useState<Member>({ name: "", id: -1 });

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

    mvgApi.createRecipe({
      name: name as string,
      description: description as string,
      time: parseInt(time as string),
      situation: situation as Situation,
      author_id: author_id,
    }).then(() => {
      fetchRecipes();
    });
  }

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

      <ul className="font-mono text-cyan-950 mb-8">
        {recipes &&
          recipes.map(({ id, name, description, author, time }) => (
            <li
              className="mb-6 lg:mb-4 md:mb-4 border-l-gray-500 border-l-2 pl-1"
              key={id}
            >
              <span className="text-amber-800">{name} ({time} min)</span>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis">{description}</p>
              <span className="text-gray-500">by {author?.name}</span>
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
