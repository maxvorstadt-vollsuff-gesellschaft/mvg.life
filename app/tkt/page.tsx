"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mvgApi } from "../mvg-api";
import { KickerMatch, Member } from '../ts-client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TKTPage() {
  const [matches, setMatches] = useState<KickerMatch[]>([]);
  const [topPlayers, setTopPlayers] = useState<Member[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMatch, setNewMatch] = useState({
    teamAPlayer1: '',
    teamAPlayer2: '',
    teamBPlayer1: '',
    teamBPlayer2: '',
    teamAScore: 0,
    teamBScore: 0,
    history: '',
    startTime: ''
  });

  useEffect(() => {
    mvgApi.listMatches(0, 100).then(({ data }) => {
      setMatches(data);
    });

    mvgApi.listTopPlayers(0, 100).then(({ data }) => {
      setTopPlayers(data);
    });

    mvgApi.listMembers().then(({ data }) => {
      setMembers(data);
    });
  }, []);

  const displayedPlayers = isExpanded ? topPlayers : topPlayers.slice(0, 3);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMatch(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const matchData = {
      team_a_player_1: newMatch.teamAPlayer1,
      team_a_player_2: newMatch.teamAPlayer2 || null,
      team_b_player_1: newMatch.teamBPlayer1,
      team_b_player_2: newMatch.teamBPlayer2 || null,
      team_a_score: newMatch.teamAScore,
      team_b_score: newMatch.teamBScore,
      history: newMatch.history,
      start_time: (new Date(newMatch.startTime)).getUTCSeconds().toString()
    };

    mvgApi.createMatch(matchData).then(response => {
      console.log('Match successfully recorded:', response.data);
      mvgApi.listMatches(0, 100).then(({ data }) => {
        setMatches(data);
      });
    }).catch(error => {
      console.error('Error recording match:', error);
    });
  };

  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">TKT</h1>
      <p className="text-gray-500">MVG.life</p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Top Players 
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-green-600 ml-2"
          >
            [{isExpanded ? 'Collapse' : 'Expand'}]
          </button>
        </h2>
        <ul className="font-mono text-cyan-950 mb-8">
          {displayedPlayers.map((player, index) => (
            <li key={player.id} className="mb-2">
              <span className="text-amber-800">#{index + 1} {player.name}</span> - ELO: {player.tkt_elo_rating}
            </li>
          ))}
        </ul>
        <h2 className="text-2xl font-bold">Kicker Matches</h2>
        <Dialog>
          <DialogTrigger className="text-green-600 mb-4">
            [Record a Match]
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record a New Match</DialogTitle>
              <DialogDescription>
                Enter the details of the match below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <select 
                name="teamAPlayer1" 
                value={newMatch.teamAPlayer1} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              >
                <option value="">Select Team A Player 1</option>
                {members.map(member => (
                  <option key={member.id} value={member.user_sub}>
                    {member.name}
                  </option>
                ))}
              </select>
              <select 
                name="teamAPlayer2" 
                value={newMatch.teamAPlayer2} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              >
                <option value="">Select Team A Player 2</option>
                {members.map(member => (
                  <option key={member.id} value={member.user_sub}>
                    {member.name}
                  </option>
                ))}
              </select>
              <select 
                name="teamBPlayer1" 
                value={newMatch.teamBPlayer1} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              >
                <option value="">Select Team B Player 1</option>
                {members.map(member => (
                  <option key={member.id} value={member.user_sub}>
                    {member.name}
                  </option>
                ))}
              </select>
              <select 
                name="teamBPlayer2" 
                value={newMatch.teamBPlayer2} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              >
                <option value="">Select Team B Player 2</option>
                {members.map(member => (
                  <option key={member.id} value={member.user_sub}>
                    {member.name}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="teamAScore">Team A Score:</label>
              <Input 
                type="number" 
                name="teamAScore" 
                title="Team A Score" 
                placeholder="Team A Score" 
                value={newMatch.teamAScore} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              />
              <label htmlFor="teamBScore">Team B Score:</label>
              <Input 
                type="number" 
                name="teamBScore" 
                title="Team B Score" 
                placeholder="Team B Score" 
                value={newMatch.teamBScore} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              />
              <Input 
                type="text" 
                name="history" 
                placeholder="History" 
                value={newMatch.history} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              />
              <label htmlFor="startTime">Start Time:</label>
              <Input 
                type="datetime-local" 
                name="startTime" 
                value={newMatch.startTime} 
                onChange={handleInputChange} 
                className="mb-2 p-2 border"
              />
              
              <DialogClose asChild>
                <Button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button 
                  type="button" 
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </Button>
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
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
              <div className="text-gray-600">
                History: {match.history}
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
