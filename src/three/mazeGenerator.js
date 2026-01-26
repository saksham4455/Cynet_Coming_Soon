// Recursive Backtracking Maze Generator

export const generateMaze = (width, height) => {
  // Ensure odd dimensions
  const w = width % 2 === 0 ? width + 1 : width;
  const h = height % 2 === 0 ? height + 1 : height;

  const grid = Array(h).fill(null).map(() => Array(w).fill('wall'));

  const dirs = [
    [0, 2], [2, 0], [0, -2], [-2, 0]
  ];

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const carve = (x, y) => {
    grid[y][x] = 'path';

    const shuffledDirs = shuffle([...dirs]);

    for (const [dx, dy] of shuffledDirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === 'wall') {
        grid[y + dy / 2][x + dx / 2] = 'path';
        carve(nx, ny);
      }
    }
  };

  // Start carving from (1,1)
  carve(1, 1);

  // Set Core (Goal) at the center
  const centerX = Math.floor(w / 2);
  const centerY = Math.floor(h / 2);
  
  // Make sure center is accessible (clear a 3x3 area)
  for(let y = centerY - 1; y <= centerY + 1; y++) {
    for(let x = centerX - 1; x <= centerX + 1; x++) {
      if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
        grid[y][x] = 'path';
      }
    }
  }
  
  grid[centerY][centerX] = 'core';

  return {
    width: w,
    height: h,
    grid,
    start: [1, 1],
    end: [centerX, centerY]
  };
};
