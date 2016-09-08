
var GRID_PIXELS = 10;
var HOLE_RADIUS = GRID_PIXELS / 2;
var MAX_CIRCUIT_LENGTH = 20;

var grid = [];
var gridWidth, gridHeight;

var circuits = [];

function setup() {
  frameRate(2);
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
        text(' ', gridToPixels(x), gridToPixels(y));
      }
      if (cell == 'used') {
        fill(100);
        text('x', gridToPixels(x), gridToPixels(y));
      }

    }
  }

  circuits.forEach(function(circuit) {
    circuit.draw();
  });

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


function findAdjacentCell(fromCell) {

  var nextCell = {};

  var randomMove = { x: Math.round(random(-1, 1)), y: Math.round(random(-1, 1)) };

  while (randomMove.x == 0 && randomMove.y == 0) {
    randomMove = { x: Math.round(random(-1, 1)), y: Math.round(random(-1, 1)) };
    console.log('randomMove:', randomMove);
  }
  console.log('final randomMove:', randomMove);
  // var found = false;
  // var cell = 'nothing';

  var nextCell = {
    x: fromCell.x + randomMove.x,
    y: fromCell.y + randomMove.y,
    type: 'line'
  }

  return nextCell;
}

// Circuit Class
function Circuit() {
  this.path = [];
  this.finished = false;
  this.startPosition = findEmptyCellCoords();
  console.log('Circuit start:', this.startPosition);
  this.path.push({
    type: 'hole',
    x: this.startPosition.x,
    y: this.startPosition.y
  })
}

Circuit.prototype.grow = function() {
  if (this.path.length >= MAX_CIRCUIT_LENGTH) {
    finished = true;
    console.log('exceeded max length, ending this circuit!');
  } else {
    var lastCell = this.path[this.path.length-1];
    // console.log('lastCell:', lastCell);
    var nextCell = findAdjacentCell(lastCell);
    if (nextCell) {
      this.path.push(nextCell);
      console.log('new path:', this.path);
    }
  }
}

Circuit.prototype.draw = function(){
  if (!this.finished) {
    console.log('grow!');
    this.grow();
  }
  this.path.forEach(function(c, index, path) {
    if (c.type == 'hole') {
      stroke(255);
      noFill();
      ellipse(gridToPixels(c.x), gridToPixels(c.y), HOLE_RADIUS, HOLE_RADIUS);
    }
    if (c.type == 'line') {
      var prevC = path[index - 1];
      stroke(255);
      noFill();
      line(gridToPixels(prevC.x), gridToPixels(prevC.y), gridToPixels(c.x), gridToPixels(c.y));
    }
  });
}
