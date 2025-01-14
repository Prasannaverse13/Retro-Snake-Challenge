import React, { useEffect, useRef, useState } from 'react';
import GameAudio from './GameAudio';
import { Position, GameState } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SPEED = 10;
const MAX_SPEED = 20;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0');
  });
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Game state
  const gameStateRef = useRef<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 0, y: 0 },
    score: 0,
    gameOver: true
  });

  const generateFood = (): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };

    // Ensure food doesn't appear on snake
    return gameStateRef.current.snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y)
      ? generateFood()
      : newFood;
  };

  const startGame = () => {
    if (!gameOver) return;

    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: { x: 0, y: 0 },
      score: 0,
      gameOver: false
    };

    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const checkCollision = (position: Position): boolean => {
    return position.x < 0 || 
           position.x >= GRID_SIZE || 
           position.y < 0 || 
           position.y >= GRID_SIZE ||
           gameStateRef.current.snake.slice(1).some(segment => 
             segment.x === position.x && segment.y === position.y
           );
  };

  const updateGame = () => {
    if (gameStateRef.current.gameOver || isPaused) return;

    const { snake, direction, food } = gameStateRef.current;

    // Skip update if no direction set
    if (direction.x === 0 && direction.y === 0) return;

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    if (checkCollision(newHead)) {
      GameAudio.playGameOverSound();
      gameStateRef.current.gameOver = true;
      setGameOver(true);

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      GameAudio.playEatSound();
      gameStateRef.current.food = generateFood();
      gameStateRef.current.score += 10;
      setScore(gameStateRef.current.score);
    } else {
      newSnake.pop();
    }

    gameStateRef.current.snake = newSnake;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const tileSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    const { snake, food } = gameStateRef.current;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#33ff33' : '#2eb82e';
      ctx.fillRect(
        segment.x * tileSize,
        segment.y * tileSize,
        tileSize - 2,
        tileSize - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(
      food.x * tileSize,
      food.y * tileSize,
      tileSize - 2,
      tileSize - 2
    );

    // Draw game over text
    if (gameOver) {
      ctx.fillStyle = '#33ff33';
      ctx.font = '20px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(
        'GAME OVER',
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.font = '12px "Press Start 2P"';
      ctx.fillText(
        'Press SPACE or TAP to start',
        canvas.width / 2,
        canvas.height / 2 + 30
      );
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          startGame();
        } else {
          setIsPaused(!isPaused);
        }
        return;
      }

      if (!gameStateRef.current.gameOver && !isPaused) {
        const { direction } = gameStateRef.current;
        switch(e.code) {
          case 'ArrowUp':
            if (direction.y === 0) 
              gameStateRef.current.direction = { x: 0, y: -1 };
            break;
          case 'ArrowDown':
            if (direction.y === 0) 
              gameStateRef.current.direction = { x: 0, y: 1 };
            break;
          case 'ArrowLeft':
            if (direction.x === 0) 
              gameStateRef.current.direction = { x: -1, y: 0 };
            break;
          case 'ArrowRight':
            if (direction.x === 0) 
              gameStateRef.current.direction = { x: 1, y: 0 };
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    let lastRenderTime = 0;
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
      const gameSpeed = Math.min(MAX_SPEED, INITIAL_SPEED + Math.floor(score / 50));

      if (secondsSinceLastRender < 1 / gameSpeed) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      lastRenderTime = currentTime;
      updateGame();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, score, highScore, isPaused]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>RETRO SNAKE</h1>
        <div className="score">Score: {score}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="game-canvas"
      />
      <div className="game-controls">
        <div className="instructions">
          <p>Use arrow keys to move</p>
          <p>Press SPACE to start/pause</p>
          <p>Swipe on mobile to control</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;