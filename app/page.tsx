"use client";

import Image from "next/image";
import Countdown from "@/app/Countdown";
import image1 from "../public/image1.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { mvgApi } from "./mvg-api";

type Member = {
  name: string;
  id: number;
};

type Event = {
  id: number;
  name: string;
  start_time: string;
  participants: Member[];
};

export default function Home() {
  const [nextEvents, setNextEvents] = useState<Event[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    mvgApi.getUpcomingEvents().then((response) => {
      setNextEvents(response.data);
    });

    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <main className="px-12 py-6 sm:px-24 sm:py-12">
      <div>
        <h1 className="font-bold text-4xl text-amber-800">MVG.life</h1>
        <div className="mb-4">
          <Link className="font-mono text-amber-800" href="/events">
            [Events]
          </Link>
          <Link className="font-mono text-amber-800" href="/chugs">
            [Chugometer]
          </Link>
          <Link className="font-mono text-amber-800" href="/recipes">
            [Recipes]
          </Link>
          {token ? (
            <button
              className="font-mono text-cyan-950"
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
              }}
            >
              [Logout]
            </button>
          ) : (
            <Link className="font-mono text-cyan-950" href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`}>
              [Login]
            </Link>
          )}
          <a
            href="https://open.spotify.com/playlist/21pJxURnxxWy8Lpfk8KqqU?si=718f4c5f17c34b46"
            className="font-mono text-emerald-700 mb-2 "
          >
            [Spotify]
          </a>
        </div>
        <p className="mb-4">{nextEvents[0]?.name || "no upcoming events"}</p>

        <Countdown
          date={new Date(nextEvents[0]?.start_time || "2024-06-10T12:00:00")}
        />

        <Image src={image1} alt="Picture of the MVG Gang" className="my-8" />

        <a
          href="https://github.com/timkn/mvg.life"
          className="font-mono text-gray-700 "
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
