'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import Countdown from "@/app/Countdown";
import Image from "next/image";
import image1 from "@/public/image1.jpg";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

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
    const [member, setMember] = useState<Member>({name: '', id: -1});

    useEffect(() => {
        axios.get('https://api.mvg.life/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);


    useEffect(() => {
        axios.get('https://api.mvg.life/users/me/', {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
            .then(response => {
                setMember(response.data);
            })
            .catch(error => {
                toast(error.response.data.detail);
                console.error(error);
            });
    }, []);


    function participate(eventId: number) {
        axios.post(`https://api.mvg.life/events/${eventId}/participate`,{},{params: {member: member.id},headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                toast(error.response.data.detail);
                console.error(error);
            });
    }



    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-24 py-12">
            <div>
                <h1 className="font-bold text-4xl text-amber-800">Events</h1>
                <p className="text-gray-500 mb-4">Maxvorstadt Gang</p>

                {member.id === -1 && <p className="mb-4">Please <a className="font-mono text-amber-800" href="/login">login</a></p>}
                {member.id !== -1 && <p className="mb-4">Hey {member.name}</p>}

                <ul className="font-mono text-amber-800 mb-8">
                    {events &&
                        events.map(({id, name, start_time, participants }) => (
                            <li className="mb-2"
                                key={id}
                            >
                                {new Date(start_time).toLocaleDateString('de-DE')}: {name} (Start {new Date(start_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })})<p/>
                                <button onClick={() => {participate(id)}} className="text-blue-600">[Join]</button>
                                <span> Teilnehmer: </span>
                                {participants.map(({name}) => (
                                    <span key={name}>{name} </span>
                                ))}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </main>
    );
}
