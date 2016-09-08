var GRID_PIXELS = 10;
var grid = [];
var gridWidth, gridHeight;

var circuits = [];

function setup() {
  createCanvas(800, 800);

  gridWidth = Math.floor(width / GRID_PIXELS);
  gridHeight = Math.floor(height / GRID_PIXELS);

  console.log('grid size: ', gridWidth, 'x', gridHeight);

  for (x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (y = 0; y < gridHeight; y++) {
      grid[x][y] = 'open';
    }
  }

  console.log('grid:', grid);

  circuits[0] = new Circuit();

}

function draw() {
  background(0);

  // draw grid for debugging...
  for (x = 0; x < gridWidth; x++) {
    for (y = 0; y < gridHeight; y++) {
      var cell = grid[x][y];

      if (cell == 'open') {
        fill(100);
        text('o', gridToPixels(x), gridToPixels(y));
      }
      if (cell == 'used') {
        fill(100);
        text('x', gridToPixels(x), gridToPixels(y));
      }

    }
  }

}

function gridToPixels(input) {
  return input * GRID_PIXELS;
}


function randomCellCoords() {
  return {
    x: Math.floor(random(0, gridWidth)),
    y: Math.floor(random(0, gridHeight))
  };
}

function findEmptyCellCoords() {
  var found = false;
  var tries = 0;
  var MAX_TRIES = 10;

  var cell = 'nothing';
  var coords;

  while (cell != 'open' && tries < MAX_TRIES) {
    tries++;
    coords = randomCellCoords();
    console.log(coords.x, coords.y);
    cell = grid[coords.x][coords.y];
    // console.log('searching', cell);
  }
  if (cell == 'open') {
    return {
      x: coords.x,
      y: coords.y
    }
  } else {
    return null;
  }
}

// Circuit Class
function Circuit() {
  this.path = [];
  this.startPosition = findEmptyCellCoords();
  console.log('Circuit start:', this.startPosition);
}

Circuit.prototype.draw = function(){

}
