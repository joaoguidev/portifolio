'use strict';
// -----------------------------------Globals------------------------------------------
let level = 'space';
let canvasWidth = 1200;
let	canvasHeight = 600;
let canvasCenterX = canvasWidth/2;
let canvasCenterY = canvasHeight/2;
// let distPlanetToMoon = 200; 
let landerPressKeyCount = 50;
let context;
let surfice;
let eagle;
let moon;
let planet;
let saturnV;
let refresh;
// let playerHealth;
let spaceImg = new Image();
let earthImg = new Image();
let moonSpace = new Image();
let lander = new Image();
let moonBack = new Image();
spaceImg.src = 'spaceBack.jpeg'; 
earthImg.src = 'earth.png'; 
moonSpace.src = 'moonSpace.png'; 
lander.src = 'lander.png'; 
moonBack.src = 'moonBack.jpg'; 
// ---------------------------------Events----------------------------------------------
addEventListener('load',setup);
addEventListener('keydown',burn);
addEventListener('keydown', control);

// --------------------------------Init Setup------------------------------------------

function setup(){
	let canvas = document.getElementById('mapCanvas');
	context = canvas.getContext('2d');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	if(level === 'space'){
		planet = new oppenheimer(canvasCenterX,canvasCenterY,20, 0, 0, earthImg);
		moon = new oppenheimer(canvasCenterX,canvasCenterY,10, 250, 0.005, moonSpace); 
		saturnV = new rocket(canvasCenterX,canvasCenterY,30, 0.002);
	} else if(level === 'moon'){
		eagle = new vehicle(100,100,lander);
		surfice = new terrain();
		surfice.plates();
		
	} else if(level === 'gameOver') {
		gameOver();
	}
	refresh = setInterval(updateGame,1000/60);
}
function burn(event) {
	if(event.keyCode === 32 && saturnV.engineStatus === false && saturnV.location[0] == canvasCenterX)  {
		saturnV.engineStatus = true;
	} else if (event.keyCode == 32 && saturnV.location[0] == moon.x) {
		// saturnV.magnitude = saturnV.mag;
		saturnV.engineStatus = false;	
	}
}

// --------------------------------------------- Rigid Bodies Elements------------------------------------------------------------------
function oppenheimer(x,y,r,mag,vel,color){
	this.x = x;
	this.y = y;
	this.r = r;
	this.magnitude = mag;
	this.velocity = vel;
	this.color = color;
	this.radians = 0;
	this.update = function() {
		context.save();
		context.beginPath();
		// context.fillStyle = this.color;
		// context.arc(this.x,this.y,this.r,0,2*Math.PI);
		context.drawImage(this.color, this.x - this.r , this.y - this.r, this.r*2, this.r*2);
		context.font='22px sans-serif';
		context.fillStyle="white";

		context.fillText( saturnV.engineStatus? '': 'Press Space', 530, 200, canvasWidth);
		context.fillText( saturnV.location[0] == moon.x && saturnV.engineStatus? 'Press Space': '', 530, 200, canvasWidth);

		context.fill();
		context.restore();
	};
	this.newPos = function(){
		this.radians += this.velocity; 
		this.x = canvasCenterX + Math.cos(-this.radians) * this.magnitude;
		this.y = canvasCenterY + Math.sin(-this.radians) * this.magnitude;
	};
}

