console.log(roundArray(normalize(randomTexture(256)),4));
//console.log(checkSum(normalize(rand16())));

function randomTexture(n){
  var r = [];
  for(var i = 0; i < n; i++){
    r[i]=Math.random();
  }
  return r;
}

function normalize(s){
  var maxabs=0;

  var total = 0;

  for(var i = 0; i < s.length; i++){
    total+=s[i];
  }

  total/=s.length;
  for(var i = 0; i < s.length; i++){
    s[i]-=total;
    if(Math.abs(s[i])>maxabs){
      maxabs = Math.abs(s[i]);
    }
  }
  for(var i = 0; i < s.length; i++){
    s[i]/=maxabs;
  }
  return s;
}

function checkSum(s){
  var total = 0;
  for(var i = 0; i < s.length; i++){
    total+=s[i];
  }
  return total;
}

function roundArray(s,digits){
  for(var i = 0; i < s.length; i++){
    s[i] = parseFloat( s[i].toFixed(digits) );
  }
  return s;
}
