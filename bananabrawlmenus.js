
let bindingKeys = false; //false or the key
function bindKeys(){
	let free = true;
	if (keyIsDown(8)) {
		bindingKeys = false;	
		free = false;
	}//backspace
	for (let i = 0; i < keyActions.length; i++){
		if (keyCode == keyCodes[0][keyActions[i]] || keyCode == keyCodes[1][keyActions[i]]) {
			free = false;
		}
	}
	if (free) {
		keyCodes[currentPlayer][bindingKeys] = keyCode;
		keyValues[currentPlayer][bindingKeys] = 2;
		bindingKeys = false;
	}
}
function resetKeys(){
	if (currentPlayer == 0) keyCodes[0] = {
		left: 65,
		right: 68,
		up: 87,
		down: 83,

		jump: 16,
		attack: 70,
		shield: 71,
	};
	else keyCodes[1] = {
		left: 37,
		right: 39,
		up: 38,
		down: 40,

		jump: 32,
		attack: 188,
		shield: 190,
	};
}

let gameState = "titleScreen";
let currentPlayer = 0;

let scrollSpeed = 10;
let moveTimer = 0;
let moveDirection = 1;

let stage = "jungle";
let p1char = "banannon";
let p2char = "banannon";

let winner = 1;
let winnerCharacter = "banannon";

let menus = {
	titleScreen: [["start","mainMenu"]], //add quit
	mainMenu: [["brawl","",function(){trainingmode = false; gameState = "stageSelection"; menuIndex = 0; showHitboxes = false;}],["training","",function(){trainingmode = true; gameState = "stageSelection"; menuIndex = 0;}],["options","options"],["exit","titleScreen"]], //add: movelist, story, credits
	unimplemented: [["coming soon","mainMenu"]],	
	stageSelection: [["jungle","",function(){stage = "jungle"; gameState = "characterSelection"; menuIndex = characterSelectRowLength; menuIndex2 = characterSelectRowLength;}],["jungle2","",function(){stage = "jungle2"; gameState = "characterSelection"; menuIndex = characterSelectRowLength; menuIndex2 = characterSelectRowLength;}],["bananabeach","",function(){stage = "bananabeach"; gameState = "characterSelection"; menuIndex = characterSelectRowLength; menuIndex2 = characterSelectRowLength;}],["back","mainMenu"]],
	options: [["controls","controls"],["back","mainMenu"]],
	controls: [["p1","keybinds",function(){currentPlayer = 0; gameState = "keybinds"}],["p2","keybinds",function(){currentPlayer = 1; gameState = "keybinds"}],["back","options"]],
	keybinds: [["left","keybinds",function(){bindingKeys = "left"}],["right","keybinds",function(){bindingKeys = "right"}],["up","keybinds",function(){bindingKeys = "up"}],["down","keybinds",function(){bindingKeys = "down"}],["jump","keybinds",function(){bindingKeys = "jump"}],["attack","keybinds",function(){bindingKeys = "attack"}],["otherplayer","keybinds",function(){currentPlayer = currentPlayer == 0 ? 1 : 0; gameState = "keybinds"; menuIndex = 0;}],["reset","keybinds",function(){resetKeys();}],["back","controls"]],
	characterSelection: ["back","back","back","banannon","bananagent","demonana","bananimal","bllna","snow","start","start","start"],
	winscreen: [],
	pause: [["continue","liveGame"],["quit","characterSelection"]], //ADD OPTIONS (but it needs to go back to the gamescreen)
	trainingPause: [["continue","liveGame"],["hitboxes","",function(){showHitboxes = !showHitboxes;}],["quit","characterSelection"]],
}
let characterSelectRowLength = 3;

let menuIndex = 0;
let menuIndex2 = 0;
let leaveWinscreen = [false,false];
let trainingmode = false;

