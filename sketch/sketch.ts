import { Graphics, Renderer } from "p5";
import Worker from 'worker-loader!./sketch.worker';


export interface IPoint {
	x: number;
	y: number;
}


enum WWState {
	IDLE,
	WORKING,
	RESULTS_READY
}

export interface IToRenderPartial {
	width: number,
	height: number,
	center: IPoint,
	zoom: number,
	colorOffset: number
};

export interface IToRenderFull extends IToRenderPartial {
	maxIterations: number
};


// GLOBAL VARS & TYPES
let canvas: Renderer;
let zoom: number = 5;
let colorOffset: p5.Element;

let center: IPoint = { x: 0, y: 0 };
let tempCenter: IPoint = { x: 0, y: 0 };

const ZOOM_STEP = 0.01;
const ZOOM_SCROLL_STEP = 0.1;
const ITERATIONS = [25, 50, 100];
const NUM_WORKERS = 4;

const DEBUG = false;

const llog = (...args: any[]) => {
	if (DEBUG) {
		console.log(...args);
	}
}

let lastRendered: IToRenderFull = {
	width: 0,
	height: 0,
	center: { x: 0, y: 0 },
	zoom: 0,
	colorOffset: 0,
	maxIterations: 0,
};

(window as any).setup = () => {
	canvas = createCanvas(windowWidth, windowHeight);
	rectMode(CENTER).frameRate(30);

	pixelDensity(1);

	colorOffset = createSlider(0, 1, 0.6, 0.05);
	colorOffset.position(10, 10);
	colorOffset.style("width", "80px");

	center.x = width / 2;
	center.y = height / 2;
	resetTempCenter();

	setSize();
	setupWorkers();
}


let workers: Worker[] = [];
let numActiveWorkers = 0;
let workerIndex = 0;
function setupWorkers() {
	for (let i = 0; i < NUM_WORKERS; i++) {
		let worker = new Worker();
		workers.push(worker);
		worker.addEventListener('message', (message: any) => {
			receiveMessage(message);
			dequeue();
		});
	}
}

function dequeue() {
	numActiveWorkers--;
}

function enqueue(params: any) {
	llog("enqueueing...");
	workers[workerIndex].postMessage(params);
	workerIndex = (workerIndex + 1) % workers.length;
	numActiveWorkers++;
}


(window as any).mouseWheel = (event: any) => {
	doZoom(event.deltaY, center);
}
(window as any).doubleClicked = (event: any) => {
	doZoom(-10, { x: event.x, y: event.y });
}

function doZoom(amount: number, target: IPoint) {
	zoom += amount * ZOOM_SCROLL_STEP;
	// TODO: improve zooming
}


let lastMousePosition: IPoint;
let skipThisMovement = false;
(window as any).touchMoved = (event: MouseEvent) => {
	llog("moved");
	if (skipThisMovement) {
		return;
	}

	if (lastMousePosition) {
		let newPosition = getPosition(event);
		let deltaX = newPosition.x - lastMousePosition.x;
		let deltaY = newPosition.y - lastMousePosition.y;
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

	lastMousePosition = getPosition(event);
}

function getPosition(event: MouseEvent | TouchEvent): IPoint {
	if ((event as TouchEvent).touches) {
		event = event as TouchEvent;
		if (event.touches.length > 0) {
			let touch = event.changedTouches.item(0);
			return { x: touch.clientX, y: touch.clientY };
		} else {
			return { x: 0, y: 0 };
		}
	} else {
		event = event as MouseEvent;
		return { x: event.clientX, y: event.clientY };
	}
}

(window as any).touchEnded = (event: MouseEvent) => {
	llog("touch ended");
	skipThisMovement = false;
	lastMousePosition = null;
}


let state: WWState = WWState.IDLE;
const receiveMessage = (message: any) => {
	let newPixels: Uint8ClampedArray = message.data.newPixels;
	let params: IToRenderFull = message.data.params;

	// if a job gets returned but is no longer needed, ignore it completely
	type K = keyof IToRenderFull;
	let toIgnore: K[] = ["maxIterations"];
	if (deepEqualInclusive(lastRendered, params, toIgnore)) {
		// only render if it's more precise than previous
		if (lastRendered.maxIterations < params.maxIterations) {
			buffer.loadPixels();
			state = WWState.RESULTS_READY;
			for (let i = 0; i < newPixels.length; i++) {
				buffer.pixels[i] = newPixels[i];
			}
			buffer.updatePixels();
		}
	}
}


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

	if (state == WWState.RESULTS_READY) {
		resetTempCenter();
		image(buffer, 0, 0, width, height);
		// updatePixels();
		state = WWState.IDLE;
	} else if (state === WWState.IDLE) {
		let toRender: IToRenderPartial = {
			width, height, zoom,
			colorOffset: colorOffset.value() as number,
			center: { ...center }
		};

		if (!deepEqualInclusive(toRender, lastRendered, ["maxIterations"])) {
			llog("Will you run me?");
			lastRendered = { ...toRender, maxIterations: 0 };
			debounce("render func", 100, () => {
				state = WWState.WORKING;
				for (let its of ITERATIONS) {
					let params: IToRenderFull = {
						...toRender,
						maxIterations: its
					};
					enqueue(params);
				}
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

	// loading bar
	llog("active workers", numActiveWorkers);
	if (numActiveWorkers > 0) {
		strokeWeight(10);
		let x = map(numActiveWorkers + 1, 0, NUM_WORKERS + 1, width, 0);

		stroke(0, 0, 0);
		line(0, 0, width, 0);

		stroke(255, 0, 0);
		line(0, 0, x, 0);
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

// Purposefully only compares elements of first argument to that of the second argument.
// That is, we're okay if the second argument has extra params.
function deepEqualInclusive(obj1: any, obj2: any, toIgnore: string[] = []) {
	if (obj1 === obj2) {
		return true;
	}
	if (!obj1 || !obj2) {
		return false;
	}
	for (let key in obj1) {
		if (toIgnore.findIndex((value, _) => value === key) >= 0) {
			continue;
		}
		if (obj1[key] !== obj2[key]) {
			switch (typeof obj1[key]) {
				case "object":
					if (!deepEqualInclusive(obj1[key], obj2[key])) {
						return false;
					}
					break;

				case "number":
					if (!areFloatsEqual(obj1[key], obj2[key])) {
						return false;
					}
					break;

				default:
					return false;
			}
		}
	}
	return true;
}


const EPSILON = 0.0001;
function areFloatsEqual(num1: number, num2: number): boolean {
	return Math.abs(num1 - num2) < EPSILON;
}

function resetTempCenter() {
	tempCenter.x = width / 2;
	tempCenter.y = height / 2;
}