// --------------------------------------------Rocket-------------------------------------------
function rocket(x,y,mag,vel) {
	this.x = x;
	this.y = y;
	this.magnitude = mag;
	this.velocity = vel;
	this.radians = 0; 
	this.engineStatus = false; //false = off true = on
	this.fMass = 100;
	this.consumption = 0; //cons/sec
	this.burnTime = 0;//sec
	this.burnTimestamp = 0;//sec
	this.thrust = 0.06;
	this.acc = 0;
	this.location = [canvasCenterX, canvasCenterY];
	this.propulsion =  function(){
		if(this.engineStatus === true && this.location[0] == canvasCenterX) {
			// this.fMass -= (this.consumption * (timestamp - this.burnTime));
			this.acc += this.thrust;
		} else if(this.engineStatus === false && Math.hypot(this.x - moon.x, this.y - moon.y) <= 40 ){
			// this.acc = 0;
			// this.burnTimestamp = 0; 
			this.magnitude -= this.thrust;
		}
	};
	this.locationLocationLocation = function(){
		if (Math.hypot(this.x - moon.x, this.y - moon.y) > 40 ) {
			this.location = [canvasCenterX, canvasCenterY];
			this.velocity = vel;
		} else {
			this.location = [moon.x, moon.y];
			this.acc = 0;
			this.thrust = 0.02;
			this.velocity = 0.03;
		}
	};
	this.guidance = function(){
	};
	this.update = function(){
		context.save();
		context.beginPath();
		context.fillStyle = 'hsl(35,100%,50%)';
		context.arc(this.x,this.y,3,0,2*Math.PI);
		context.fill();
		context.restore();
		this.propulsion();
		this.hitMoon();
	};
	this.newPos = function(){
		if(this.x > canvasWidth || this.x < 0 || this.y < 0 || this.y > canvasHeight){
			level = 'gameOver';
		}
		this.radians += this.velocity; 
		this.x = this.location[0] + Math.cos(-this.radians) * (this.magnitude + this.acc);
		this.y = this.location[1] + Math.sin(-this.radians) * (this.magnitude + this.acc);
	};
	this.hitMoon = function(){
		if(Math.hypot(this.x - moon.x, this.y - moon.y) <= moon.r) {
			level = 'moon';
			setup();
		} 
	};
}

// ---------------------------------------------------Moon----------------------------------------

