"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mvgApi } from "../mvg-api";
import { KickerMatch, Member } from '../ts-client';

export default function TKTPage() {
  const [matches, setMatches] = useState<KickerMatch[]>([]);
  const [topPlayers, setTopPlayers] = useState<Member[]>([]);

  useEffect(() => {
    mvgApi.listMatches().then(({ data }) => {
      setMatches(data);
    });

    mvgApi.listTopPlayers(0, 3).then(({ data }) => {
      setTopPlayers(data);
    });
  }, []);

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">TKT</h1>
      <p className="text-gray-500">MVG.life</p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Top 3 Players</h2>
        <ul className="font-mono text-cyan-950 mb-8">
          {topPlayers.map((player, index) => (
            <li key={player.id} className="mb-2">
              <span className="text-amber-800">#{index + 1} {player.name}</span> - ELO: {player.tkt_elo_rating}
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mb-4">Kicker Matches</h2>
        <ul className="font-mono text-cyan-950 mb-8">
          {matches.map(match => (
            <li
              key={match.id}
              className="mb-6 lg:mb-4 md:mb-4 border-l-gray-500 border-l-2 pl-1"
            >
              <div className="text-lg font-bold">
                {match.team_a_player_1_member.name} {match.team_a_player_2_member && `& ${match.team_a_player_2_member.name}`} 
                <span className="text-amber-800"> vs </span> 
                {match.team_b_player_1_member.name} {match.team_b_player_2_member && `& ${match.team_b_player_2_member.name}`}
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
