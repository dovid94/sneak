import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Board from './Board';
import './App.css';

const App = () => {
  const [page, setPage] = useState('welcome'); // State to manage the current page
  const [snake, setSnake] = useState([{ row: 5, col: 5 }]);
  const [food, setFood] = useState({ row: Math.floor(Math.random() * 10), col: Math.floor(Math.random() * 10) });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Function to save the high score
  const saveHighScore = async (score) => {
    try {
      const response = await axios.post('http://localhost:5000/highscore', { score });
      console.log(response.data);
      fetchHighScores();  // Update the high scores list after saving a new score
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Function to fetch high scores
  const fetchHighScores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/highscores');
      setHighScores(response.data);
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setIsPaused((prevIsPaused) => !prevIsPaused);
        e.preventDefault();
      } else {
        switch (e.key) {
          case 'ArrowUp':
            if (direction !== 'DOWN') setDirection('UP');
            break;
          case 'ArrowDown':
            if (direction !== 'UP') setDirection('DOWN');
            break;
          case 'ArrowLeft':
            if (direction !== 'RIGHT') setDirection('LEFT');
            break;
          case 'ArrowRight':
            if (direction !== 'LEFT') setDirection('RIGHT');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Move the snake and handle game logic
  useEffect(() => {
    if (!isGameRunning || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      let head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.row -= 1;
          break;
        case 'DOWN':
          head.row += 1;
          break;
        case 'LEFT':
          head.col -= 1;
          break;
        case 'RIGHT':
          head.col += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);
      if (head.row === food.row && head.col === food.col) {
        let newFoodPosition;
        while (true) {
          newFoodPosition = {
            row: Math.floor(Math.random() * 10),
            col: Math.floor(Math.random() * 10)
          };
          // Check if the new food position is not on the snake
          const isOnSnake = snake.some(segment => segment.row === newFoodPosition.row && segment.col === newFoodPosition.col);
          if (!isOnSnake) break;
        }
        setFood(newFoodPosition);
        setScore(score + 1);
      } else {
        newSnake.pop();
      }

      if (
        head.row < 0 ||
        head.row >= 10 ||
        head.col < 0 ||
        head.col >= 10 ||
        newSnake.slice(1).some(s => s.row === head.row && s.col === head.col)
      ) {
        alert('Game Over');
        saveHighScore(score);
        endGame();
      } else {
        setSnake(newSnake);
      }
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, food, score, isGameRunning, isPaused]);

  // Fetch high scores on component mount
  useEffect(() => {
    fetchHighScores();
  }, []);

  // Start the game
  const startGame = () => {
    setSnake([{ row: 5, col: 5 }]);
    setFood({ row: Math.floor(Math.random() * 10), col: Math.floor(Math.random() * 10) });
    setDirection('RIGHT');
    setScore(0);
    setIsGameRunning(true);
    setIsPaused(false);
    setPage('game');
  };

  // End the game
  const endGame = () => {
    saveHighScore(score);  // Save the score when the game ends
    setIsGameRunning(false);
    setPage('welcome');
  };

  // Render the welcome page
  const renderWelcomePage = () => (
    <div className="welcome">
      <h1>Welcome to the Snake Game</h1>
      <button onClick={startGame}>Start Game</button>
    </div>
  );

  // Render the game page
  const renderGamePage = () => (
    <div className="app">
      <h1>Snake Game</h1>
      <div className="frame">
        <div className="game-container">
          <Board snake={snake} food={food} />
        </div>
        <div className="score-box">
          <h2>Score </h2>
          <ul>
          {score}
          </ul>
          <h2>High Scores</h2>
          <ul>
            {highScores}
          </ul>
        </div>
      </div>
      <div className="controls">
        <button onClick={endGame}>End Game</button>
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Resume Game' : 'Pause Game'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {page === 'welcome' ? renderWelcomePage() : renderGamePage()}
    </>
  );
};

export default App;
