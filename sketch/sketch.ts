import { Graphics, Renderer } from "p5";
import Worker from 'worker-loader!./sketch.worker';
const worker = new Worker();


export interface IPoint {
	x: number;
	y: number;
}


// modified from https://p5js.org/examples/simulate-the-mandelbrot-set.html
enum WWState {
	IDLE,
	WORKING,
	RESULTS_READY
}

export interface IToRender {
	width: number,
	height: number,
	center: IPoint,
	zoom: number,
	colorOffset: number
};


// GLOBAL VARS & TYPES
let zoom: p5.Element;
let colorOffset: p5.Element;

let center: IPoint = { x: 0, y: 0 };
let tempCenter: IPoint = { x: 0, y: 0 };

const ZOOM_STEP = 0.01;
const ZOOM_SCROLL_STEP = 0.1;

let lastRendered: IToRender = {
	width: 0,
	height: 0,
	center: { x: 0, y: 0 },
	zoom: 0,
	colorOffset: 0
};
let canvas: Renderer;

(window as any).setup = () => {
	console.log("🚀 - Setup initialized - P5 is running");

	// FULLSCREEN CANVAS
	canvas = createCanvas(windowWidth, windowHeight);

	// SETUP SOME OPTIONS
	rectMode(CENTER).frameRate(30);

	pixelDensity(1);

	zoom = createSlider(0, 5, 5, ZOOM_STEP);
	zoom.position(10, 50);
	zoom.style("width", "80px");

	colorOffset = createSlider(0, 1, 0.6, 0.05);
	colorOffset.position(10, 70);
	colorOffset.style("width", "80px");

	center.x = width / 2;
	center.y = height / 2;
	resetTempCenter();

	setSize();
}

(window as any).mouseWheel = (event: any) => {
	doZoom(event.deltaY);
}
(window as any).doubleClicked = (event: any) => {
	doZoom(-10);
	moveTowardsPoint({ x: event.x, y: event.y });
}

function doZoom(amount: number) {
	// TODO: scale zoom?
	zoom.value(zoom.value() as number + amount * ZOOM_SCROLL_STEP);
}

function moveTowardsPoint(point: IPoint) {
	// TODO: this
}


let lastMousePosition: IPoint;
let skipThisMovement = false;
(window as any).touchMoved = (event: MouseEvent) => {
	if (skipThisMovement) {
		return;
	}

	if (lastMousePosition) {
		let deltaX = event.clientX - lastMousePosition.x;
		let deltaY = event.clientY - lastMousePosition.y;
		center.x -= deltaX;
		center.y -= deltaY;
		tempCenter.x -= deltaX;
		tempCenter.y -= deltaY;
	} else {
		if ((event.target as HTMLElement).tagName !== "CANVAS") {
			skipThisMovement = true;
			return
		}
	}

	lastMousePosition = { x: event.clientX, y: event.clientY };
}

(window as any).touchEnded = (event: MouseEvent) => {
	skipThisMovement = false;
	lastMousePosition = null;
}


let state: WWState = WWState.IDLE;
worker.addEventListener('message', (message: any) => {
	let { newPixels, params } = message.data;

	// if a job gets returned but is no longer needed, ignore it completely
	if (deepEqual(params, lastRendered)) {
		buffer.loadPixels();
		state = WWState.RESULTS_READY;
		for (let i = 0; i < newPixels.length; i++) {
			buffer.pixels[i] = newPixels[i];
		}
		buffer.updatePixels();
	}
});


let shouldDrawBackground = false;
(window as any).windowResized = () => {
	// move center to correspond to new page size
	center.x += (windowWidth - width) / 2;
	center.y += (windowHeight - height) / 2;

	resizeCanvas(windowWidth, windowHeight);
	setSize();
}

let buffer: Graphics;
function setSize() {
	shouldDrawBackground = true;
	buffer = createGraphics(width, height);
	buffer.pixelDensity(pixelDensity());
}


(window as any).draw = () => {
	if (shouldDrawBackground) {
		shouldDrawBackground = false;
		background(0);
	}

	if (state == WWState.WORKING) {
		return;
	} else if (state == WWState.RESULTS_READY) {
		resetTempCenter();
		image(buffer, 0, 0, width, height);
		// updatePixels();
		state = WWState.IDLE;
	} else if (state === WWState.IDLE) {
		let toRender: IToRender = {
			width, height,
			zoom: zoom.value() as number,
			colorOffset: colorOffset.value() as number,
			center: { ...center }
		};

		if (!deepEqual(lastRendered, toRender)) {
			lastRendered = toRender;
			debounce("render func", 200, () => {
				worker.postMessage(toRender);
				state = WWState.WORKING;
			});

			background(0);
			image(
				buffer,
				width / 2 - tempCenter.x,
				height / 2 - tempCenter.y,
				width,
				height
			);
		}
	}
}


let debounce = (() => {
	let callbacks: { [key: string]: number } = {};
	return (identifier: string, ms: number, cb: Function) => {
		let previous = callbacks[identifier];
		if (previous) {
			clearTimeout(previous);
		}
		callbacks[identifier] = setTimeout(cb, ms);
	}
})();

function deepEqual(obj1: any, obj2: any) {
	if (obj1 === obj2) {
		return true;
	}
	if (!obj1 || !obj2) {
		return false;
	}
	for (let key in obj1) {
		if (obj1[key] !== obj2[key]) {
			if (typeof obj1[key] === 'object') {
				if (!deepEqual(obj1[key], obj2[key])) {
					return false;
				}
			} else {
				return false;
			}
		}
	}
	return true;
}


function resetTempCenter() {
	tempCenter.x = width / 2;
	tempCenter.y = height / 2;
}