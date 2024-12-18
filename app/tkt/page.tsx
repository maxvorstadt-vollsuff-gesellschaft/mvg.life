"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mvgApi } from "../mvg-api";
import { KickerMatch } from '../ts-client';

export default function TKTPage() {
  const [matches, setMatches] = useState<KickerMatch[]>([]);

  useEffect(() => {
    mvgApi.listMatches().then(({ data }) => {
      setMatches(data);
    });
  }, []);

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">TKT</h1>
      <p className="text-gray-500">MVG.life</p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Kicker Matches</h2>
        <ul className="mt-4">
            {matches.map(match => (
              <li key={match.id} className="mb-4">
                <div className="text-lg">
                  {match.team_a_player_1_member.name} {match.team_a_player_2_member && `& ${match.team_a_player_2_member.name}`} vs {match.team_b_player_1_member.name} {match.team_b_player_2_member && `& ${match.team_b_player_2_member.name}`}
                </div>
                <div className="text-gray-600">
                  Score: {match.team_a_score} - {match.team_b_score}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/" className="font-mono text-amber-800">
          [go Home]
        </Link>
      </div>
  );
}
