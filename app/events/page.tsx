"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { SewingPinIcon } from "@radix-ui/react-icons";

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

import { mvgApi } from "../mvg-api";
import { Member } from "../ts-client";
import { Event } from "../ts-client";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [member, setMember] = useState<Member>({ name: "", id: -1 });

  useEffect(() => {
    fetchEvents();
  }, []);

  function fetchEvents() {
    mvgApi.listEvents().then(({data}) => {
      setEvents(data);
    });
  }

  useEffect(() => {
    mvgApi.readCurrentUser().then(({data}) => {
      setMember(data);
    });
  }, []);

  function participate(eventId: number) {
    mvgApi.addEventParticipant(eventId, member.id).then(() => {
      fetchEvents();
    });
  }

  function leave(eventId: number) {
    mvgApi.removeEventParticipant(eventId, member.id).then(() => {
      fetchEvents();
    });
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const startTime = formData.get("start_time");
    const location = formData.get("location");
    const name = formData.get("name");
    const author_id = member.id;

    mvgApi.createEvent({
      name: name as string,
      start_time: startTime as string,
      location: location as string,
    }).then(() => {
      fetchEvents();
    });
  }

  function deleteEvent(eventId: number) {
    mvgApi.deleteEventById(eventId).then(() => {
      fetchEvents();
    });
  }

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">Events</h1>
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
        {events &&
          events.map(({ id, name, start_time, participants, location, author }) => (
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
              {author?.id === member.id && (
                <button
                  onClick={() => deleteEvent(id)}
                  className="text-red-600 mr-1"
                >
                  [Delete]
                </button>
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
            <h3 className="text-lg font-semibold mb-2">Access Control</h3>
            <label className="block text-sm text-gray-600 mb-1">Who can view this event?</label>
            <select 
              name="view_role" 
              className="block w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="guest">Guest</option>
              <option value="mkm-member">MKM Member</option>
              <option value="mvg-member">MVG Member</option>
            </select>
            <label className="block text-sm text-gray-600 mb-1">Who can edit this event?</label>
            <select
              name="edit_role" 
              className="block w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="guest">Guest</option>
              <option value="mkm-member">MKM Member</option>
              <option value="mvg-member">MVG Member</option>
            </select>
            <label className="block text-sm text-gray-600 mb-1">Who can participate in this event?</label>
            <select 
              name="participate_role" 
              className="block w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="guest">Guest</option>
              <option value="mkm-member">MKM Member</option>
              <option value="mvg-member">MVG Member</option>
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
