import { IToRender } from "sketch";

addEventListener('message', (message) => {
	let solution = calculateMandelbrot(message.data);
	if (solution) {
		(postMessage as any)(solution);
	}
});


function calculateMandelbrot({
	width,
	height,
	center,
	zoom,
}: IToRender): Uint8ClampedArray | null {
	// Establish a range of values on the complex plane
	// A different range will allow us to "zoom" in or out on the fractal
	let pixels = new Uint8ClampedArray(width * height * 4);

	// It all starts with the width, try higher or lower values
	const w = zoom;
	const h = (w * height) / width;

	// Start at negative half the width and height
	const xMin = -w / 2 + center.x;
	const yMin = -h / 2 + center.y;

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
				const twoAB = 2.0 * a * b;
				a = aa - bb + x;
				b = twoAB + y;

				// Infinity in our finite world is simple, let's just consider it 16
				if (dist(aa, bb, 0, 0) > 16) {
					break;
				}
				n++;
			}

			// We color each pixel based on how long it takes to get to infinity
			// If we never got there, let's pick the color black
			const pix = (i + j * width) * 4;
			const norm = map(n, 0, maxIterations, 0, 1);
			let bright = map(Math.sqrt(norm), 0, 1, 0, 255);
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

	return pixels;
}



// fake imports
function dist(_a: number, _b: number, _c: number, _d: number) {
	return Math.hypot(arguments[2] - arguments[0], arguments[3] - arguments[1]);
};

function map(
	n: any,
	start1: any,
	stop1: any,
	start2: any,
	stop2: any,
	withinBounds?: any
) {
	let newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (!withinBounds) {
		return newval;
	}
	if (start2 < stop2) {
		return this.constrain(newval, start2, stop2);
	} else {
		return this.constrain(newval, stop2, start2);
	}
};