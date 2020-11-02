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
/******/ 	__webpack_require__.p = "./";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./sketch/sketch.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/worker-loader/dist/cjs.js!./sketch/sketch.worker.ts":
/*!**************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js!./sketch/sketch.worker.ts ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function() {\n  return new Worker(__webpack_require__.p + \"bundle.b48419a0daba8773b4c2.worker.js\");\n});\n\n\n//# sourceURL=webpack:///./sketch/sketch.worker.ts?./node_modules/worker-loader/dist/cjs.js");

/***/ }),

/***/ "./sketch/sketch.ts":
/*!**************************!*\
  !*** ./sketch/sketch.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var worker_loader_sketch_worker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! worker-loader!./sketch.worker */ \"./node_modules/worker-loader/dist/cjs.js!./sketch/sketch.worker.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\nvar WWState;\n(function (WWState) {\n    WWState[WWState[\"IDLE\"] = 0] = \"IDLE\";\n    WWState[WWState[\"WORKING\"] = 1] = \"WORKING\";\n    WWState[WWState[\"RESULTS_READY\"] = 2] = \"RESULTS_READY\";\n})(WWState || (WWState = {}));\n;\n;\nvar canvas;\nvar zoom = 5;\nvar colorOffset;\nvar center = { x: 0, y: 0 };\nvar tempCenter = { x: 0, y: 0 };\nvar ZOOM_STEP = 0.01;\nvar ZOOM_SCROLL_STEP = 0.1;\nvar ITERATIONS = [25, 50, 100];\nvar NUM_WORKERS = 4;\nvar lastRendered = {\n    width: 0,\n    height: 0,\n    center: { x: 0, y: 0 },\n    zoom: 0,\n    colorOffset: 0,\n    maxIterations: 0,\n};\nwindow.setup = function () {\n    canvas = createCanvas(windowWidth, windowHeight);\n    rectMode(CENTER).frameRate(30);\n    pixelDensity(1);\n    colorOffset = createSlider(0, 1, 0.6, 0.05);\n    colorOffset.position(10, 0);\n    colorOffset.style(\"width\", \"80px\");\n    center.x = width / 2;\n    center.y = height / 2;\n    resetTempCenter();\n    setSize();\n    setupWorkers();\n};\nvar workers = [];\nvar workerIndex = 0;\nfunction setupWorkers() {\n    for (var i = 0; i < NUM_WORKERS; i++) {\n        var worker = new worker_loader_sketch_worker__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        workers.push(worker);\n        worker.addEventListener('message', receiveMessage);\n    }\n}\nfunction enqueue(params) {\n    workers[workerIndex].postMessage(params);\n    workerIndex = (workerIndex + 1) % workers.length;\n}\nwindow.mouseWheel = function (event) {\n    doZoom(event.deltaY, center);\n};\nwindow.doubleClicked = function (event) {\n    doZoom(-10, { x: event.x, y: event.y });\n};\nfunction doZoom(amount, target) {\n    zoom += amount * ZOOM_SCROLL_STEP;\n}\nvar lastMousePosition;\nvar skipThisMovement = false;\nwindow.touchMoved = function (event) {\n    if (skipThisMovement) {\n        return;\n    }\n    if (lastMousePosition) {\n        var deltaX = event.clientX - lastMousePosition.x;\n        var deltaY = event.clientY - lastMousePosition.y;\n        center.x -= deltaX;\n        center.y -= deltaY;\n        tempCenter.x -= deltaX;\n        tempCenter.y -= deltaY;\n    }\n    else {\n        if (event.target.tagName !== \"CANVAS\") {\n            skipThisMovement = true;\n            return;\n        }\n    }\n    lastMousePosition = { x: event.clientX, y: event.clientY };\n};\nwindow.touchEnded = function (event) {\n    skipThisMovement = false;\n    lastMousePosition = null;\n};\nvar state = WWState.IDLE;\nvar receiveMessage = function (message) {\n    var newPixels = message.data.newPixels;\n    var params = message.data.params;\n    var toIgnore = [\"maxIterations\"];\n    if (deepEqualInclusive(lastRendered, params, toIgnore)) {\n        if (lastRendered.maxIterations < params.maxIterations) {\n            buffer.loadPixels();\n            state = WWState.RESULTS_READY;\n            for (var i = 0; i < newPixels.length; i++) {\n                buffer.pixels[i] = newPixels[i];\n            }\n            buffer.updatePixels();\n        }\n    }\n};\nvar shouldDrawBackground = false;\nwindow.windowResized = function () {\n    center.x += (windowWidth - width) / 2;\n    center.y += (windowHeight - height) / 2;\n    resizeCanvas(windowWidth, windowHeight);\n    setSize();\n};\nvar buffer;\nfunction setSize() {\n    shouldDrawBackground = true;\n    buffer = createGraphics(width, height);\n    buffer.pixelDensity(pixelDensity());\n}\nwindow.draw = function () {\n    if (shouldDrawBackground) {\n        shouldDrawBackground = false;\n        background(0);\n    }\n    if (state == WWState.WORKING) {\n        return;\n    }\n    else if (state == WWState.RESULTS_READY) {\n        resetTempCenter();\n        image(buffer, 0, 0, width, height);\n        state = WWState.IDLE;\n    }\n    else if (state === WWState.IDLE) {\n        var toRender_1 = {\n            width: width, height: height, zoom: zoom,\n            colorOffset: colorOffset.value(),\n            center: __assign({}, center)\n        };\n        if (!deepEqualInclusive(toRender_1, lastRendered)) {\n            lastRendered = __assign(__assign({}, toRender_1), { maxIterations: 0 });\n            debounce(\"render func\", 100, function () {\n                state = WWState.WORKING;\n                for (var _i = 0, ITERATIONS_1 = ITERATIONS; _i < ITERATIONS_1.length; _i++) {\n                    var its = ITERATIONS_1[_i];\n                    var params = __assign(__assign({}, toRender_1), { maxIterations: its });\n                    enqueue(params);\n                }\n            });\n            background(0);\n            image(buffer, width / 2 - tempCenter.x, height / 2 - tempCenter.y, width, height);\n        }\n    }\n};\nvar debounce = (function () {\n    var callbacks = {};\n    return function (identifier, ms, cb) {\n        var previous = callbacks[identifier];\n        if (previous) {\n            clearTimeout(previous);\n        }\n        callbacks[identifier] = setTimeout(cb, ms);\n    };\n})();\nfunction deepEqualInclusive(obj1, obj2, toIgnore) {\n    if (toIgnore === void 0) { toIgnore = []; }\n    if (obj1 === obj2) {\n        return true;\n    }\n    if (!obj1 || !obj2) {\n        return false;\n    }\n    var _loop_1 = function (key_1) {\n        if (toIgnore.findIndex(function (value, _) { return value === key_1; }) >= 0) {\n            return \"continue\";\n        }\n        if (obj1[key_1] !== obj2[key_1]) {\n            if (typeof obj1[key_1] === 'object') {\n                if (!deepEqualInclusive(obj1[key_1], obj2[key_1])) {\n                    return { value: false };\n                }\n            }\n            else {\n                return { value: false };\n            }\n        }\n    };\n    for (var key_1 in obj1) {\n        var state_1 = _loop_1(key_1);\n        if (typeof state_1 === \"object\")\n            return state_1.value;\n    }\n    return true;\n}\nfunction resetTempCenter() {\n    tempCenter.x = width / 2;\n    tempCenter.y = height / 2;\n}\n\n\n//# sourceURL=webpack:///./sketch/sketch.ts?");

/***/ })

/******/ });