var $;  //will represent canvas context
var max = 1000;  //max stars
var paused = false;  //pause feature (spacebar) set to false
var stars = new Array(max);  //array of stars; max is the max amount of stars defined above
var currStars = 300, starCount = 0; //currStar counter initition, starCount counter begins @ 0.
var lastfps = 0, fps = 0, lastsecond = 0;  //fps check
var angle = 0, tangle = 0;   //angle /temp angle variables.  

var width = 0, height = 0; //default width / height. to be manipulated later.
var hw = 0, hh = 0, hhw = 0, hhh = 0, maxl = 0;  //some size variables for later use
var speed = 0; //default speed
var ts = 0.3;  //initial star rotation speed (temp speed)
var speedup = false;  //speed up false - happens onclick

var maxBgs = 100;  //number of nebula clouds (faded blue balls)
var bgs = new Array(maxBgs);  //the array of clouds
var disableBg = false;  //disable clouds initial setting false.

var conA = 0;  //angle rotation when sped up (click / hold)

var mx=0, my=0;  //main x,y 
var xoff = 0, yoff =0; //x, y offeset

$(function(){ 
  setTimeout( function() {
	   setTimeout(function() {
	     conA=0.05;
      }, 4000);
      $("#addStar").click(function() { 
        if(currStars<100) 
            currStars+=10; 
        else if(currStars+100<max)
            currStars+=100;
      });
      $("#subStar").click(function() { 
          if(currStars>100) 
              currStars-=100;
          else if(currStars>10) 
                currStars-=10; 
      });
      var c = $("#canv");
          $ = c[0].getContext("2d");
          width = window.innerWidth-10;
          height = window.innerHeight-30;
          $.canvas.width  = width;
          $.canvas.height = height;
          hw = width / 2;
          hh = height / 2;
          hhw = hw / 2;
          hhh = hh / 2;
          maxl = Math.max(hw,hh);
      setTimeout( running, 50 );
      }, 100); }).mousemove(function(){
                mx=event.x;
                my=event.y;
      }).mousedown(function(){
                speedup=true;
      }).mouseup(function(){
                speedup=false;
        return false;
      }).keydown(function(e){
            if(e.keyCode == 32) {
                  paused=!paused;
             return false;
       }
 });

function running(){
	var d = new Date();
	var s = d.getSeconds();
	if( s != lastsecond) {
		lastsecond = s;
		lastfps = fps;
		fps = 0;
	} else { fps++; 
 }
 $.clearRect(0,0,$.canvas.width,$.canvas.height);
	if( !paused ){
		if(speedup && ts<10) 
			ts++;
		else if(ts>0.3) ts-=0.1;  
		speed += (ts-speed)*0.005;
		tangle = (mx-hw)/hw*Math.PI*0.2*0.3;
		angle += (tangle-angle)*0.01;
		if(conA>0.04 && conA<1)conA+=0.01;
		xoff += (mx-hw-xoff)*0.01;
		yoff += (my-hh-yoff)*0.01;
	}
  if(!disableBg) {
    $.rotate(angle*0.5);
    drawBackground();
		$.rotate(-angle*0.5);
  }
  $.translate(hw,hh);
  $.rotate(angle+angle*speed*1.2);
  frameStars();  
  $.rotate(-angle-angle*speed*1.2);
  $.translate(-hw,-hh);
  // draw console
  $.strokeStyle='rgba(100,100,100,'+conA*0.5+')';
  $.translate(hw-30, height-100);
  $.rotate(angle*2);
  $.beginPath();
  $.moveTo(-5,10);
  $.lineTo(0,-12);
  $.lineTo(5,10);
  $.closePath();
  $.stroke();
  $.stroke();
  $.fillStyle='rgba(100,100,100,'+conA*0.2+')';
  $.fillRect(-60,20,120,4);
  $.fillStyle='rgba(100,100,100,'+conA+')';
  $.fillRect(-60,20, speed*11.5, 4);
  $.rotate(-angle*2); $.translate(-hw+30,-height+100);

  // end draw console


  setTimeout( running, paused ? 500 : 30 );
	$.fillStyle = 'silver';
	$.fillText(lastfps + " fps / " + starCount + " stars", $.canvas.width - 100, 20 );
 
}
function frameStars() {
  for(var i=0;i<stars.length;i++) {
   var s = stars[i];

   if(s==null) {
		 if (starCount >= currStars) continue;
     s = createStar();
     stars[i]=s;
     starCount++;
   }
   
   if(!paused){
     frameStar(s);

     if(s.x<-maxl || s.y<-maxl || s.x>maxl || s.y>maxl) {
       stars[i] = null;
       s = null;
       starCount--;
     }
   }

   if(s!=null) drawStar(s);
  }
}

function frameStar(s)
{
 if(s.alpha<0.9) s.alpha+=0.01+speed*0.005;

 s.x+=speed*(s.x)*0.01-(xoff)*0.005;
 s.y+=speed*(s.y)*0.01-(yoff)*0.005;
}

function drawStar(s) {
 $.fillStyle= "rgba("+s.color.r+","+s.color.g+","+s.color.b+","+s.alpha+")";
 $.beginPath();
 $.arc(s.x, s.y, s.size, 0, 2 * Math.PI, false);
 $.closePath();
 $.fill();
}

function createStar() {
 c = rand(200)+55;
 return {
  x : hw-rand(width), y : hh-rand(height),
  color: { r: c, g: c, b: c }, status: 1, alpha: 0, display: rand(10)+40, size: rand(2)+1,
 };
}

function drawBackground() {
 for(var i = 0; i < bgs.length; i++) {
  if(bgs[i]==null) {
   bgs[i] = { x: rand(width), y: rand(height), size: 150+rand(200), c: rand(10)+20,
    maxalpha: 0.5, alpha: 0, times: rand(100), status: 0
   };
  }

  var bg = bgs[i];

  if(!paused){
  if(bg.status==0) {
    if(bg.alpha < bg.maxalpha) {
      bg.alpha+=0.01;
    }
    else bg.status = 1;
  } else if(bg.status == 1) {
    if(bg.times>0) bg.times--;
    else bg.status = 2;
  } else if(bg.status == 2) {
    if(bg.alpha > 0) 
    {
      bg.alpha-=0.01;
      if(bg.alpha<0) {
        bg.alpha=0;
        bg.status=9;
      }
    }
    else {
      bg.status = 9;
    }
  } else if(bg.status == 9) {
    bgs[i] = null;
    bg = null;
  }
  }

  if(bg!=null) {
    bg.x+=(bg.x-hw)*0.001-(xoff)*0.003;
    bg.y+=(bg.y-hh)*0.001-(yoff)*0.003;

    $.beginPath();
    $.arc(bg.x, bg.y, bg.size, 2 * Math.PI, false);
    $.closePath();
    
    var c = $.createRadialGradient(bg.x,bg.y,bg.size/2,bg.x,bg.y,bg.size);

    c.addColorStop(0, 'rgba(0,0,'+bg.c+','+bg.alpha+')');
    c.addColorStop(1, 'rgba(0,0,0,0)');

    $.fillStyle = c;
 
    $.fill();
  }
 }
}

function rand(max) { 
  return Math.round( Math.random()*max ); 
 }


