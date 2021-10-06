const COLOR_SCHEMES = [
  // {
  //   name: "b/w",
  //   colors: [[0, 0, 0], [255, 255, 255]]
  // },
  // {
  //   name: "AMERICA",
  //   colors: [[255, 0, 0], [255, 255, 255], [0, 0, 255]]
  // },
  // {
  //   name: "black/purple",
  //   colors: [[69, 26, 197], [129, 87, 255], [35, 25, 66], [94, 84, 142], [190, 149, 196]]
  // },
  // {
  //   name: "strawberry-shortcake",
  //   colors: [[216, 226, 220], [255, 229, 217], [255, 202, 212], [244, 43, 3], [244, 172, 183]]
  // },
  // {
  //   name: "turquoise-snot",
  //   colors: [[218, 255, 125], [84, 46, 113], [159, 134, 192], [127, 222, 255], [78, 166, 153]]
  // },
  {
    name: "random",
    colors: []
  }
];

let xLeft;
let xRight;
let yTop;
let yBottom;
let resolution;
let numColumns;
let numRows;
let flowStepLength;
let colorScheme;
let backgroundColor;
let flowColors;
let flowField;
let flows;

function validCell({col, row}) {
  return !flowField.grid[col][row].points.length;
}

class FlowField {
  constructor(numColumns, numRows) {
    let grid = [];
    let xOffRand = random(width);
    let yOffRand = random(height);
    // let xOffRand = 0;
    // let yOffRand = 0;
    let i, ii;
    let xOff = xOffRand;
    for (i = 0; i < numColumns; i++) {
      grid.push([]);
      let yOff = yOffRand;
      for (ii = 0; ii < numRows; ii++) {
        let angle = noise(xOff, yOff) * TWO_PI;
        let v = p5.Vector.fromAngle(angle); // what does this do??
        let lineLength = width/numColumns;
        let cell = {
          angle,
          points: []
        }

        grid[i][ii] = cell;

        // push();
        // stroke(100);
        // strokeWeigh(2);
        // translate((resolution*col), (resolution*row));
        // line(0, 0, lineLength * cos(angle), lineLength * sin(angle));
        // pop();

        yOff += 0.005;
      }
      xOff += 0.005;
    }
    this.grid = grid;
  }
}

class Flow {
  constructor(xStart, yStart, color) {
    this.xStart = xStart;
    this.yStart = yStart;
    this.x = xStart;
    this.y = yStart;
    this.color = color;
    // this.isDone = false;
    this.flowCells = [];
  }

  getCellLocation(x, y) {
    let xOff = x;
    let yOff = y;
    let iCol = int(xOff / resolution);
    let iRow = int(yOff / resolution);
    iCol = iCol < 0 ? 0 : iCol;
    iCol = iCol >= numColumns - 1 ? numColumns - 1 : iCol;
    iRow = iRow < 0 ? 0 : iRow;
    iRow = iRow >= numRows - 1 ? numRows - 1 : iRow;
    return {
      col: iCol,
      row: iRow
    };
  }

  getCell(x, y) {
    let xOff = x - xLeft;
    let yOff = y - yTop;
    let iCol = int(xOff / resolution);
    let iRow = int(yOff / resolution);
    iCol = iCol < 0 ? 0 : iCol;
    iCol = iCol >= numColumns ? numColumns - 1 : iCol;
    iRow = iRow < 0 ? 0 : iRow;
    iRow = iRow >= numRows ? numRows - 1 : iRow;
    // console.log("iCol: " + iCol)
    // console.log("iRow: " + iRow)
    return flowField.grid[iCol][iRow];
  }

  validSamplePoint(xStep, yStep) {
    let sampleX = this.x + xStep;
    let sampleY = this.y + yStep;
    let cell = this.getCell(sampleX, sampleY);

    if (cell.points.length) {
      return false;
    }
    return true;
  }

