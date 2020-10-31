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
	colorOffset
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
			// const norm = map(n, 0, maxIterations, 0, 1);
			// let bright = map(Math.sqrt(norm), 0, 1, 0, 255);

			let hue = wrap(map(n, 0, maxIterations, 0, 1) + colorOffset, 0, 1);
			let lig = map(n, 0, maxIterations, 0.5, 0);
			let colorRGB = hslToRgb(hue, 0.5, lig);

			if (n == maxIterations) {
				pixels[pix + 0] = 0;
				pixels[pix + 1] = 0;
				pixels[pix + 2] = 0;
				pixels[pix + 3] = 255;
			} else {
				pixels[pix + 0] = colorRGB[0];
				pixels[pix + 1] = colorRGB[1];
				pixels[pix + 2] = colorRGB[2];
				pixels[pix + 3] = 255;
			}
			x += dx;
		}
		y += dy;
	}

	return pixels;
}

// fake wrap, but w/e
function wrap(v: number, minV: number, maxV: number): number {
	if (v < minV) {
		v = Math.abs(v);
	}

	if (v > minV) {
		return v - maxV;
	}

	return v;
}

function hslToRgb(h: any, s: any, l: any) {
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p: any, q: any, t: any) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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