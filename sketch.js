var DEBUG = false;

var GRID_PIXELS = 15;
var INIT_NUM_CIRCUITS = 0;
var MAX_CIRCUITS = 200;
var GROUPS_MAX = 8;
var PROBABILITY_NEW_CIRCUITS = 100;
var HOLE_RADIUS = GRID_PIXELS / 1.5;
var MAX_CIRCUIT_LENGTH = 50;
var MAX_AGE = 1;

var startY = 0;

var spawn = true;

var biasDirection = {
  x: 1,
  y: 1,
  strength: 80
};
var PREVENT_BACKTRACKING = false;

var grid = [];
var gridWidth, gridHeight;

var circuits = [];

function setup() {
  frameRate(25);
  createCanvas(800, 800);

  gridWidth = Math.floor(width / GRID_PIXELS);
  gridHeight = Math.floor(height / GRID_PIXELS);

  if (DEBUG) { console.log('grid size: ', gridWidth, 'x', gridHeight); }

  for (x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (y = 0; y < gridHeight; y++) {
      grid[x][y] = 'open';
    }
  }

  if (DEBUG) { console.log('grid:', grid); }

  for (n = 0; n < INIT_NUM_CIRCUITS; n++) {
    circuits[n] = new Circuit();
  }

}

function draw() {
  background(0);

  // draw grid for debugging...
  if (DEBUG) {
    drawGrid();
  }


  circuits.forEach(function(circuit) {
    circuit.draw();
  });

  if (circuits.length > MAX_CIRCUITS) {
    spawn = false;
  }

  var dice = random(0, 100);
  if (dice < PROBABILITY_NEW_CIRCUITS && spawn) {
    if (DEBUG) { console.log('spawn new circuit group randomly!'); }
    var pickStart = findEmptyCellCoords();
    if (pickStart) {
      var groupSize = random(0, GROUPS_MAX);
      for (g = 0; g < groupSize; g++) {
        circuits.push(new Circuit(pickStart.x, pickStart.y+g));
      }
    }
  }

}

function drawGrid() {
  for (x = 0; x < gridWidth; x++) {
    for (y = 0; y < gridHeight; y++) {
      var cell = grid[x][y];

      if (cell == 'open') {
        // fill(50);
        // text(' ', gridToPixels(x), gridToPixels(y));
      } else {
        fill(100, 0, 0);
        noStroke();
        text('x', gridToPixels(x), gridToPixels(y));
      }

    }
  }
}

function gridToPixels(input) {
  // return map(input * GRID_PIXELS, 0, width, -100, width + 100);
  return (input * GRID_PIXELS);
}


function randomCellCoords() {
  return {
    x: Math.floor(random(0, gridWidth)),
    y: Math.floor(random(0, gridHeight))
  };
  // var r = {
  //   x: 0
  // }
  // r.y = startY++;
  // return r;
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
    if (DEBUG) { console.log(coords.x, coords.y); }
    cell = grid[coords.x][coords.y];
    // if (DEBUG) { console.log('searching', cell); }
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

  var randomMove;

  if (biasDirection) {
    var deviationChance = random(0, 100);
    if (deviationChance < biasDirection.strength) {
      // just use bias
      randomMove = { x: biasDirection.x, y: biasDirection.y };
    } else {
      // pick a truly random direction
      var randomDirection = Math.round(random(-1, 1));

      var whichAxis = random(0,1);
      if (whichAxis > 0.5) {
          randomMove = { x: biasDirection.x, y: randomDirection };
      } else {
        randomMove = { y: biasDirection.y, x: randomDirection };
      }

      if (PREVENT_BACKTRACKING) {
        // Prevent allow circuits to backtrack...
        if (biasDirection.x > 0) {
          randomMove.x = constrain(randomMove.x, 0, 1);
        }
        if (biasDirection.y > 0) {
          randomMove.y = constrain(randomMove.y, 0, 1);
        }
        if (biasDirection.x < 0) {
          randomMove.x = constrain(randomMove.x, -1, 0);
        }
        if (biasDirection.y < 0) {
          randomMove.y = constrain(randomMove.y, -1, 0);
        }
      }

    }
  }
  if (DEBUG) { console.log('final randomMove:', randomMove); }
  // var found = false;
  // var cell = 'nothing';


  nextCell = {
    x: constrain(fromCell.x + randomMove.x, 0, gridWidth-1),
    y: constrain(fromCell.y + randomMove.y, 0, gridHeight-1),
    type: 'line'
  }

  var checkCell = grid[nextCell.x][nextCell.y];
  if (checkCell == 'used') {
    nextCell = null;
  }

  return nextCell;
}

/*
  ==============================================================================
  Circuit Class
  ==============================================================================
*/
function Circuit(startX, startY) {
  this.path = [];
  this.finished = false;
  this.age = 0;
  if (startX && startY) {
    this.startPosition = {
      x: startX,
      y: startY
    };
    if (DEBUG) { console.log('req start position:', this.startPosition); }
    // if (grid[this.startPosition.x][this.startPosition.y] != 'open') {
    //   this.startPosition = null;
    // }
  } else {
    this.startPosition = findEmptyCellCoords();
  }
  if (this.startPosition == null) {
    if (DEBUG) { console.log('Circuit abort!'); }
    this.finished = true;
  } else {
    this.path.push({
      type: 'starthole',
      x: this.startPosition.x,
      y: this.startPosition.y
    })
  }
}

Circuit.prototype.end = function() {
  this.finished = true;
  if (DEBUG) { console.log('exceeded max length, ending this circuit!'); }
  var lastCell = this.path[this.path.length-1];
  if (DEBUG) { console.log('lastCell:', lastCell); }
  lastCell.type = 'endhole';

}

Circuit.prototype.grow = function() {
  this.age++;
  if (this.path.length >= MAX_CIRCUIT_LENGTH || this.age > MAX_AGE) {
    this.end();
  } else {
    var lastCell = this.path[this.path.length-1];
    // if (DEBUG) { console.log('lastCell:', lastCell); }
    var nextCell = findAdjacentCell(lastCell);
    if (nextCell) {
      this.age = 0;
      this.path.push(nextCell);
      if (DEBUG) { console.log('new path:', this.path); }
    } else {
      // if (DEBUG) { console.log('can\'t get out - end!') }
      // this.end();
    }
  }
}

Circuit.prototype.draw = function(){
  if (!this.finished) {
    if (DEBUG) { console.log('grow!'); }
    this.grow();
  }
  this.path.forEach(function(c, index, path) {
    // always update grid cells to be "used"
    grid[c.x][c.y] = 'used';

    if (c.type == 'line' || c.type == 'endhole') {
      var prevC = path[index - 1];
      if (prevC) {
        stroke(255);
        noFill();
        line(gridToPixels(prevC.x), gridToPixels(prevC.y), gridToPixels(c.x), gridToPixels(c.y));
      }
    }

    if (c.type == 'starthole' || c.type == 'endhole') {
      stroke(255);
      noFill();
      // fill(255);
      ellipse(gridToPixels(c.x), gridToPixels(c.y), HOLE_RADIUS, HOLE_RADIUS);
    }
  });
}

function mouseClicked() {
  spawn = !spawn;
}
