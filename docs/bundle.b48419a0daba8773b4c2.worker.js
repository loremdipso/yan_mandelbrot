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
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/ts-loader/index.js!./sketch/sketch.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ts-loader/index.js!./sketch/sketch.worker.ts":
/*!**********************************************************!*\
  !*** ./node_modules/ts-loader!./sketch/sketch.worker.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("addEventListener('message', function (message) {\n    var params = message.data;\n    var newPixels = calculateMandelbrot(params);\n    if (newPixels) {\n        postMessage({ newPixels: newPixels, params: params });\n    }\n});\nfunction calculateMandelbrot(_e) {\n    var width = _e.width, height = _e.height, center = _e.center, zoom = _e.zoom, colorOffset = _e.colorOffset, maxIterations = _e.maxIterations;\n    var pixels = new Uint8ClampedArray(width * height * 4);\n    var w = zoom;\n    var h = (w * height) / width;\n    var ratio = w / width;\n    var xMin = -w / 2 - ((width / 2 - center.x) * ratio);\n    var yMin = -h / 2 - ((height / 2 - center.y) * ratio);\n    var xMax = xMin + w;\n    var yMax = yMin + h;\n    var dx = (xMax - xMin) / (width);\n    var dy = (yMax - yMin) / (height);\n    var y = yMin;\n    for (var j = 0; j < height; j++) {\n        var x = xMin;\n        for (var i = 0; i < width; i++) {\n            var a = x;\n            var b = y;\n            var n = 0;\n            while (n < maxIterations) {\n                var aa = a * a;\n                var bb = b * b;\n                var twoAB = 2.0 * a * b;\n                a = aa - bb + x;\n                b = twoAB + y;\n                if (dist(aa, bb, 0, 0) > 16) {\n                    break;\n                }\n                n++;\n            }\n            var pix = (i + j * width) * 4;\n            var hue_1 = wrap(map(n, 0, maxIterations, 0, 1) + colorOffset, 0, 1);\n            var lig = map(n, 0, maxIterations, 0.5, 0);\n            var colorRGB = hslToRgb(hue_1, 0.5, lig);\n            if (n == maxIterations) {\n                pixels[pix + 0] = 0;\n                pixels[pix + 1] = 0;\n                pixels[pix + 2] = 0;\n                pixels[pix + 3] = 255;\n            }\n            else {\n                pixels[pix + 0] = colorRGB[0];\n                pixels[pix + 1] = colorRGB[1];\n                pixels[pix + 2] = colorRGB[2];\n                pixels[pix + 3] = 255;\n            }\n            x += dx;\n        }\n        y += dy;\n    }\n    return pixels;\n}\nfunction wrap(v, minV, maxV) {\n    if (v < minV) {\n        v = Math.abs(v);\n    }\n    if (v > minV) {\n        return v - maxV;\n    }\n    return v;\n}\nfunction hslToRgb(h, s, l) {\n    var r, g, b;\n    if (s == 0) {\n        r = g = b = l;\n    }\n    else {\n        var hue2rgb = function hue2rgb(p, q, t) {\n            if (t < 0)\n                t += 1;\n            if (t > 1)\n                t -= 1;\n            if (t < 1 / 6)\n                return p + (q - p) * 6 * t;\n            if (t < 1 / 2)\n                return q;\n            if (t < 2 / 3)\n                return p + (q - p) * (2 / 3 - t) * 6;\n            return p;\n        };\n        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;\n        var p = 2 * l - q;\n        r = hue2rgb(p, q, h + 1 / 3);\n        g = hue2rgb(p, q, h);\n        b = hue2rgb(p, q, h - 1 / 3);\n    }\n    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];\n}\nfunction dist(_a, _b, _c, _d) {\n    return Math.hypot(arguments[2] - arguments[0], arguments[3] - arguments[1]);\n}\n;\nfunction map(n, start1, stop1, start2, stop2, withinBounds) {\n    var newVal = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;\n    if (!withinBounds) {\n        return newVal;\n    }\n    if (start2 < stop2) {\n        return this.constrain(newVal, start2, stop2);\n    }\n    else {\n        return this.constrain(newVal, stop2, start2);\n    }\n}\n;\n\n\n//# sourceURL=webpack:///./sketch/sketch.worker.ts?./node_modules/ts-loader");

/***/ })

/******/ });