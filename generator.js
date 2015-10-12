//generator.js
//2D marching squares terrain generator

var imageCTX;
var stepSize;
var width;
var height;

function initCanvas(){
  var imageCanvas = document.getElementById("canvas");
  imageCanvas.width = window.innerWidth;
  imageCanvas.height = window.innerHeight;
  imageCanvas.style.backgroundColor="#221133";
  imageCTX = imageCanvas.getContext("2d");
  width = imageCanvas.width;
  height = imageCanvas.height;
}

function density(p){          //negative is space, positive is ground
  var rad = width*.4;
  var center = [width/2,height*.8];
  var density = rad - dist2D(p,center);
  density+=texture[p[0]*4 %16] *4;
  density+=texture[p[0]*2 %16] *7.7;
  density+=texture[p[0]   %16] *15.6;
  density+=texture[p[1]*4 %16] *4;
  density+=texture[p[1]*2 %16] *7.7;
  density+=texture[p[1]   %16] *15.6;
  return density;
}

function render(step){
  render2(width,height,step);
}

function render2(width,height,step){
  //clear canvas
  imageCTX.clearRect(0, 0, canvas.width, canvas.height);

  //sample all the points
  var points = [];
  stepSize = step;

  var xlimit = Math.floor(step+width/step);
  var ylimit = Math.floor(step+height/step);

  for(var x = 0; x < xlimit; x+=1){
    for(var y = 0; y < ylimit; y+=1){
      var point = [x*step,y*step];
      points[x+y*xlimit]=density(point);
    }
  }

  //Interpolate and draw lines
  for(var i = 0; i < points.length-1; i++){
    var NW = points[i];
    var NE = points[i+1];
    var SE = points[i+xlimit+1];
    var SW = points[i+xlimit];

    var x = i%xlimit;
    var y = Math.floor(i/xlimit);

    var pointsOnEdge = [[x+map(NW,NE),y],[x+1,y+map(NE,SE)],[x+map(SW,SE),y+1],[x,y+map(NW,SW)]];

    var whichSquare =((NW>0)<<0) +
                     ((NE>0)<<1) +
                     ((SE>0)<<2) +
                     ((SW>0)<<3);

    var lineNumber = lineNumberLookup[whichSquare];
    var lines = edgeConnections[whichSquare];
    if(lineNumber==1){
      drawLine( pointsOnEdge[lines[0]],pointsOnEdge[lines[1]] );
    }
  }
}

function drawLine(p0,p1){
  imageCTX.beginPath();
  imageCTX.moveTo(p0[0]*stepSize,p0[1]*stepSize);
  imageCTX.lineTo(p1[0]*stepSize,p1[1]*stepSize);
  imageCTX.lineWidth = 2;
  imageCTX.strokeStyle = '#ffffff';
  imageCTX.stroke();
}

function dist2D(p1, p2){
  return Math.sqrt( Math.pow((p1[0]-p2[0]),2) + Math.pow((p1[1]-p2[1]),2) );
}

function map(x0,x1){
  return -x0/(x1-x0);
}

var texture = [0.0587657, 0.67431, 0.66583, 0.42095358, 0.807371, -0.22328161, -0.549806, -0.315057, 0.529369, -0.4884391, 0.408421, 0.894688, 0.537058, 0.50283, -0.955801, 0.1493195];
var lineNumberLookup = [0,1,1,1,1,2,1,1,1,1,2,1,1,1,1,0];
var edgeConnections =[[0,0,0,0],
                      [0,3,0,0],         //        0
                      [0,1,0,0],         //       -----
                      [3,1,0,0],         //     3 |   | 1
                      [1,2,0,0],         //       -----
                      [0,3,1,2],         //         2
                      [0,2,0,0],
                      [2,3,0,0],
                      [2,3,0,0],
                      [0,2,0,0],
                      [0,1,2,3],
                      [1,2,0,0],
                      [1,3,0,0],
                      [0,1,0,0],
                      [0,3,0,0],
                      [0,0,0,0]];
