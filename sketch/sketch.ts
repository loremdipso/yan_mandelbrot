// import workerPath from "file-loader?name=[name].js!./sketch.worker";
// console.log(workerPath);

import { Renderer } from "p5";

// const worker = new Worker(workerPath);
const worker = new Worker("./sketch.worker.js");


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
};


// GLOBAL VARS & TYPES
let positionX: p5.Element;
let positionY: p5.Element;
let zoom: p5.Element;

const ZOOM_STEP = 0.01;
const ZOOM_SCROLL_STEP = 0.1;
const MOVE_STEP = 0.01;

let lastRendered = { width: 0, height: 0 };
let canvas: Renderer;

(window as any).setup = () => {
	console.log("🚀 - Setup initialized - P5 is running");

	// FULLSCREEN CANVAS
	canvas = createCanvas(windowWidth, windowHeight);
	getRealSize();

	// SETUP SOME OPTIONS
	rectMode(CENTER).frameRate(30);

	loadPixels();

	// SPEED SLIDER
	positionX = createSlider(-0.5, 0.5, 0, MOVE_STEP);
	positionX.position(10, 10);
	positionX.style("width", "80px");

	positionY = createSlider(-1, 1, 0, MOVE_STEP);
	positionY.position(10, 30);
	positionY.style("width", "80px");

	zoom = createSlider(0, 5, 5, ZOOM_STEP);
	zoom.position(10, 50);
	zoom.style("width", "80px");
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
(window as any).touchStarted = (event: MouseEvent) => {
	lastMousePosition = { x: event.clientX, y: event.clientY };
}

(window as any).touchMoved = (event: MouseEvent) => {
	if (lastMousePosition) {
		let deltaX = event.clientX - lastMousePosition.x;
		let deltaY = event.clientY - lastMousePosition.y;
		positionX.value(positionX.value() as number - deltaX * MOVE_STEP);
		positionY.value(positionY.value() as number - deltaY * MOVE_STEP);
	}

	lastMousePosition = { x: event.clientX, y: event.clientY };
}


let state: WWState = WWState.IDLE;
worker.addEventListener('message', message => {
	state = WWState.RESULTS_READY;
	let newPixels = message.data;
	for (let i = 0; i < newPixels.length; i++) {
		pixels[i] = newPixels[i];
	}
});


let shouldDrawBackground = false;
(window as any).windowResized = () => {
	getRealSize();
	shouldDrawBackground = true;
	resizeCanvas(windowWidth, windowHeight);
}

function getRealSize() {
	// TODO: register bug report, width/height should work fine.
	// Shouldn't need this hack
	let ratio = width / parseInt((canvas as any).attribute("width"));

	if (ratio !== 1) {
		canvas.attribute("width", (width * (1 - ratio)).toString());
		canvas.attribute("height", (height * ratio).toString());
	}
}


(window as any).draw = () => {
	if (shouldDrawBackground) {
		shouldDrawBackground = false;
		background(0);
	}

	if (state == WWState.WORKING) {
		return;
	} else if (state == WWState.RESULTS_READY) {
		background(0);
		updatePixels();
		state = WWState.IDLE;
	} else if (state === WWState.IDLE) {
		let toRender: IToRender = {
			width, height,
			zoom: zoom.value() as number,
			center: {
				x: positionX.value() as number,
				y: positionY.value() as number
			}
		};

		if (!deepEqual(lastRendered, toRender)) {
			lastRendered = toRender;
			debounce("render func", 200, () => {
				// hoping we just need to do this once, in setup
				// loadPixels();
				worker.postMessage(toRender);
				worker.postMessage(toRender);
				state = WWState.WORKING;
			});
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
