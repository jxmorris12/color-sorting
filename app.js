//
//jack morris, 06/19/17
//


var c = document.getElementById("myCanvas");
var cw = c.width;
var ch = c.height;
var ctx = c.getContext("2d");

var timerId;

var randomRgbVal = function() {
  return parseInt(Math.random() * 255);
}

var clearCanvas = function() {
  
  var imgData = ctx.createImageData(cw,ch);

  for(let i = 0; i < cw; i++) {
    for(let j = 0; j < ch; j++) {
      imgData.data[4 * (i * ch + j) + 0] = randomRgbVal();
      imgData.data[4 * (i * ch + j) + 1] = randomRgbVal();
      imgData.data[4 * (i * ch + j) + 2] = randomRgbVal();
      imgData.data[4 * (i * ch + j) + 3] = 255;
    }
  }

  ctx.putImageData(imgData,0,0);
}

function bubbleSortPixels()
{
  let imgData = ctx.getImageData(0, 0, cw, ch);
  let pix     = imgData.data;
  
  let hues = [];

  // Get all hues
  for(let i = 0; i < cw; i++) {
    let theseHues = [];
    for(let j = 0; j < ch; j++) {
      // Get RGB data
      let r = imgData.data[4 * (i * ch + j) + 0]
      let g = imgData.data[4 * (i * ch + j) + 1]
      let b = imgData.data[4 * (i * ch + j) + 2]
      let a = imgData.data[4 * (i * ch + j) + 3]

      // Get HSV from RGB
      let hsv = rgbToHsv(r, g, b);
      let h = hsv.h;
      let s = hsv.s;
      let v = hsv.v;

      // Store hue
      theseHues.push(h);
    }
    hues.push(theseHues);
  }

  // 'Bubble sort' hues in image data
  let changedPixelCount = 0;
  for(let i = 0; i < hues.length; i++) {
    for(let j = 1; j < hues[0].length; j++) {
      if(hues[i][j] < hues[i][j-1]) {
        
        // Increment counter

        changedPixelCount++;

        // Swap pixels in actual imgData model
        
        let r = pix[4 * (i * hues[0].length + j) + 0]
        let g = pix[4 * (i * hues[0].length + j) + 1]
        let b = pix[4 * (i * hues[0].length + j) + 2]
        let a = pix[4 * (i * hues[0].length + j) + 3]
        
        pix[4 * (i * hues[0].length + j) + 0] =  pix[4 * (i * hues[0].length + j - 1) + 0];
        pix[4 * (i * hues[0].length + j) + 1] =  pix[4 * (i * hues[0].length + j - 1) + 1];
        pix[4 * (i * hues[0].length + j) + 2] =  pix[4 * (i * hues[0].length + j - 1) + 2];
        pix[4 * (i * hues[0].length + j) + 3] =  pix[4 * (i * hues[0].length + j - 1) + 3];

        pix[4 * (i * hues[0].length + j - 1) + 0] = r;
        pix[4 * (i * hues[0].length + j - 1) + 1] = g;
        pix[4 * (i * hues[0].length + j - 1) + 2] = b;
        pix[4 * (i * hues[0].length + j - 1) + 3] = a;
        
      }
    }
  }

  // Update pixel count display
  let changedPixelPercentage = changedPixelCount / parseFloat(cw * ch);
  document.getElementById('pixelCount').innerHTML = _percFormat(changedPixelCount);

  // Cancel timer if no pixels changed
  if(changedPixelCount == 0) {
    endCurrentSort();
    return;
  }

  // Put image data back to canvas
  ctx.putImageData(imgData, 0, 0);
}

var startBubbleSort = function() {
  timerId = setInterval(bubbleSortPixels, 100);
  console.log(`Started timer ${timerId}.`);
}

clearCanvas();

///*** external helpers ***///

// format decimal as percentage
function _percFormat (perc) {
  let percString = (perc*100).toString();
  let decimalPlacePos = percString.indexOf('.');
  let lastAllowedCharPos = Math.min(decimalPlacePos + 2, percString.length);
  return percString.substr(0,lastAllowedCharPos) + '%';
}


// convert rgb color to hsv
// thanks to https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript

function rgbToHsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}