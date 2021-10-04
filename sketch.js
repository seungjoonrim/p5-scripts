const COLOR_SCHEMES = [
  {
    name: "b/w",
    colors: [[0, 0, 0], [255, 255, 255]]
  },
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
  // {
  //   name: "random",
  //   colors: []
  // }
];

let xLeft;
let xRight;
let yTop;
let yBottom;
let resolution;
let numColumns;
let numRows;
let numFlowSteps;
let flowStepLength;
let colorScheme;
let backgroundColor;
let flowColors;
let flowFields;

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
        let lineLength = width/numColumns ;

        grid[i][ii] = angle;

        // stroke(2);
        // push();
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
  constructor(flowFieldId, xStart, yStart, color) {
    this.flowFieldId = flowFieldId;
    this.xStart = xStart;
    this.yStart = yStart;
    this.x = xStart;
    this.y = yStart;
    this.color = color;
  }

  display() {
    push();
    strokeWeight(2);
    stroke(this.color);
    fill(this.color);
    noFill();

    beginShape();

    for (i = 0; i < numFlowSteps; i++) {
      curveVertex(this.x, this.y);

      let xOff = this.x - xLeft;
      let yOff = this.y - yTop;

      let iCol = int(xOff / resolution);
      let iRow = int(yOff / resolution);
      iCol = iCol < 0 ? 0 : iCol;
      iCol = iCol >= numColumns ? numColumns - 1 : iCol;
      iRow = iRow < 0 ? 0 : iRow;
      iRow = iRow >= numRows ? numRows - 1 : iRow;

      let angle = flowFields[this.flowFieldId].grid[iCol][iRow];

      let xStep = flowStepLength * cos(angle);
      let yStep = flowStepLength * sin(angle);
      this.x = this.x + xStep;
      this.y = this.y + yStep;
    }

    this.x = this.xStart;
    this.y = this.yStart;
    endShape();
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
  numFlowSteps = 5000;
  flowStepLength = width * 0.001;
  colorScheme = getColorScheme();
  backgroundColor = getBackgroundColor(colorScheme.colors);
  flowColors = getFlowColors(colorScheme.colors, backgroundColor);
  flowFields = [];

  console.log("resolution: " + resolution);
  console.log("numColumns: " + numColumns);
  console.log("numRows: " + numRows);
  console.log("xLeft: " + xLeft);
  console.log("xRight: " + xRight);
  console.log("yTop: " + yTop);
  console.log("yBottom: " + yBottom);

  background(backgroundColor);

  translate(xLeft, yTop);

  flowFields.push(new FlowField(numColumns, numRows));
  // flowFields.push(new FlowField(numColumns, numRows));
}

let counter = 0;
let counterMax = 30000

function draw() {
  for (xx = 0; xx < flowFields.length; xx++) {
    let randX = random(xLeft, (width + (2*xRight)) - 1);
    let randY = random(yTop, (height + (2*yBottom)) - 1);
    // let randX = random(width);
    // let randY = random(height*-0.2, height*-0.1);
    let index = getRandomInt(0, flowColors.length);
    let flowColor = flowColors.length ? flowColors[index] : [getRandomInt(0, 256), getRandomInt(0, 256), getRandomInt(0, 256)];
    let flow = new Flow(xx, randX, randY, random(256));
    flow.display();
  }

  // about 1 hour
  let progress = ((counter/counterMax)*100).toFixed(2);
  console.log("progress: " + progress + "%");
  if (counter >= counterMax) {
    console.log("DONE! :)")
    noLoop();
  }
  counter++;
}
