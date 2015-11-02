//generator.js
//2D marching squares terrain generator

var imageCTX;
var stepSize;
var width;
var height;
var rad;
var w = 100;        //~distance between zero and max
var center;
var digPoints = [];

function initCanvas(){
  var imageCanvas = document.getElementById("canvas");
  imageCanvas.width = window.innerWidth;
  imageCanvas.height = window.innerHeight;
  imageCanvas.style.backgroundColor="#221133";
  imageCTX = imageCanvas.getContext("2d");
  width = imageCanvas.width;
  height = imageCanvas.height;
  initDensityVars();
}

function initDensityVars(){
  rad = width;
  center = [width/2,rad+height*.45];
}

function density(p){          //negative is space, positive is ground
  var density = 1-2/(1+Math.exp((rad*rad-sqrDist2d(p,center))/(w*2)));

  density += sampleNoise(t1,p,128)*1;
  density += sampleNoise(t2,p,63.4)*.5;
  density += sampleNoise(t1,p,33)*.25;

  for(var i =0; i<digPoints.length; i++){
    density += -digPoints[i][2]/(1+Math.pow(digPoints[i][0]-p[0],2)+Math.pow(digPoints[i][1]-p[1],2));
  }
  return density;
}

function render(step){
  render2(width,height,step);
}

function addDigPoint(x,y,r){
  digPoints[digPoints.length]=[x,y,r];
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

      //very unconventional - used to allow digging
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

function sqrDist2d(p1, p2){
  return Math.pow((p1[0]-p2[0]),2) + Math.pow((p1[1]-p2[1]),2);
}

function map(x0,x1){
  return -x0/(x1-x0);
}

function constrain(n,lower,upper){
  if(n<lower){
    return lower;
  }
  if(n>upper){
    return upper;
  }
  return n;
}

function sampleNoise(sample,point,scale){
  var i = 16*Math.floor(point[1]/scale)+Math.floor(point[0]/scale);
  i = i%256;
  var p0 = sample[i];
  //TODO: wrap around??
  var p1 = sample[i+1];

  //console.log(i);
  return cosineInterpolate(p0,p1,(point[0]/scale)-Math.floor(point[0]/scale));
}

function cosineInterpolate(y0,y1,x){
  //from http://paulbourke.net/miscellaneous/interpolation/
  var x1 = (1-Math.cos(x*Math.PI))/2;
  return y0*(1-x1)+y1*x1;
}

var texture = [-0.136017491875, 0.4795268081249999, 0.471046808125, 0.22617038812499998, 0.6125878081249999, -0.418064801875, -0.7445891918750001, -0.509840191875, 0.33458580812499994, -0.683222291875, 0.21363780812499997, 0.699904808125, 0.342274808125, 0.30804680812499996, -1.150584191875, -0.04546369187500002];
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
