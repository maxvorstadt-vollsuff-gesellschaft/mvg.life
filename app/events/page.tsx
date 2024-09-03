"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { SewingPinIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Member = {
  name: string;
  id: number;
};

type Event = {
  id: number;
  name: string;
  start_time: string;
  participants: Member[];
  location: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [member, setMember] = useState<Member>({ name: "", id: -1 });

  useEffect(() => {
    fetchEvents();
  }, []);

  function fetchEvents() {
    axios
      .get("https://api.aperol.life/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    axios
      .get("https://api.aperol.life/users/me/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setMember(response.data);
      })
      .catch((error) => {
        toast(error.response.data.detail);
        console.error(error);
      });
  }, []);

  function participate(eventId: number) {
    axios
      .post(
        `https://api.aperol.life/events/${eventId}/participate`,
        {},
        {
          params: { member: member.id },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then((response) => {
        console.log(response.data);
        fetchEvents();
      })
      .catch((error) => {
        toast(error.response.data.detail);
        console.error(error);
      });
  }

  function leave(eventId: number) {
    axios
      .delete(`https://api.aperol.life/events/${eventId}/participate`, {
        params: { member: member.id },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log(response.data);
        fetchEvents();
      })
      .catch((error) => {
        toast(error.response.data.detail);
        console.error(error);
      });
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const startTime = formData.get("start_time");
    const location = formData.get("location");
    const name = formData.get("name");
    const author_id = member.id;

    axios
      .post(
        "https://api.aperol.life/events",
        {
          name: name,
          start_time: startTime,
          location: location,
          author_id: author_id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then((response) => {
        console.log(response.data);
        fetchEvents();
      })
      .catch((error) => {
        toast(error.response.data.detail);
        console.error(error);
      });
  }

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">Events</h1>
      <p className="text-gray-500 mb-4">Aperol.life</p>

      {member.id === -1 && (
        <p className="mb-4">
          Please{" "}
          <a className="font-mono text-amber-800" href="https://api.aperol.life/auth/login">
            login
          </a>
        </p>
      )}
      {member.id !== -1 && (
        <p className="mb-4 font-mono">[Logged in as {member.name}]</p>
      )}

      <ul className="font-mono text-cyan-950 mb-8">
        {events &&
          events.map(({ id, name, start_time, participants, location }) => (
            <li
              className="mb-6 lg:mb-4 md:mb-4 border-l-gray-500 border-l-2 pl-1"
              key={id}
            >
              <span className="text-amber-800">
                {new Date(start_time).toLocaleDateString("de-DE")}:
              </span>{" "}
              {name} (Start{" "}
              {new Date(start_time).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              )<p />
              {participants.some((p) => p.id === member.id) ? (
                <button
                  onClick={() => {
                    leave(id);
                  }}
                  className="text-red-600 mr-1"
                >
                  [Leave]
                </button>
              ) : (
                <button
                  onClick={() => {
                    participate(id);
                  }}
                  className="text-green-700 mr-1"
                >
                  [Join]
                </button>
              )}{" "}
              <span className="text-amber-800">Teilnehmer: </span>
              {participants.map(({ name }) => name).join(", ")}
              {location && (
                <div className="flex justify-start items-baseline">
                  <SewingPinIcon />
                  <p>{location}</p>
                </div>
              )}
            </li>
          ))}
      </ul>

      <Link href="/" className="font-mono">
        [go Home]
      </Link>

      <Dialog>
        <DialogTrigger className="font-mono text-blue-600">
          [add event]
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event?</DialogTitle>
            <DialogDescription>
              Create a new event
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createEvent} className="p-4">
            <Input
              type="text"
              className="block mb-4"
              name="name"
              placeholder="Title"
              required
            />
            <Input
              type="datetime-local"
              className="block mb-4"
              name="start_time"
              placeholder="Start time"
              required
            />
            <Input
              type="text"
              className="block mb-4"
              name="location"
              placeholder="Location"
              required
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
