// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg

/*
I've added 2 new filters for extension. So there are total 3 of filters that can be switched using  keys: 
'1' for earlyBirdFilter
'2' for aestheticFilter
'3' for negativeEdgeFilter
on loading the early bird filter will be displayed.

The aesthetic filter combines sharpenFilter and semiGrayFilter to produces resultant image. sharpenFilter uses sharpenMatrix in convolution to sharpen the images while the semiGrayFilter manipulates the rgb channels to produce an effect.Also when the '2' key is pressed a dateFilter function is called to write current date on the image.

The next filter is negativeEdgeFilter that combines
edgeDetectionFilter and negativeFilter to produce resultant image. edgeDetectionFilter uses 2 matrixes for veetical and horizontal lines to produce adge detection effect while the negativeFilter deducts each rgb channel's value from 255.
*/

var imgIn;

var selectedFilter = 1;


var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
    
];

//matrix for sharpening the image
var sharpenMatrix = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1]
];

//horizontal edge detection / vertical lines
var edgeMatrixX = [    
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
];
//vertical edge detection / horizontal lines
var edgeMatrixY = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
];

var d,m,y;
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height * 2);
    
    //Getting curent date,month and year and storing
    d = day();
    m = month();
    y = year();
    
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    
    //instructions to select and display filters
    textSize(30);   
    fill(0);
    text("To select a specific filter press its corresponding key:",20,canvas.height/2 + 55)
    textSize(25);       
    text("Press 1 for Early bird filter",20,canvas.height/2 + 95) 
    text("Press 2 for Aesthetic filter",20,canvas.height/2 + 135)     
    text("Press 3 for Negative edge Filter",20,canvas.height/2 + 175) 
    
    //Display the image which meets selected filter value
    if (selectedFilter == 1){
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    }
    else if(selectedFilter == 2){
    image(aestheticFilter(imgIn), imgIn.width, 0);
    }
    else if (selectedFilter == 3){
    image(negativeEdgeFilter(imgIn), imgIn.width, 0);                   
    }
       
    noLoop();
    
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function keyPressed(){
    
    //keyCode used to set the value of selectedFilter variable
    if (keyCode == 49){
        console.log('1 key is pressed');
        selectedFilter = 1;
        loop();
    }  
    else if(keyCode == 50){
        console.log('2 key is pressed');
        selectedFilter = 2;
        loop();
        dateFilter()
    }  
    else if(keyCode == 51){
        console.log('3 key is pressed');
        selectedFilter = 3;
        loop();
    }      
    else {
        console.log('Enter the correct filter')
    }
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
   resultImg = sepiaFilter(imgIn);
   resultImg = darkCorners(resultImg);
   resultImg = radialBlurFilter(resultImg);
   resultImg = borderFilter(resultImg);
  return resultImg;
}

function sepiaFilter(img){
    imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + (y * imgOut.width)) * 4;

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];
            
            var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
            var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
            var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)            

            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

function darkCorners(img){
    imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();  
       
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];
            
            var dynLum = dist(imgOut.width/2, imgOut.height/2, x, y);
            
            
            if (dynLum < 300){            
            var newRed = oldRed * 1;
            var newGreen = oldGreen * 1;
            var newBlue = oldBlue * 1; 
            }
            
            else if (dynLum >= 300 && dynLum <= 450){
            dynLum = map(dynLum, 300, 450, 1, 0.4);
            dynLum = constrain(dynLum, 0.4, 1);
            var newRed = oldRed * dynLum;
            var newGreen = oldGreen * dynLum;
            var newBlue = oldBlue * dynLum; 
            }
            
            else if (dynLum > 450){            
            dynLum = map (dynLum, 450,750, 0.4,0)
            dynLum = constrain(dynLum, 0, 0.4)
            var newRed = oldRed * dynLum;
            var newGreen = oldGreen * dynLum;
            var newBlue = oldBlue * dynLum; 
            }

            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;

        }
    }
    imgOut.updatePixels();
    return imgOut;    
    
}