function processGameState(){
	if (bindingKeys) bindKeys();
	else if (gameState == "liveGame") {
		processGame();
		if (back == 1) {
			gameState = trainingmode ? "trainingPause" : "pause";
			menuIndex = 0;
			back = 2;
		}
	}
	else if (gameState == "characterSelection") {
		{
			if (keyValues[0]["down"] == 1 && !keyValues[0]["up"] && menuIndex < menus["characterSelection"].length - characterSelectRowLength) {
				menuIndex += characterSelectRowLength;
			}
			else if (keyValues[0]["up"] == 1 && !keyValues[0]["down"] && menuIndex > characterSelectRowLength - 1) {
				menuIndex -= characterSelectRowLength;
			}
			else if (keyValues[0]["right"] == 1 && !keyValues[0]["left"] && menuIndex < menus["characterSelection"].length - 1) {
				if ((menuIndex + 1) % characterSelectRowLength == 0) menuIndex -= characterSelectRowLength - 1;
				else menuIndex ++;
			}
			else if (keyValues[0]["left"] == 1 && !keyValues[0]["right"] && menuIndex > 0) {
				if (menuIndex % characterSelectRowLength == 0) menuIndex += characterSelectRowLength - 1;
				else menuIndex --;
			}
		} //p1
		{
			if (keyValues[1]["down"] == 1 && !keyValues[1]["up"] && menuIndex2 < menus["characterSelection"].length - characterSelectRowLength) {
				menuIndex2 += characterSelectRowLength;
			}
			else if (keyValues[1]["up"] == 1 && !keyValues[1]["down"] && menuIndex2 > characterSelectRowLength - 1) {
				menuIndex2 -= characterSelectRowLength;
			}
			else if (keyValues[1]["right"] == 1 && !keyValues[1]["left"] && menuIndex2 < menus["characterSelection"].length - 1) {
				if ((menuIndex2 + 1) % characterSelectRowLength == 0) menuIndex2 -= characterSelectRowLength - 1;
				else menuIndex2 ++;
			}
			else if (keyValues[1]["left"] == 1 && !keyValues[1]["right"] && menuIndex2 > 0) {
				if (menuIndex2 % characterSelectRowLength == 0) menuIndex2 += characterSelectRowLength - 1;
				else menuIndex2 --;
			}
		} //p2
		
		if ((keyValues[0]["attack"] == 1 && menus["characterSelection"][menuIndex] == "back") || (keyValues[1]["attack"] == 1 && menus["characterSelection"][menuIndex2] == "back")) {
				gameState = "stageSelection";
				menuIndex = 0;
		}
		else if ((keyValues[0]["attack"] == 1 || keyValues[1]["attack"] == 1) && menus["characterSelection"][menuIndex] == "start" && menus["characterSelection"][menuIndex2] == "start"){
			gameState = "liveGame";
			setUpGame(p1char,p2char,stage);
		} //START GAME
		
			if (keyValues[0]["attack"] == 1 && menus["characterSelection"][menuIndex] !== "start" && menus["characterSelection"][menuIndex] !== "back") {
				p1char = menus["characterSelection"][menuIndex];
				menuIndex = menus["characterSelection"].length - characterSelectRowLength;
			}
			if (keyValues[1]["attack"] == 1 && menus["characterSelection"][menuIndex2] !== "start" && menus["characterSelection"][menuIndex2] !== "back") {
				p2char = menus["characterSelection"][menuIndex2];
				menuIndex2 = menus["characterSelection"].length - characterSelectRowLength;
			}
	}
	else if (gameState == "winscreen"){
		if (keyValues[0]["attack"] == 1) leaveWinscreen[0] = true;
		if (keyValues[1]["attack"] == 1) leaveWinscreen[1] = true;
		if (leaveWinscreen[0] && leaveWinscreen[1]) {
			gameState = "stageSelection";
			leaveWinscreen = [false,false];
		}
	}
	else if (moveTimer <= 1) {
		if ((keyValues[0]["down"] || keyValues[1]["down"]) && !(keyValues[0]["up"] || keyValues[1]["up"]) && menuIndex < menus[gameState].length - 1) {
			menuIndex ++;
			moveTimer += scrollSpeed;
			moveDirection = 1;
		}
		else if ((keyValues[0]["up"] || keyValues[1]["up"]) && !(keyValues[0]["down"] || keyValues[1]["down"]) && menuIndex > 0) {
			menuIndex --;
			moveTimer += scrollSpeed;
			moveDirection = -1;
		}
		
		if (back == 1 && gameState !== "pause" && gameState != "trainingPause") {
			gameState = menus[gameState][menus[gameState].length - 1][1];
			menuIndex = 0;
		}

		if (keyValues[0]["attack"] == 1 || keyValues[1]["attack"] == 1) {
			if (menus[gameState][menuIndex][2]) menus[gameState][menuIndex][2]();
			else {
				gameState = menus[gameState][menuIndex][1];
				menuIndex = 0;
			}
		}
	}
	
	if (gameState == "pause" || gameState == "trainingPause"){
		if (back == 1) gameState = "liveGame";

		push();
		translate(halfWidth, halfHeight);
		translate(-currentCamera.x * currentCamera.zoom, currentCamera.y * currentCamera.zoom);
		scale(currentCamera.zoom, -currentCamera.zoom);

		drawScene();
		pop();
	} //ISSUE: unpausing via attack button attacks

	if (moveTimer) moveTimer --;
}