function terrain(){
	this.terrainPlates = [];
	// this.resolutionFactor = 0;
	this.plates = function() {
		this.resolutionFactor = this.randomT(70);
		this.terrainResolution = Math.floor(canvasWidth/this.resolutionFactor);
		this.terrainPlates = [];
		for(let i = this.resolutionFactor; i >= 0 ; i--) { 
			let recHeight = this.randomT(100);
			let plate = {
				id: i,
				height:recHeight,
				width:this.terrainResolution,
				positionX: i * this.terrainResolution,
				positionY: canvasHeight - recHeight,
			};
			this.terrainPlates.push(plate);
		}
	};
	this.randomT = function (maxLimit){
		return Math.floor(Math.random()*maxLimit);
	};
	this.tDraw = function(){
		for(let i = this.resolutionFactor ; i >= 0; i--){
			context.save();
			context.beginPath();
			context.fillStyle = 'gray';
			context.fillRect(this.terrainPlates[i].positionX,this.terrainPlates[i].positionY,this.terrainPlates[i].width,this.terrainPlates[i].height);
			context.restore();
		}
	};
}
function vehicle(x,y,img) {
	this.x = x;
	this.y = y;
	this.velX = 5;
	this.velY = 0;
	this.angle = 0;
	this.gravity = 0.01;
	this.gravAcc = 0;
	this.angle = 0;
	this.height = 20;
	this.width = 20;
	this.img = img;
	this.hitStatus;
	this.onFloor;
	this.fuelColor;
	this.propulsion = function() {
	};
	this.update = function(){
		context.save();
		context.beginPath();
		context.drawImage(this.img, this.x, this.y , this.width, this.height);
		context.restore();
		context.closePath();
		context.beginPath();
		context.font='22px sans-serif';
		if(landerPressKeyCount > 35) {
			this.fuelColor = 'hsl(120,100%,50%)';
		} else if(landerPressKeyCount > 20) {
			this.fuelColor = 'hsl(60,100%,50%)';
		} else if(landerPressKeyCount > 0) {
			this.fuelColor = 'hsl(0,100%,50%)';
		}
		context.fillStyle=this.fuelColor;
		context.fillText('Fuel Left: ' + landerPressKeyCount, 10, 25, canvasWidth);
	};
	this.newPos = function(){  
		if(this.x > canvasWidth){
			this.x = 0;
			surfice.plates();
		} else if(this.x < 0) {
			this.x = canvasWidth;
			surfice.plates();
		} 
		if(this.y < 0 || this.y > canvasHeight) {
			level = 'gameOver';
		}
		this.gravAcc += this.gravity; 
		this.x += this.velX;
		this.y += this.velY + this.gravAcc;
		this.hitGround();
	};
	this.hitGround = function() {
		for(let i = 0; i < surfice.terrainPlates.length; i++){
			for(let m = 0; m < surfice.terrainPlates[i].width; m++){
				if(Math.hypot((this.x + this.width) - surfice.terrainPlates[i].positionX - m,this.y - surfice.terrainPlates[i].positionY + this.height).toFixed(0) <= 1|| Math.hypot(this.x - surfice.terrainPlates[i].positionX - m, this.y - surfice.terrainPlates[i].positionY + this.height).toFixed(0) <= 1) {
					this.hitStatus = 'onGround';
					this.onFloor = surfice.terrainPlates[i];
				}
			}
			for(let j = 0; j < surfice.terrainPlates[i].height; j++){
				if(Math.hypot((this.x + this.width) - surfice.terrainPlates[i].positionX, this.y - (surfice.terrainPlates[i].positionY + j)).toFixed(0) <= 1 || Math.hypot(this.x - (surfice.terrainPlates[i].positionX + surfice.terrainPlates[i].width), this.y - (surfice.terrainPlates[i].positionY + j)).toFixed(0) <= 1){
					this.hitStatus = 'crash';
				}
			}
		}
		if(this.hitStatus === 'onGround' && this.x >= this.onFloor.positionX && (this.x + this.width) <= (this.onFloor.positionX + this.onFloor.width)){
			this.velX = 0;
			this.velY = 0;
			this.angle = 0;
			this.gravity = 0;
			this.gravAcc = 0;
			context.beginPath();
			context.font='22px sans-serif';
			context.textAlign='center';
			context.fillStyle='white';
			context.fillText('Congratulations! The Eagle has landed.', canvasCenterX, canvasCenterY, canvasWidth);
			context.restore();
			context.closePath();
		} else if (this.hitStatus === 'onGround'){
			this.hitStatus = 'crash';
		}
		if(this.hitStatus === 'crash'){
			level = 'gameOver';
		}
	};
}
function control(event){
	if(level === 'moon'){
		if(eagle.hitStatus !== 'onGround'){
			if(landerPressKeyCount > 0) {
				if(event.keyCode == 38) {
					eagle.velY -= 0.4;
					landerPressKeyCount -= 1;
				} else if(event.keyCode == 40) {
					eagle.velY += 0.4;
					landerPressKeyCount -= 1;
				} else if(event.keyCode == 37){
					eagle.velX -= 0.4;
					landerPressKeyCount -= 1;
				} else if(event.keyCode == 39){
					eagle.velX += 0.4;
					landerPressKeyCount -= 1;
				}
			}
		}
	}
}
// -----------------------------------------------------------------------------------------Updade Game ---------------------------------------------------------------------------------------------------------------
function updateGame() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	if(level === 'space'){
		context.drawImage(spaceImg,0,0);
		planet.update();
		moon.update();
		moon.newPos();
		saturnV.update();
		saturnV.newPos();
		saturnV.propulsion();
		saturnV.locationLocationLocation();
	} else if(level === 'moon'){
		context.drawImage(moonBack,0,0);
		surfice.tDraw();
		eagle.update();
		eagle.newPos();
	} else if(level === 'gameOver'){
		clearInterval(refresh);		
		addEventListener('click',restart);
		setup();
	}
}


// ------------------------------------------------------------------------------------------General Tools ----------------------------------------------------------------------------------------

// function degreeToRadian(deg){
// 	return deg*180/Math.PI;
// }
// function radianToDegree(rad){
// 	return rad*Math.PI/180;
// }


// -------------------------------------------------------------------------------------------Game Over----------------------------------------------------------------------------------------------------
function gameOver(){
	context.beginPath();
	context.save();
	context.rect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle='hsl(0,0%,0%)';
	context.fill();
	context.closePath();
	context.beginPath();
	context.font='22px sans-serif';
	context.textAlign='center';
	context.fillStyle='white';
	context.fillText('Houston we have a problem!', canvasCenterX, canvasCenterY, canvasWidth);
	context.restore();
}
function restart(){
	window.location.reload(true);
}

