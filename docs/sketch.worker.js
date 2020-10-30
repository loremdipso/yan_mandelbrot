addEventListener('message', function (message) {
    var solution = calculateMandelbrot(message.data);
    if (solution) {
        postMessage(solution);
    }
});
function calculateMandelbrot(_e) {
    var width = _e.width, height = _e.height, center = _e.center, zoom = _e.zoom;
    var pixels = new Uint8ClampedArray(width * height * 4);
    var w = zoom;
    var h = (w * height) / width;
    var xMin = -w / 2 + center.x;
    var yMin = -h / 2 + center.y;
    var maxIterations = 100;
    var xMax = xMin + w;
    var yMax = yMin + h;
    var dx = (xMax - xMin) / (width);
    var dy = (yMax - yMin) / (height);
    var y = yMin;
    for (var j = 0; j < height; j++) {
        var x = xMin;
        for (var i = 0; i < width; i++) {
            var a = x;
            var b = y;
            var n = 0;
            while (n < maxIterations) {
                var aa = a * a;
                var bb = b * b;
                var twoAB = 2.0 * a * b;
                a = aa - bb + x;
                b = twoAB + y;
                if (dist(aa, bb, 0, 0) > 16) {
                    break;
                }
                n++;
            }
            var pix = (i + j * width) * 4;
            var norm_1 = map(n, 0, maxIterations, 0, 1);
            var bright = map(Math.sqrt(norm_1), 0, 1, 0, 255);
            if (n == maxIterations) {
                bright = 0;
            }
            else {
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
function dist(_a, _b, _c, _d) {
    return Math.hypot(arguments[2] - arguments[0], arguments[3] - arguments[1]);
}
;
function map(n, start1, stop1, start2, stop2, withinBounds) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return this.constrain(newval, start2, stop2);
    }
    else {
        return this.constrain(newval, stop2, start2);
    }
}
;
