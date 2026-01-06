import React from 'react';
import '../styles/components/GameScoreboard.scss';

const GameScoreboard = () => {
  return (
    <div className='articles-game-scoreboard'>
      <h2>Game Scoreboard</h2>
      <p>This is a test scoreboard component.</p>
      <ul>
        <li>Player 1: 100</li>
        <li>Player 2: 200</li>
      </ul>
    </div>
  );
};

export default GameScoreboard;
