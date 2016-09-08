var GRID_PIXELS = 10;
var grid = [];
var gridWidth, gridHeight;

function setup() {
  createCanvas(800, 800);

  gridWidth = Math.floor(width / GRID_PIXELS);
  gridHeight = Math.floor(height / GRID_PIXELS);

  console.log('grid size: ', gridWidth, 'x', gridHeight);

  for (x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (y = 0; y < gridHeight; y++) {
      grid[x][y] = 'empty';
    }
  }

  console.log('grid:', grid);

}

function draw() {
  background(0);

  // draw grid for debugging...
  for (x = 0; x < gridWidth; x++) {
    for (y = 0; y < gridHeight; y++) {
      var cell = grid[x][y];

      if (cell == 'empty') {
        // console.log('empty at', x, y);
        fill(100);
        text('e', gridToPixels(x), gridToPixels(y));
      }
      if (cell == 'line') {
        // console.log('empty at', x, y);
        fill(100);
        text('l', gridToPixels(x), gridToPixels(y));
      }
      if (cell == 'hole') {
        // console.log('empty at', x, y);
        fill(100);
        text('o', gridToPixels(x), gridToPixels(y));
      }


    }
  }

}

function gridToPixels(input) {
  return input * GRID_PIXELS;
}
