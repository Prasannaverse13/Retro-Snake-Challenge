import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import './styles/SnakeGame.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <SnakeGame />
    </div>
  );
};

export default App;