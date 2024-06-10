'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import Countdown from "@/app/Countdown";
import Image from "next/image";
import image1 from "@/public/image1.jpg";

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
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        axios.get('https://api.mvg.life/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-24 py-12">
            <div>
                <h1 className="font-bold text-4xl text-amber-800">Events</h1>
                <p className="text-gray-500 mb-4">Maxvorstadt Gang</p>


                <ul className="font-mono text-amber-800 mb-8">
                    {events &&
                        events.map(({id, name, start_time}) => (
                            <li className="mb-2"
                                key={id}
                            >
                                {new Date(start_time).toLocaleDateString('de-DE')}: {name} (Start {new Date(start_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })})
                            </li>
                        ))
                    }
                </ul>
            </div>
        </main>
    );
}
