/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./sketch/sketch.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sketch/sketch.ts":
/*!**************************!*\
  !*** ./sketch/sketch.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var worker = new Worker(\"sketch.worker.js?v=1.1\");\nvar WWState;\n(function (WWState) {\n    WWState[WWState[\"IDLE\"] = 0] = \"IDLE\";\n    WWState[WWState[\"WORKING\"] = 1] = \"WORKING\";\n    WWState[WWState[\"RESULTS_READY\"] = 2] = \"RESULTS_READY\";\n})(WWState || (WWState = {}));\n;\nvar positionX;\nvar positionY;\nvar zoom;\nvar colorOffset;\nvar ZOOM_STEP = 0.01;\nvar ZOOM_SCROLL_STEP = 0.1;\nvar MOVE_STEP = 0.01;\nvar lastRendered = { width: 0, height: 0 };\nvar canvas;\nwindow.setup = function () {\n    console.log(\"🚀 - Setup initialized - P5 is running\");\n    canvas = createCanvas(windowWidth, windowHeight);\n    rectMode(CENTER).frameRate(30);\n    pixelDensity(1);\n    positionX = createSlider(-0.5, 0.5, 0, MOVE_STEP);\n    positionX.position(10, 10);\n    positionX.style(\"width\", \"80px\");\n    positionY = createSlider(-1, 1, 0, MOVE_STEP);\n    positionY.position(10, 30);\n    positionY.style(\"width\", \"80px\");\n    zoom = createSlider(0, 5, 5, ZOOM_STEP);\n    zoom.position(10, 50);\n    zoom.style(\"width\", \"80px\");\n    colorOffset = createSlider(0, 1, 0.6, 0.05);\n    colorOffset.position(10, 70);\n    colorOffset.style(\"width\", \"80px\");\n};\nwindow.mouseWheel = function (event) {\n    doZoom(event.deltaY);\n};\nwindow.doubleClicked = function (event) {\n    doZoom(-10);\n    moveTowardsPoint({ x: event.x, y: event.y });\n};\nfunction doZoom(amount) {\n    zoom.value(zoom.value() + amount * ZOOM_SCROLL_STEP);\n}\nfunction moveTowardsPoint(point) {\n}\nvar lastMousePosition;\nvar skipThisMovement = false;\nwindow.touchMoved = function (event) {\n    if (skipThisMovement) {\n        return;\n    }\n    if (lastMousePosition) {\n        var deltaX = event.clientX - lastMousePosition.x;\n        var deltaY = event.clientY - lastMousePosition.y;\n        positionX.value(positionX.value() - deltaX * MOVE_STEP);\n        positionY.value(positionY.value() - deltaY * MOVE_STEP);\n    }\n    else {\n        if (event.target.tagName !== \"CANVAS\") {\n            skipThisMovement = true;\n            return;\n        }\n    }\n    lastMousePosition = { x: event.clientX, y: event.clientY };\n};\nwindow.touchEnded = function (event) {\n    skipThisMovement = false;\n};\nvar state = WWState.IDLE;\nworker.addEventListener('message', function (message) {\n    loadPixels();\n    state = WWState.RESULTS_READY;\n    var newPixels = message.data;\n    for (var i = 0; i < newPixels.length; i++) {\n        pixels[i] = newPixels[i];\n    }\n});\nvar shouldDrawBackground = false;\nwindow.windowResized = function () {\n    shouldDrawBackground = true;\n    resizeCanvas(windowWidth, windowHeight);\n};\nwindow.draw = function () {\n    if (shouldDrawBackground) {\n        shouldDrawBackground = false;\n        background(0);\n    }\n    if (state == WWState.WORKING) {\n        return;\n    }\n    else if (state == WWState.RESULTS_READY) {\n        background(0);\n        updatePixels();\n        state = WWState.IDLE;\n    }\n    else if (state === WWState.IDLE) {\n        var toRender_1 = {\n            width: width, height: height,\n            zoom: zoom.value(),\n            colorOffset: colorOffset.value(),\n            center: {\n                x: positionX.value(),\n                y: positionY.value()\n            }\n        };\n        if (!deepEqual(lastRendered, toRender_1)) {\n            lastRendered = toRender_1;\n            debounce(\"render func\", 200, function () {\n                worker.postMessage(toRender_1);\n                state = WWState.WORKING;\n            });\n        }\n    }\n};\nvar debounce = (function () {\n    var callbacks = {};\n    return function (identifier, ms, cb) {\n        var previous = callbacks[identifier];\n        if (previous) {\n            clearTimeout(previous);\n        }\n        callbacks[identifier] = setTimeout(cb, ms);\n    };\n})();\nfunction deepEqual(obj1, obj2) {\n    if (obj1 === obj2) {\n        return true;\n    }\n    if (!obj1 || !obj2) {\n        return false;\n    }\n    for (var key_1 in obj1) {\n        if (obj1[key_1] !== obj2[key_1]) {\n            if (typeof obj1[key_1] === 'object') {\n                if (!deepEqual(obj1[key_1], obj2[key_1])) {\n                    return false;\n                }\n            }\n            else {\n                return false;\n            }\n        }\n    }\n    return true;\n}\n\n\n//# sourceURL=webpack:///./sketch/sketch.ts?");

/***/ })

/******/ });