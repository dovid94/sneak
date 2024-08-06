import React from 'react';
import './Board.css';

const Board = ({ snake, food }) => {
  const gridSize = 10; 

  // Create a 2D array representing the grid
  const grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => 'cell')
  );

  // Mark the snake positions on the grid
  snake.forEach(segment => {
    grid[segment.row][segment.col] = 'snake';
  });

  // Mark the food position on the grid
  grid[food.row][food.col] = 'food';

  return (
    <div className="board">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className={`cell ${cell}`}></div>
        ))
      )}
    </div>
  );
};

export default Board;