  display() {
    push();
    strokeWeight(5);
    console.log(this.color);
    stroke(0);
    noFill();

    let movingForward = true;
    let movingBackward = true;

    // check for existing streamlines
    let isValid = this.validSamplePoint(0, 0);
    console.log("isvalid: " + isValid)
    if (!isValid) {
      return;
    }
    let cell = this.getCell(this.xStart, this.yStart);
    let cellLocation = this.getCellLocation(this.xStart, this.yStart);
    this.flowCells.push(cellLocation);

    // console.log("cell angle: " + cell.angle)
    // console.log("cell points: " + cell.points)
    // console.log("cellLocation: " + cellLocation[0])

    // going "forward"
    beginShape();
    while (movingForward) {
      debugger;
      vertex(this.x, this.y);
      console.log('x 1: ' + this.x)
      console.log('y 1: ' + this.y)
      let xStep = flowStepLength * cos(cell.angle);
      let yStep = flowStepLength * sin(cell.angle);
      console.log("step: " + sqrt((xStep**2)+(yStep**2)));
      if (this.validSamplePoint(xStep, yStep)) {
        console.log('forward valid!')
        this.x = this.x + xStep;
        this.y = this.y + yStep;
        console.log('x 2: ' + this.x)
        console.log('y 2: ' + this.y)
        let forwardCellLocation = this.getCellLocation(this.x, this.y);
        console.log('forwardCellLocation: ' + forwardCellLocation)
        this.flowCells.push(forwardCellLocation);
      } else {
        movingForward = false;
      }
      // this.x = this.xStart;
      // this.y = this.yStart;
    }
    endShape();

    // going "backward"
    // movingBackward = false;
    // beginShape();
    // while (movingBackward) {
    //   vertex(this.x, this.y);
    //   let xStep = flowStepLength * cos(cell.angle);
    //   let yStep = flowStepLength * sin(cell.angle);
    //   if (this.validSamplePoint(-xStep, -yStep)) {
    //     console.log('backwards valid!')
    //     this.x = this.x + xStep;
    //     this.y = this.y + yStep;
    //     let backwardCellLocation = this.getCellLocation(this.x, this.y);
    //     this.flowCells.push(backwardCellLocation);
    //     continue;
    //   }
    //   movingBackward = false;
    //   this.x = this.xStart;
    //   this.y = this.yStart;
    // }
    // endShape();

    pop();
  }
}


//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getColorScheme() {
  let rand = getRandomInt(0, COLOR_SCHEMES.length);
  return COLOR_SCHEMES[rand];
}

function getBackgroundColor(colors) {
  //  random
  if (colors.length === 0) {
    return [
      getRandomInt(0, 256),
      getRandomInt(0, 256),
      getRandomInt(0, 256)
    ];
  }

  let rand = getRandomInt(0, colors.length);
  return colors[rand];
}

function getFlowColors(colors, backgroundColor) {
  let bgIndex = colors.indexOf(backgroundColor);
  let flowColors = [];
  for (i = 0; i < colors.length; i++) {
    if (i !== bgIndex) {
      flowColors.push(colors[i]);
    }
  }
  return flowColors.filter(c => c);
}

function makeAnotherFlow(index, currentFlow) {
  currentFlow.display();
  // console.log("currentflow cells ______________: " + currentFlow.flowCells[0].col);
  // let newFlow;
  // for (i = 0; i < currentFlow.flowCells.length; i++) {
  //   if (validCell(currentFlow.flowCells[i])) {
  //     let cellX = (resolution * currentFlow.flowCells[i].col);
  //     let cellY = (resolution * currentFlow.flowCells[i].row);
  //     let x = random(cellX, cellX+resolution + 1);
  //     let y = random(cellY, cellY+resolution + 1);
  //     newFlow = new Flow (x, y, random(256));
  //     newFlow.display();
  //     flows.push(newFlow);
  //   }
  // }
  // makeAnotherFlow(index + 1, flows[index + 1]);
}

function setup() {
  createCanvas(5000, 5000);
  angleMode(RADIANS);

  xLeft = int(width * -0.5);
  xRight = int(width * 1.5);
  yTop = int(height * -0.5);
  yBottom = int(height * 1.5) ;
  resolution = int(width * 0.005);
  numColumns = (xRight - xLeft) / resolution;
  numRows = (yBottom - yTop) / resolution;
  flowStepLength = int(width * 0.004);
  colorScheme = getColorScheme();
  backgroundColor = getBackgroundColor(colorScheme.colors);
  flowColors = getFlowColors(colorScheme.colors, backgroundColor);
  flowFields = [];
  flows = [];

  console.log("resolution: " + resolution);
  console.log("numColumns: " + numColumns);
  console.log("numRows: " + numRows);
  console.log("xLeft: " + xLeft);
  console.log("xRight: " + xRight);
  console.log("yTop: " + yTop);
  console.log("yBottom: " + yBottom);

  background(backgroundColor);

  stroke(0);
  strokeWeight(3);
  noFill()
  rect(0,0,height/2, width/2);
  rect(height/2, width/2, width, height);

  translate(xLeft, yTop);
  flowField = new FlowField(numColumns, numRows);
}

// let counter = 0;
// let counterMax = 10

function draw() {
  rect(3000,3000, 4000, 4000);
  // console.log("counter: " + counter)
  let randX = random(xLeft, xRight + 1);
  let randY = random(yTop, yBottom + 1);
  let index = getRandomInt(0, flowColors.length);
  let flowColor = flowColors.length ? flowColors[index] : [getRandomInt(0, 256), getRandomInt(0, 256), getRandomInt(0, 256)];
  let currentFlow = new Flow(randX, randY, flowColor);
  flows.push(currentFlow);
  makeAnotherFlow(0, currentFlow);
  // counter++
  // if (counter > counterMax) {
  //   noLoop();
  // }
}
