addEventListener('message', function (message) {
    var solution = calculateMandelbrot(message.data);
    if (solution) {
        postMessage(solution);
    }
});
function calculateMandelbrot(_e) {
    var width = _e.width, height = _e.height, center = _e.center, zoom = _e.zoom, colorOffset = _e.colorOffset;
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
            var hue_1 = wrap(map(n, 0, maxIterations, 0, 1) + colorOffset, 0, 1);
            var lig = map(n, 0, maxIterations, 0.5, 0);
            var colorRGB = hslToRgb(hue_1, 0.5, lig);
            if (n == maxIterations) {
                pixels[pix + 0] = 0;
                pixels[pix + 1] = 0;
                pixels[pix + 2] = 0;
                pixels[pix + 3] = 255;
            }
            else {
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
function wrap(v, minV, maxV) {
    if (v < minV) {
        v = Math.abs(v);
    }
    if (v > minV) {
        return v - maxV;
    }
    return v;
}
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l;
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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