let tWidth = 24;
let tHeight = 32;
let charIndices = {
	" ": 0,
	a: 1,
	b: 2,
	c: 3,
	d: 4,
	e: 5,
	f: 6,
	g: 7,
	h: 8,
	i: 9,
	j: 10,
	k: 11,
	l: 12,
	m: 13,
	n: 14,
	o: 15,
	p: 16,
	q: 17,
	r: 18,
	s: 19,
	t: 20,
	u: 21,
	v: 22,
	w: 23,
	x: 24,
	y: 25,
	z: 26,
	0: 27,
	1: 28,
	2: 29,
	3: 30,
	4: 31,
	5: 32,
	6: 33,
	7: 34,
	8: 35,
	9: 36,
}
function customText(message,x,y,size){
	for (let i = 0; i < message.length; i ++){
		image(bananaFont,x + size * i,y,size,size * (tHeight/tWidth),charIndices[message[i]] * tWidth,0,tWidth,tHeight);
	}
}

let charFromCode = {
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	48: "0",
	65: "a",
	66: "b",
	67: "c",
	68: "d",
	69: "e",
	70: "f",
	71: "g",
	72: "h",
	73: "i",
	74: "j",
	75: "k",
	76: "l",
	77: "m",
	78: "n",
	79: "o",
	80: "p",
	81: "q",
	82: "r",
	83: "s",
	84: "t",
	85: "u",
	86: "v",
	87: "w",
	88: "x",
	89: "y",
	90: "z",
	9: "tab",
	16: "shift",
	13: "enter",
	32: "space",
	17: "control",
	91: "command",
	108: "comma",
	190: "period",
	191: "slash",
	59: "colon",
	222: "quotes",
	160: "lbracket",
	221: "rbracket",
	220: "backslash",
	109: "minus",
	192: "tidle",
	18: "alt",
	37: "left",
	39: "right",
	38: "up",
	40: "down",
	61: "plus",
}
function drawMenu(){
	if (gameState == "liveGame"); //this is handled by drawUI in bananabrawl.js
	else if (gameState == "characterSelection") {
		
		//back button
		if (menuIndex < characterSelectRowLength || menuIndex2 < characterSelectRowLength) {
			customText("back",10,10,50);
			image(menuIndex < characterSelectRowLength ? p1back : p2back, 220, 0, 100, 100);
		}
		else customText("back",10,10,40);
		
		//selected character image
			push();
			translate(0,200); scale(-1,1);
			image(portraits[p1char],0,0,-300,300);
			pop();
			image(portraits[p2char],700,200,300,300);
			//fill(0);
			//noStroke();
			//textSize(20);
			customText(p1char,20,150,30);
			customText(p2char,700,150,30);
		
		//start button
		if (menuIndex > menus["characterSelection"].length - characterSelectRowLength - 1 && menuIndex2 > menus["characterSelection"].length - characterSelectRowLength - 1) {
			image(softStart,0,400,1000,220);
			//image(startButton,0,400,1000,200,0,floor((timer / 4) % 4) * 32,256,32);
		} //redo this? maybe a blue top and red bottom
		else {
			image(softStart,0,420,1000,180);
		}
		if (menuIndex > menus["characterSelection"].length - characterSelectRowLength - 1){
			push();
			translate(340,450); scale(-1,1);
			image(p1back, 0, 0, 100, 100);
			pop();
		}
		if (menuIndex2 > menus["characterSelection"].length - characterSelectRowLength - 1) {
			image(p2back, 670, 450, 100, 100);
		}
		
		//character grid
			image(characterSelection,300,200,400,200)
		
		//character selections (again, make these an image; what about something that only takes up half the space to accomodate for both on the same spot?)
		/* something like this, and flipped for the other person:
			|||||||||/
			||
			||
			||
			./
		*/
			noFill();
			stroke(0);
			if (menuIndex > characterSelectRowLength - 1 && menuIndex < menus["characterSelection"].length - characterSelectRowLength) image(p1selection,300 + 100 * (menuIndex % characterSelectRowLength),100 + 100 * floor(menuIndex/characterSelectRowLength),100,100);
			if (menuIndex2 > characterSelectRowLength - 1 && menuIndex2 < menus["characterSelection"].length - characterSelectRowLength) image(p2selection,300 + 100 * (menuIndex2 % characterSelectRowLength),100 + 100 * floor(menuIndex2/characterSelectRowLength),100,100);
	}
	else if (gameState == "winscreen"){
		//what's the background?

		//winner is 1 or 2, so subtract one. !0 = true = 1, and !1 = false = 0
		customText(winnerCharacter + " wins ",100,100,50);
		customText(stocks[winner - 1] + " to " + stocks[!(winner-1) + 0],100,200,50);

		//leavewinscreen indicator
		noStroke();
		if (leaveWinscreen[0]){
			fill(150,150,255);
			ellipse(50,420,50,50);
		}
		if (leaveWinscreen[1]){
			fill(255,150,150);
			ellipse(50,470,50,50);
		}
		
		//player indicator
		fill(winner == 1 ? [150,150,255] : [255,150,150]);
		ellipse(50,150,50,50);

		//total damage
		customText("total damage",100,350,40);
		customText("player 1: " + totalDamage[0],100,420,30);
		customText("player 2: " + totalDamage[1],100,470,30);
		
		//have indication of which players have said to move on? so people know to press attack
	}
	else {
		//option image
		if (gameState != "pause" && gameState != "trainingPause" && menuImages[menus[gameState][menuIndex][0]]) {
			image(menuImages[menus[gameState][menuIndex][0]],0,0,1000,600);
		}

		if (gameState != "titleScreen"){
			image(gradient,0,0,1000,600);

			for (let i = 0; i < menus[gameState].length; i++){

				//color for binding
				if (bindingKeys == menus[gameState][i][0]) fill(150,180,150);
				
				//menu options
				if (i == menuIndex && !moveTimer) customText(menus[gameState][i][0],60, 90 + 80 + (80/scrollSpeed) * moveDirection * moveTimer,50);	
				else customText(menus[gameState][i][0],60, 100 + 80 * (i - menuIndex + 1) + (80/scrollSpeed) * moveDirection * moveTimer,40);	
				
				//keybind name
				if (gameState == "keybinds") {
					//player marker
					customText(currentPlayer == 0 ? "p1" : "p2", 0, 222,40);
					
					if (charFromCode[keyCodes[currentPlayer][menus[gameState][i][0]]] && menus[gameState][i][0] != "back") customText(charFromCode[keyCodes[currentPlayer][menus[gameState][i][0]]],400,100 + 80 * (i - menuIndex + 1) + (80/scrollSpeed) * moveDirection * moveTimer,50);
				}

			}

			//banana indicator
			image(bananaCursor,0, 170,60,60);	
		} //no menu text on title screen
		else {
			customText("banana",180,40,100);
			customText("brawl",230,180,100);
		} //banana brawl text
		
		if (gameState == "trainingPause"){
			customText((showHitboxes ? "on" : "off"),menuIndex == 1 ? 520 : 450,246 - 80 * (menuIndex) + (80/scrollSpeed) * moveDirection * moveTimer,menuIndex == 1 ? 50 : 40);
		}			
	}
}

let timer = 0;
let back = 0;
function draw() {
	if (gameState != "liveGame" || showHitboxes) background(150, 150, 200);

	if (keyIsDown(8)) back += back > 1 ? 0 : 1;
	else back = 0;

	buttonsPressed();

	processGameState();
	
	drawMenu();

	//text(,500,200) //crappy console.log

	timer ++;
}

			       																																				    																																				    																																				    																																				
			