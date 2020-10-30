// GLOBAL VARS & TYPES
let numberOfShapes = 15;
let speed: p5.Element;

function setup() {
	console.log("🚀 - Setup initialized - P5 is running");

	// FULLSCREEN CANVAS
	createCanvas(windowWidth, windowHeight);

	// SETUP SOME OPTIONS
	rectMode(CENTER).noFill().frameRate(30);

	// SPEED SLIDER
	speed = createSlider(0, 15, 3, 1);
	speed.position(10, 10);
	speed.style("width", "80px");
}

// function draw() {
// 	// CLEAR BACKGROUND
// 	background(0);
// 	// TRANSLATE TO CENTER OF SCREEN
// 	translate(width / 2, height / 2);

// 	const colorsArr = ColorHelper.getColorsArray(numberOfShapes);
// 	const baseSpeed = (frameCount / 500) * <number>speed.value();
// 	for (var i = 0; i < numberOfShapes; i++) {
// 		const npoints = 3 + i;
// 		const radius = 20 * i;
// 		const angle = TWO_PI / npoints;
// 		const spin = baseSpeed * (numberOfShapes - i);

// 		strokeWeight(3 + i).stroke(colorsArr[i]);

// 		push();
// 		rotate(spin);
// 		// DRAW
// 		beginShape();
// 		for (let a = 0; a < TWO_PI; a += angle) {
// 			let sx = cos(a) * radius;
// 			let sy = sin(a) * radius;
// 			vertex(sx, sy);
// 		}
// 		endShape(CLOSE);
// 		// END:DRAW
// 		pop();
// 	}
// }


// modified from https://p5js.org/examples/simulate-the-mandelbrot-set.html
function draw() {
	background(0);

	// Establish a range of values on the complex plane
	// A different range will allow us to "zoom" in or out on the fractal

	// It all starts with the width, try higher or lower values
	const w = 4;
	const h = (w * height) / width;

	// Start at negative half the width and height
	const xMin = -w / 2;
	const yMin = -h / 2;

	// Make sure we can write to the pixels[] array.
	// Only need to do this once since we don't do any other drawing.
	loadPixels();

	// Maximum number of iterations for each point on the complex plane
	const maxIterations = 100;

	// x goes from xMin to xMax
	const xMax = xMin + w;
	// y goes from yMin to yMax
	const yMax = yMin + h;

	// Calculate amount we increment x,y for each pixel
	const dx = (xMax - xMin) / (width);
	const dy = (yMax - yMin) / (height);

	// Start y
	console.log("started");
	let y = yMin;
	for (let j = 0; j < height; j++) {
		// Start x
		let x = xMin;
		for (let i = 0; i < width; i++) {

			// Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
			let a = x;
			let b = y;
			let n = 0;
			while (n < maxIterations) {
				const aa = a * a;
				const bb = b * b;
				const twoab = 2.0 * a * b;
				a = aa - bb + x;
				b = twoab + y;
				// Infinty in our finite world is simple, let's just consider it 16
				if (dist(aa, bb, 0, 0) > 16) {
					break;  // Bail
				}
				n++;
			}

			// We color each pixel based on how long it takes to get to infinity
			// If we never got there, let's pick the color black
			const pix = (i + j * width) * 4;
			const norm = map(n, 0, maxIterations, 0, 1);
			let bright = map(sqrt(norm), 0, 1, 0, 255);
			if (n == maxIterations) {
				bright = 0;
			} else {
				// Gosh, we could make fancy colors here if we wanted
				pixels[pix + 0] = bright;
				pixels[pix + 1] = bright;
				pixels[pix + 2] = bright;
				pixels[pix + 3] = 255;
			}
			x += dx;
		}
		y += dy;
	}
	console.log("ended");
	updatePixels();

	noLoop();
}


// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
