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
import apiClient from '../api';

type Member = {
    name: string;
    id: number;
};

type Chug = {
    id: number;
    member: Member;
    time: string;
}


export default function Home() {
    const [chugs, setChugs] = useState<Chug[]>([]);

    useEffect(() => {
        fetchChugs();
    }, []);

    function fetchChugs() {
        apiClient
            .get("/chugs")
            .then((response) => {
                setChugs(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="px-6 py-6 sm:px-24 sm:py-12">
            <h1 className="font-bold text-4xl text-amber-800">Chugs</h1>
            <p className="text-gray-500 mb-4">Aperol.life</p>

            <ul className="font-mono text-cyan-950 mb-8">
                {chugs &&
                    chugs.map(({ id, time, member }, index) => (
                        <li
                            className="mb-6 lg:mb-4 md:mb-4 border-l-gray-500 border-l-2 pl-1"
                            key={id}
                        >
                            <span className="text-amber-800">
                                #{index+1} - {member.name}: {time}
                            </span>
                        </li>
                    ))}
            </ul>
            <Link href="/" className="font-mono">
                [go Home]
            </Link>
        </div>
    );
}