function radialBlurFilter(img){
  var imgOut = createImage(img.width, img.height);
  var matrixSize = matrix.length;

  imgOut.loadPixels();
  img.loadPixels();

  // read every pixel
  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {

          var index = (x + y * imgOut.width) * 4;
          
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];
          
          var c = convolution(x, y, matrix, matrixSize, img);         
        
            var dynBlur = dist(mouseX, mouseY, x, y);
            dynBlur = map(dynBlur, 100, 300, 0, 1);
            dynBlur = constrain(dynBlur, 0, 1);          

          imgOut.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
          imgOut.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur)
          imgOut.pixels[index + 2] = c[2]*dynBlur + b*(1-dynBlur)
          imgOut.pixels[index + 3] = 255;
      }
  }
  imgOut.updatePixels();
  return imgOut;     
}

function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}

function borderFilter(img){        
    var buffer = createGraphics(img.width, img.height);
    buffer.image(img,0,0)        
    buffer.noFill();
    buffer.strokeWeight(25)
    buffer.stroke(255)
    buffer.rect(0,0,buffer.width,buffer.height,60) 
    buffer.rect(0,0,buffer.width,buffer.height)  
    return buffer;    
    
}

//aestheticFilter function
function aestheticFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
 resultImg = sharpenFilter(imgIn);    
 resultImg = semiGreyFilter(resultImg);   
 return resultImg;
}
function dateFilter(){
        //To add date on filter Image
        textSize(50);
        text(d+"-"+m+"-"+y, imgIn.width * 1.4,imgIn.height * 0.8); 
}

//to sharpen the image
function sharpenFilter(img){
    imgOut = createImage(img.width, img.height);
    var sharpenMatrixLength = sharpenMatrix.length;

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + (y * imgOut.width)) * 4;

          var conv = convolution(x, y, sharpenMatrix, sharpenMatrixLength, img);

            imgOut.pixels[index + 0] = conv[0];
            imgOut.pixels[index + 1] = conv[1];
            imgOut.pixels[index + 2] = conv[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
    
}

//function that applies semiGreyFilter by manipulating rgb values
function semiGreyFilter(img){
    imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + (y * imgOut.width)) * 4;

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];
            
            var g= (oldRed + oldBlue + oldGreen)/3
            
            var newRed = (g * 0.5) 
            + (oldRed * 0.25);
            var newGreen = (g * 0.5) 
            + (oldGreen * 0.25);
            var newBlue = (g * 0.5) 
            + (oldBlue * 0.25);            

            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

//negativeEdgeFilter function
function negativeEdgeFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
 resultImg = edgeDetectionFilter(imgIn);    
 resultImg = negativeFilter(resultImg);        
 return resultImg;    
}

//edge detection function
function edgeDetectionFilter(img){
  var imgOut = createImage(img.width, img.height);
  var matrixSize = edgeMatrixX.length;

  imgOut.loadPixels();
  img.loadPixels();

  // read every pixel
  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {

          var index = (x + y * imgOut.width) * 4;
          var convX = convolution(x, y, edgeMatrixX, matrixSize, img);
          var convY = convolution(x, y, edgeMatrixY, matrixSize, img);

          convX = map(abs(convX[0]), 0, 1020, 0, 255);
          convY = map(abs(convY[0]), 0, 1020, 0, 255);
          var comb = convX + convY;

          imgOut.pixels[index + 0] = comb;
          imgOut.pixels[index + 1] = comb;
          imgOut.pixels[index + 2] = comb;
          imgOut.pixels[index + 3] = 255;
      }
  }
  imgOut.updatePixels();
  return imgOut;
}

//negative filter funtion
function negativeFilter(img){
    imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + (y * imgOut.width)) * 4;

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];
            
            //deducting original rgb values from 255;
            var newRed = 255 - oldRed;
            var newGreen = 255 - oldGreen;
            var newBlue = 255 - oldBlue;         

            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
    
}
