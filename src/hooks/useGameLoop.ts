import { useCallback, useEffect, useRef } from 'react';
import { Position, GameState, GameConfig } from '../types/game';
import { gameAudio } from '../utils/audio';

const INITIAL_CONFIG: GameConfig = {
  gridSize: 20,
  initialSpeed: 10,
  speedIncrease: 0.5,
  maxSpeed: 20
};

export function useGameLoop(
  updateGameState: (newState: Partial<GameState>) => void,
  gameState: GameState
) {
  const gameSpeedRef = useRef(INITIAL_CONFIG.initialSpeed);
  const lastRenderTimeRef = useRef(0);

  const generateFood = useCallback((): Position => {
    const newFood = {
      x: Math.floor(Math.random() * INITIAL_CONFIG.gridSize),
      y: Math.floor(Math.random() * INITIAL_CONFIG.gridSize)
    };

    return gameState.snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y)
      ? generateFood()
      : newFood;
  }, [gameState.snake]);

  const checkCollision = useCallback((position: Position): boolean => {
    return position.x < 0 || 
           position.x >= INITIAL_CONFIG.gridSize || 
           position.y < 0 || 
           position.y >= INITIAL_CONFIG.gridSize ||
           gameState.snake.slice(1).some(segment => 
             segment.x === position.x && segment.y === position.y
           );
  }, [gameState.snake]);

  const updateGame = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const newHead = {
      x: gameState.snake[0].x + gameState.direction.x,
      y: gameState.snake[0].y + gameState.direction.y
    };

    if (checkCollision(newHead)) {
      gameAudio.playGameOverSound();
      updateGameState({ gameOver: true });
      return;
    }

    const newSnake = [newHead, ...gameState.snake];

    if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
      gameAudio.playEatSound();
      const newScore = gameState.score + 10;
      gameSpeedRef.current = Math.min(
        INITIAL_CONFIG.maxSpeed,
        INITIAL_CONFIG.initialSpeed + Math.floor(newScore / 50) * INITIAL_CONFIG.speedIncrease
      );
      updateGameState({
        snake: newSnake,
        food: generateFood(),
        score: newScore
      });
    } else {
      newSnake.pop();
      updateGameState({ snake: newSnake });
    }
  }, [gameState, checkCollision, generateFood, updateGameState]);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const secondsSinceLastRender = (currentTime - lastRenderTimeRef.current) / 1000;
      
      if (secondsSinceLastRender < 1 / gameSpeedRef.current) {
        requestAnimationFrame(gameLoop);
        return;
      }

      lastRenderTimeRef.current = currentTime;
      updateGame();
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }, [updateGame]);

  return {
    generateFood,
    gameConfig: INITIAL_CONFIG
  };
}
