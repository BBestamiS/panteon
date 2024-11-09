import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import LeaderboardTable from '../components/LeaderboardTable';
import Footer from '../components/Footer';
import { Player } from '../data/mockData';

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [highlightedRank, setHighlightedRank] = useState<number | undefined>(undefined);
  const [searchedPlayer, setSearchedPlayer] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false); 

  const updatePlayers = (newPlayers: Player[]) => {
    const scrollPosition = window.scrollY;
    setPlayers(newPlayers);
    window.scrollTo(0, scrollPosition);
    setNotFound(newPlayers.length === 0); 
  };

  const fetchTopPlayers = async () => {
    try {
      const response = await fetch('http://192.168.1.91:3000/api/leaderboard');
      const data = await response.json();
      updatePlayers(data.leaderboard);
      setHighlightedRank(undefined);
      setNotFound(false); 
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const fetchSearchedPlayer = async (playerName: string) => {
    try {
      const response = await fetch(`http://192.168.1.91:3000/api/leaderboard?playerName=${playerName}`);
      const data = await response.json();
  
      if (data.userRank === null || (data.leaderboard && data.leaderboard.length === 0)) {
        setNotFound(true); 
        setTimeout(() => setNotFound(false), 2000); 
      } else if (data.userRank <= 100) {
        updatePlayers(data.leaderboard);
        setNotFound(false);
      } else if (data.surroundingPlayers && data.surroundingPlayers.length > 0) {
        const updatedLeaderboard = [
          ...data.leaderboard,
          { playerName: '', score: '', playerId: '', country: '', balance: '' },
          ...data.surroundingPlayers,
          { playerName: '', score: '', playerId: '', country: '', balance: '' }
        ];
        updatePlayers(updatedLeaderboard);
        setNotFound(false);
      }
  
      setHighlightedRank(data.userRank);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setNotFound(true); 
      setTimeout(() => setNotFound(false), 2000);
    }
  };

  const handleSearch = (filteredPlayers: string[]) => {
    const playerName = filteredPlayers[0];
    setSearchedPlayer(playerName);
    fetchSearchedPlayer(playerName);
  };

  useEffect(() => {
    fetchTopPlayers(); 
    const intervalId = setInterval(() => {
      if (searchedPlayer) {
        fetchSearchedPlayer(searchedPlayer);
      } else {
        fetchTopPlayers();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [searchedPlayer]);

  return (
    <div>
      <div className="animated-background"></div>
      <div className="container">
        <h1 className="title">Leaderboard</h1>
        <SearchBar onSearch={handleSearch} />
        
        {notFound && (
          <div className="notification">Player Not Found</div>
        )}
        
        <LeaderboardTable players={players} highlightedRank={highlightedRank} />
      </div>
      <Footer />
    </div>
  );
}
