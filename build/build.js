var ColorHelper = (function () {
    function ColorHelper() {
    }
    ColorHelper.getColorVector = function (c) {
        return createVector(red(c), green(c), blue(c));
    };
    ColorHelper.rainbowColorBase = function () {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    };
    ColorHelper.getColorsArray = function (total, baseColorArray) {
        var _this = this;
        if (baseColorArray === void 0) { baseColorArray = null; }
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(function (x) { return _this.getColorVector(x); });
        ;
        var colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    };
    ColorHelper.getColorByPercentage = function (firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    };
    return ColorHelper;
}());
var numberOfShapes = 15;
var speed;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
    speed = createSlider(0, 15, 3, 1);
    speed.position(10, 10);
    speed.style("width", "80px");
}
function draw() {
    background(0);
    var w = 4;
    var h = (w * height) / width;
    var xMin = -w / 2;
    var yMin = -h / 2;
    loadPixels();
    var maxIterations = 100;
    var xMax = xMin + w;
    var yMax = yMin + h;
    var dx = (xMax - xMin) / (width);
    var dy = (yMax - yMin) / (height);
    console.log("started");
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
                var twoab = 2.0 * a * b;
                a = aa - bb + x;
                b = twoab + y;
                if (dist(aa, bb, 0, 0) > 16) {
                    break;
                }
                n++;
            }
            var pix = (i + j * width) * 4;
            var norm_1 = map(n, 0, maxIterations, 0, 1);
            var bright = map(sqrt(norm_1), 0, 1, 0, 255);
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
    console.log("ended");
    updatePixels();
    noLoop();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//# sourceMappingURL=../sketch/sketch/build.js.map