let time = 0;

const COLOR_SCHEMES = [
  {
    name: "b/w",
    colors: [[0, 0, 0], [255, 255, 255]]
  },
  {
    name: "AMERICA",
    colors: [[255, 0, 0], [255, 255, 255], [0, 0, 255]]
  },
  {
    name: "black/purple",
    colors: [[69, 26, 197], [129, 87, 255], [35, 25, 66], [94, 84, 142], [190, 149, 196]]
  },
  {
    name: "strawberry-shortcake",
    colors: [[216, 226, 220], [255, 229, 217], [255, 202, 212], [244, 43, 3], [244, 172, 183]]
  },
  {
    name: "turquoise-snot",
    colors: [[218, 255, 125], [84, 46, 113], [159, 134, 192], [127, 222, 255], [78, 166, 153]]
  },
  {
    name: "random",
    colors: []
  }
];

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

function getWalkerColors(colors, backgroundColor) {
  let bgIndex = colors.indexOf(backgroundColor);
  let walkerColors = [];
  for (i = 0; i < colors.length; i++) {
    if (i !== bgIndex) {
      walkerColors.push(colors[i]);
    }
  }
  return walkerColors.filter(c => c);
}

let Walker = function(color) {
  this.color = color;
  this.x = 0;
  this.y = 0;
  this.tx = getRandomInt(0, 200);
  this.ty = getRandomInt(0, 200);
  // this.tx = Math.random();
  // this.ty = Math.random();
  this.size = getRandomInt(35, 200);
}

Walker.prototype.display = function() {
    stroke(this.color);
    // strokeWeight(50);
    fill(this.color);
    circle(this.x, this.y, this.size);
};

// Randomly move up, down, left, right, or stay in one place
Walker.prototype.walk = function() {
    this.x = map(noise(this.tx), 0, 1, 0, width);
    this.y = map(noise(this.ty), 0, 1, 0, height);

    // Move forward through “time.”
    this.tx += 0.01;
    this.ty += 0.01;
};

let walkers;
let numOfWalkers;
let colorScheme;
let backgroundColor;
let walkerColors;

function setup() {
  createCanvas(1000, 1000);

  colorScheme = getColorScheme();
  backgroundColor = getBackgroundColor(colorScheme.colors);
  walkerColors = getWalkerColors(colorScheme.colors, backgroundColor);
  walkers = [];
  // numOfWalkers = getRandomInt(99, 101);
  numOfWalkers = 12;

  for (i = 0; i < numOfWalkers; i++) {
    let index = getRandomInt(0, walkerColors.length);
    let walkerColor = walkerColors.length ?
      walkerColors[index] :
      [getRandomInt(0, 256), getRandomInt(0, 256), getRandomInt(0, 256)];
    walkers.push(new Walker(walkerColor));
  }
  background(backgroundColor);
}

function draw() {

  for (i = 0; i < walkers.length; i++) {
    walkers[i].walk();
    walkers[i].display();
  }
}
