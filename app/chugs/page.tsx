"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { BaseChug } from '../ts-client';
import { mvgApi } from "../mvg-api";


export default function Home() {
    const [chugs, setChugs] = useState<BaseChug[]>([]);

    useEffect(() => {
        fetchChugs();
    }, []);

    function fetchChugs() {
        mvgApi.getTopChuggers().then(({data}) => {
            setChugs(data);
        });
    }

    return (
        <div className="px-6 py-6 sm:px-24 sm:py-12">
            <h1 className="font-bold text-4xl text-amber-800">Chugs</h1>
            <p className="text-gray-500 mb-4">MVG.life</p>

            <ul className="font-mono text-cyan-950 mb-8">
                {chugs &&
                    chugs.map(({ time, member }, index) => (
                        <li
                            className="mb-6 lg:mb-4 md:mb-4 border-l-gray-500 border-l-2 pl-1"
                            key={index}
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
