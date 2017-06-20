//
////////////////// jack morris, 06/19/17
//


// Constants
var animationStepInterval = 100; /* ms */

// Things to know globally
var c = document.getElementById("myCanvas");
var cw = c.width;
var ch = c.height;
var ctx = c.getContext("2d");
var timerId;

// Numbers that the sorts need to know
var insertionSortIndex;

var generateRandomRainbowArray = function(arrLength) {
  let arr = [];
  for(let x = 0; x < arrLength; x++) {
    arr.push(rainbow(arrLength, x));
  }
  arr.shuffle();
  return arr;
}

var generateRandomColor = function() { 
  return parseInt(255 * Math.random());
}

var clearCanvas = function(random) {
  
  var imgData = ctx.createImageData(cw,ch);

  let rainbowArray;
  for(let i = 0; i < cw; i++) {
    if(!random) {
      rainbowArray = generateRandomRainbowArray(ch);
    }
    for(let j = 0; j < ch; j++) {
      imgData.data[4 * (i * ch + j) + 0] = random ? generateRandomColor() : rainbowArray[j].r;
      imgData.data[4 * (i * ch + j) + 1] = random ? generateRandomColor() : rainbowArray[j].g;
      imgData.data[4 * (i * ch + j) + 2] = random ? generateRandomColor() : rainbowArray[j].b;
      imgData.data[4 * (i * ch + j) + 3] = 255;
    }
  }

  ctx.putImageData(imgData,0,0);
}

var randomizeCanvas = function() {
  clearCanvas(true);
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
  updatePixelCount(changedPixelCount);

  // Cancel timer if no pixels changed
  if(changedPixelCount == 0) {
    endCurrentSort();
    return;
  }

  // Put image data back to canvas
  ctx.putImageData(imgData, 0, 0);
}


function insertionSortPixels()
{
  insertionSortIndex++;
  console.log(insertionSortIndex);

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

  // 'Insertion sort' hues in image data
  let changedPixelCount = 0;
  let _L = hues[0].length;

  for(let i = 0; i < hues.length; i++) {
    j = insertionSortIndex;
    while((hues[i][j] < hues[i][j-1]) && j > 0) {
        
      // Increment counter

      changedPixelCount++;

      // Swap pixels in actual imgData model
        
      let r = pix[4 * (i * _L + j) + 0];
      let g = pix[4 * (i * _L + j) + 1];
      let b = pix[4 * (i * _L + j) + 2];
      let a = pix[4 * (i * _L + j) + 3];
      
      pix[4 * (i * _L + j) + 0] =  pix[4 * (i * _L + j - 1) + 0];
      pix[4 * (i * _L + j) + 1] =  pix[4 * (i * _L + j - 1) + 1];
      pix[4 * (i * _L + j) + 2] =  pix[4 * (i * _L + j - 1) + 2];
      pix[4 * (i * _L + j) + 3] =  pix[4 * (i * _L + j - 1) + 3];

      pix[4 * (i * _L + j - 1) + 0] = r;
      pix[4 * (i * _L + j - 1) + 1] = g;
      pix[4 * (i * _L + j - 1) + 2] = b;
      pix[4 * (i * _L + j - 1) + 3] = a;

      // Swap hues
      let h = hues[i][j];
      hues[i][j] = hues[i][j-1];
      hues[i][j-1] = h;

      // Move one pixel to the left
      j --;
    }
  }

  // Update pixel count display
  updatePixelCount(changedPixelCount);

  // Cancel timer if no pixels changed
  if(changedPixelCount == 0) {
    endCurrentSort();
    return;
  }

  // Put image data back to canvas
  ctx.putImageData(imgData, 0, 0);
}

var setButtonsDisabled = function(disabledBool) {
  let buttons = document.getElementById('buttonContainer').children;
  /* document.get... returns an HtmlCollection, not an Array. Here's a trick to
   * use forEach on this collection. 
   */ buttons.forEach = [].forEach;
  buttons.forEach(button => {
    button.disabled = disabledBool;
  });
}

var startInsertionSort = function() {
  insertionSortIndex = 0;
  startSort(insertionSortPixels);
}

var startBubbleSort = function() {
  startSort(bubbleSortPixels);
}

var updatePixelCount = function(changedPixelCount) {
  let changedPixelPercentage = changedPixelCount / parseFloat(cw * ch);
  document.getElementById('pixelCount').innerHTML = _percFormat(changedPixelPercentage);
}

var startSort = function(sortFunction) {
  timerId = setInterval(sortFunction, animationStepInterval);
  console.log(`Started timer ${timerId}.`);
  setButtonsDisabled(true);
}

var endCurrentSort = function() {
  clearInterval(timerId);
  timerId = null;
  setButtonsDisabled(false);
}

clearCanvas();