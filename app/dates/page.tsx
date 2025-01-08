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
import { Member, DateIdea, Situation, Jahreszeit } from "../ts-client";

export default function Dates() {
  const [dates, setDates] = useState<DateIdea[]>([]);
  const [member, setMember] = useState<Member>({ name: "", id: -1, user_sub: "", tkt_elo_rating: 0 });
  const [timeFilter, setTimeFilter] = useState<number | ''>('');
  const [seasonFilter, setSeasonFilter] = useState<Jahreszeit | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDates();
  }, []);

  function fetchDates() {
    mvgApi.getAllDateIdeas().then(({data}) => {
      setDates(data);
    });
  }

  useEffect(() => {
    mvgApi.readCurrentUser().then(({data}) => {
      setMember(data);
    });
  }, []);

  function createDateIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const time = formData.get("time");
    const situation = formData.get("situation");
    const author_id = member.id;
    const image = formData.get("image");
    const date_no = formData.get("date_no");
    mvgApi.createDateIdea(
      name as string,
      situation as Jahreszeit,
      description as string,
      parseInt(date_no as string),
      image as File,
    ).then(() => {
      fetchDates();
    });
  }

  function deleteDateIdea(id: number) {
    mvgApi.deleteDateIdea(id).then(() => {
      fetchDates();
    });
  }

  const filteredDates = dates.filter(date => {
    const matchesTime = !timeFilter || (date.time !== null && date.time <= timeFilter);
    const matchesSeason = !seasonFilter || date.season === seasonFilter;
    const matchesSearch = !searchQuery || 
      date.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTime && matchesSeason && matchesSearch;
  });

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">Date Ideas</h1>
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
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value as Jahreszeit | '')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background max-w-xs"
        >
          <option value="">All seasons</option>
          {Object.values(Jahreszeit).map((season) => (
            <option key={season} value={season}>
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <ul className="font-mono text-cyan-950 mb-8">
        {filteredDates.map(({ id, name, description, author, time, image_url }) => (
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
                  <Link href={`/dates/${id}`} className="font-mono text-blue-600">
                    [view]
                  </Link>
                  {author?.id === member.id && (
                    <>
                      {/* TODO: Move edit and delete to details page */}
                      <Dialog>
                        <DialogTrigger className="text-red-600 mr-1">
                          [Delete]
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Date Idea?</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this date idea? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-4 pt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteDateIdea(id)}
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
          [add date idea]
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Date Idea?</DialogTitle>
            <DialogDescription>
              Create a new date idea
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createDateIdea} className="p-4">
            <Input
              type="text"
              className="block mb-4"
              name="name"
              placeholder="Date idea name"
              required
            />
            <Input
              type="text"
              className="block mb-4"
              name="description"
              placeholder="Date idea description"
              required
            />
            <Input
              type="number"
              className="block mb-4"
              name="date_no"
              placeholder="Date idea date number"
              required
            />
            <select 
              name="season" 
              className="block w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="">Select season</option>
              {Object.values(Jahreszeit).map((season) => (
                <option key={season} value={season}>
                  {season.charAt(0).toUpperCase() + season.slice(1)}
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
