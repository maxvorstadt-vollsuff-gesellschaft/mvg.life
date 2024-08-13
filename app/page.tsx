"use client";

import Image from "next/image";
import Countdown from "@/app/Countdown";
import image1 from "../public/image1.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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
    setToken(localStorage.getItem("token"));
    axios
      .get("https://api.aperol.life/events/upcoming", {
          params: {
              limit: 1
          }
      })
      .then((response) => {
        setNextEvents(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main className="px-12 py-6 sm:px-24 sm:py-12">
      <div>
        <h1 className="font-bold text-4xl text-amber-800">MVG</h1>
        <p className="text-gray-500 mb-1">Maxvorstadt Gang</p>

        <div className="mb-4">
          <Link className="font-mono text-amber-800" href="/events">
            [Events]
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
            <Link className="font-mono text-cyan-950" href="/login">
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

        <ul className="font-mono text-amber-800 mb-8">
          <li>Jonas</li>
          <li>Jonny (Schwabe)</li>
          <li>Linus</li>
          <li>Philipp</li>
          <li>Tim</li>
          <li>Tom</li>
        </ul>

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
