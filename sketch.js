let people = [];

let numberOfPeople = 3;
let numberOfFriendships = 1;

let pairs = [];

let numberOfFriendTriangles = 0;
let numberOfEnemyTriangles = 0;

let friendTriangles = [];
let enemyTriangles = [];

let trianglePrimeProducts = [];
let enemyTrianglePrimeProducts = [];

var showFriendHighlights = false;
var showEnemyHighlights = false;

var ramseyParameter1 = 3;
var ramseyParameter2 = 3;

//let minPeople = 3;
let maxPeople = 7;

var friendSets = [];

let numberOfPairs = 0;

var seed = 0;
let n = [];
let visualSeed = 0;

var counter = 0;

var testVariable = false;

const radius = 40;
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

var combinationsChecked = 0;

var speed = 5;
var freeze = false;

var solved = false;

function setup() {
	createCanvas(windowWidth, windowHeight);

	//visualiseTesting(numberOfPeople, numberOfFriendships, visualSeed);
	//solveR33();
	//generatePairs(2);

	//console.log(n);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {

	document.getElementById("root").ondragstart = function () { return false; };
	background(211, 211, 211);
	angleMode(DEGREES);

	drawFriendConnections();
  drawEnemyConnections();

	checkForTriangles();
	checkForEnemyTriangles();
	highlightEnemyTriangles();
	highlightFriendTriangles();

	for (var i = 0; i < people.length; i++) {
		people[i].show();
		people[i].drag();
	}
	if(numberOfPeople <= maxPeople && counter % floor((60 / speed)) == 0 && !freeze){
		visualSeed ++;
		visualiseTesting(numberOfPeople, numberOfFriendships, visualSeed);
		combinationsChecked ++;
	}
	counter++;


	if(speed > 60){
		speed = 60;
	}
	if(freeze){
		textSize(32);
		fill(204, 102, 0);
		stroke(0)
		strokeWeight(2);
		textAlign(CENTER);
		text('Press the Spacebar to unfreeze', width / 2, height - 40);
	}

	if(solved){
		textSize(32);
		fill(204, 102, 0);
		stroke(0)
		strokeWeight(2);
		textAlign(CENTER);
		text('Solved! R(3, 3) = ' + (n[n.length-1] + 1), width / 2, 100);
	}

	push();
	textSize(32);
	//fill(0, 0, 255);
	fill(204, 102, 0);
	stroke(0)
	strokeWeight(2);
	text('Solutions: ' + n, width - 200, 100);
	text('Combinations Checked: ' + combinationsChecked, 230, 100);
	text('Combinations per second: ' + speed, 220, height - 40);
	text('To change the speed, use the UP and DOWN arrow keys', width - 330, height - 200, 300, 200);
	pop();
}

function mousePressed(){
	for(var i = 0; i < people.length; i++){
		if(mouseX < people[i].position.x + radius && mouseX > people[i].position.x - radius && mouseY < people[i].position.y + radius && mouseY > people[i].position.y - radius){
			people[i].dragging = true;
			people[i].offsetX = people[i].position.x - mouseX;
			people[i].offsetY = people[i].position.y - mouseY;
			people[i].drag();
		}else{
			people[i].dragging = false;
		}
	}
}

function mouseReleased(){
	for(var i = 0; i < people.length; i++){
		people[i].dragging = false;
	}
}

function keyPressed(){
	if(keyCode === UP_ARROW){
		speed ++;
	}
	if(keyCode === DOWN_ARROW){
		speed --;
	}
	if(keyCode == 32){
		freeze = !freeze;
		}
}


function solveR33(){
	while(numberOfPeople <= maxPeople){
		visualSeed ++;
		visualiseTesting(numberOfPeople, numberOfFriendships, visualSeed);
		combinationsChecked ++;
	}
}

function visualiseTesting(p, f, s){
	//console.log(s);
	let maxFriends = ((p * (p - 3)) / 2) + p;
	if(f >= maxFriends){
		numberOfFriendships = 0;
		visualSeed = 0;
		if(numberOfPeople != n[n.length-1]){
			console.log(n);
			console.log(numberOfPeople);
			solved = true;
			freeze = true;
		}
		numberOfPeople++;
		//visualiseTesting(p, f, s);
		}else{
			//generateFriendships(p, f);
			if(s >= friendSets.length){
				numberOfFriendships++;
				visualSeed = 0;
				generateFriendships(p, f+1)
				reset(f+1, p, 0);
				//
				//visualiseTesting(p, f, s);
			}else{
				generateFriendships(p, f)
				reset(f, p, s);

				if(test()){
					if(n[n.length-1] != p){
						n.push(p);
						freeze = true;
					}
					//console.log(n);
				}
			}
		}
		//console.log(numberOfFriendships);
}

function test(){
	checkForTriangles();
	checkForEnemyTriangles();
	if(numberOfFriendTriangles == 0 && numberOfEnemyTriangles == 0){
		return true;
	}else{
		return false;
	}
}

function reset(f,p, s){
	// numberOfEnemyTriangles = 0;
	// numberOfFriendTriangles = 0;
	// friendTriangles.splice(0, friendTriangles.length);
	// enemyTriangles.splice(0, enemyTriangles.length);

	people.splice(0, people.length);
	for(var i = 0; i < p; i++){
		///people.push(new Person(i, primes[i], Array(), Array(), random(width), random(height)));
		people.push(new Person(i, primes[i], Array(), Array(), width/2, height/2));
	}
	//console.log(friendSets);
	assignFriends(s);

	for(var i = 0; i < people.length; i++){
		people[i].generateFriendPrimeProduct();
	}
	generateRandomEnemies();
}

function checkForTriangles(){
	numberOfFriendTriangles = 0;
	friendTriangles.splice(0, friendTriangles.length);
	trianglePrimeProducts.splice(0, trianglePrimeProducts.length)
	for(var i = 0; i < people.length; i++){
		for(var j = 0; j < people[i].friendships.length; j++){
			for(var k = 0; k < people[i].friendships.length; k++){
				if(j != k){
					if(checkIfFriends(people[people[i].friendships[j]].prime, people[people[i].friendships[k]].friendPrimeProduct)){
						let trianglePrimeProduct = (people[i].prime) * (people[people[i].friendships[j]].prime) * (people[people[i].friendships[k]].prime);
						let duplicate = false;
						for(var l = 0; l < trianglePrimeProducts.length; l++){
							if(trianglePrimeProducts[l] == (people[i].prime) * (people[people[i].friendships[j]].prime) * (people[people[i].friendships[k]].prime) ){
								 duplicate = true
								 //numberOfFriendTriangles ++
							}
						}
						if(!duplicate){
						friendTriangles.push(people[i].number);
						friendTriangles.push(people[people[i].friendships[j]].number);
						friendTriangles.push(people[people[i].friendships[k]].number);
						trianglePrimeProducts.push((people[i].prime) * (people[people[i].friendships[j]].prime) * (people[people[i].friendships[k]].prime));
						numberOfFriendTriangles ++;
						}
					}
				}
			}
		}
	}
	//return false;
	//console.log(friendTriangles);
}

function checkForEnemyTriangles(){
	numberOfEnemyTriangles = 0;
	enemyTriangles.splice(0, enemyTriangles.length);
	enemyTrianglePrimeProducts.splice(0, enemyTrianglePrimeProducts.length);
	for(var i = 0; i < people.length; i++){
		for(var j = 0; j < people[i].enemies.length; j++){
			for(var k = 0; k < people[i].enemies.length; k++){
				if(j != k){
					if(!checkIfFriends(people[people[i].enemies[j]].prime, people[people[i].enemies[k]].friendPrimeProduct)){
						let enemyTrianglePrimeProduct = (people[i].prime) * (people[people[i].enemies[j]].prime) * (people[people[i].enemies[k]].prime);
						let duplicate = false;
						for(var l = 0; l < enemyTrianglePrimeProducts.length; l++){
							if(enemyTrianglePrimeProducts[l] == (people[i].prime) * (people[people[i].enemies[j]].prime) * (people[people[i].enemies[k]].prime) ){
								 duplicate = true
							}
						}
						if(!duplicate){
						enemyTriangles.push(people[i].number);
						enemyTriangles.push(people[people[i].enemies[j]].number);
						enemyTriangles.push(people[people[i].enemies[k]].number);
						enemyTrianglePrimeProducts.push((people[i].prime) * (people[people[i].enemies[j]].prime) * (people[people[i].enemies[k]].prime));
						numberOfEnemyTriangles ++;
						}
					}
				}
			}
		}
	}
}

function checkIfFriends(person1Prime, person2PrimeProduct){
	if(person2PrimeProduct % person1Prime == 0){
		return true;
	} else{
		return false;
	}
}

function highlightFriendTriangles(){
	for(var i = 0; i < numberOfFriendTriangles; i++){
		let j = i * 3;
		strokeWeight(8);
		//stroke(45, 34, 244);
		stroke(76, 153, 0)
	line(people[friendTriangles[j]].position.x, people[friendTriangles[j]].position.y, people[friendTriangles[j+1]].position.x, people[friendTriangles[j+1]].position.y);
	line(people[friendTriangles[j+1]].position.x, people[friendTriangles[j+1]].position.y, people[friendTriangles[j+2]].position.x, people[friendTriangles[j+2]].position.y);
	line(people[friendTriangles[j]].position.x, people[friendTriangles[j]].position.y, people[friendTriangles[j+2]].position.x, people[friendTriangles[j+2]].position.y);
	}
}

function highlightEnemyTriangles(){
	for(var i = 0; i < numberOfEnemyTriangles; i++){
		let j = i * 3;
		strokeWeight(8);
		stroke(255, 10, 10);
		line(people[enemyTriangles[j]].position.x, people[enemyTriangles[j]].position.y, people[enemyTriangles[j+1]].position.x, people[enemyTriangles[j+1]].position.y);
		line(people[enemyTriangles[j+1]].position.x, people[enemyTriangles[j+1]].position.y, people[enemyTriangles[j+2]].position.x, people[enemyTriangles[j+2]].position.y);
		line(people[enemyTriangles[j]].position.x, people[enemyTriangles[j]].position.y, people[enemyTriangles[j+2]].position.x, people[enemyTriangles[j+2]].position.y);
	}
}

function assignFriends(_seed){
	// if(pairs.length > 1){
	let friendsPairings = friendSets[_seed];
	//console.log(friendsPairings);
	for(var i = 0; i < friendsPairings.length; i ++){
		var pair = pairs[friendsPairings[i]];
		people[pair.x].friendships.push(pair.y);
		people[pair.y].friendships.push(pair.x);
		}
	// }
}

function generateRandomFriendships(){
	for(var i = 0; i < numberOfFriendships; i++){
	person1 = random(people);
	person2 = random(people);
	if(person1 != person2){
		person1.friendships.push(person2.number);
		person2.friendships.push(person1.number);
		}
	}
}


function generateFriendships(people_number, _numberOfFriendships){
		friendSets.splice(0, friendSets.length);
		let unfinished = true;
		generatePairs(people_number);
		let f = _numberOfFriendships;
		let x = numberOfPairs;
		//console.log(x);
		// c refers to the column being altered where 0 is the rightmost column and numberOfFriends -1 is the first digit
		let c = 0
		var friendSet = [];
		for(var i = 0; i < f; i ++){
			friendSet.push(i);
		}
		const initialFriendSet = [...friendSet];
		friendSets.push(initialFriendSet);
		  while(unfinished){
			if(friendSet[f-c-1] < (x-c-1)){
	  	changeDigit(friendSet, f-c-1, f);
			c = 0;
			}else{
				c++;
			}
			if(c > f){
				unfinished = false;
			}
	  }
}

function changeDigit(friendSet, digitToChange, f){
	let n = friendSet[digitToChange];
	var columnsToReset = f - 1 - digitToChange;
	for(var i = 0; i < columnsToReset; i ++){
		friendSet[digitToChange + 1 + i] = n+i+2;
	}

	n ++;
	friendSet[digitToChange] = n;
	const newFriendSet = [...friendSet];
	friendSets.push(newFriendSet);
}

function changeLastDigit(friendSet){
	let n = friendSet[friendSet.length - 1];
	n ++;
	friendSet[friendSet.length - 1] = n;
	const newFriendSet = [...friendSet];
	friendSets.push(newFriendSet);
}

function generatePairs(p){
	numberOfPairs = 0;
	pairs.splice(0, pairs.length);
	for(var i = 0; i < p; i++){
		for(var j = i + 1; j < p; j++){
			pairs.push(createVector(i, j))
			numberOfPairs ++;
		}
	}
}

function generateRandomEnemies(){
	for (var i = 0; i < people.length; i++){
		for(var j = 0; j < people.length; j++){
			if(i != j){
			if(people[j].friendPrimeProduct % people[i].prime != 0){
				people[i].enemies.push(people[j].number);
				}
			}
		}
	}
}

function drawFriendConnections(){
	for(var i = 0; i < people.length; i++){
		//console.log(people[i].friendships);
		stroke(76, 153, 0);
		strokeWeight(2);
		for(var j = 0; j < people[i].friendships.length; j++){
			line(people[i].position.x, people[i].position.y, people[people[i].friendships[j]].position.x, people[people[i].friendships[j]].position.y)
		}
	}
}

function drawEnemyConnections(){
	for(var i = 0; i < people.length; i++){
		stroke(255, 10, 10);
		strokeWeight(2);
		for(var j = 0; j < people[i].enemies.length; j++){
			line(people[i].position.x, people[i].position.y, people[people[i].enemies[j]].position.x, people[people[i].enemies[j]].position.y)
		}
	}
}

class Person{
	constructor(number, prime, friendships, enemies, x, y){
		this.number = number;
		this.prime = prime;
		this.friendships = friendships;
		this.enemies = enemies;
		this.position = createVector(x, y);
		this.friendPrimeProduct = 1;

		this.dragging = false;
		this.offsetX;
		this.offsetY;

		let angle = (2*PI) / numberOfPeople;
		angle *= this.number;
		//console.log(angle);
		var unitPositionVector = p5.Vector.fromAngle(angle);
		unitPositionVector.mult(300);
		this.position.add(unitPositionVector);

	}

	generateFriendPrimeProduct(){
		for(var i = 0; i < this.friendships.length; i++){
			this.friendPrimeProduct *= people[this.friendships[i]].prime;
		}
	}

	show(){
		//stroke(204, 204, 0);
		stroke(76, 0, 153)
		strokeWeight(1);
		fill(76, 0, 153);
		if(this.dragging ){
			fill(0, 90, 255);
		}
		ellipse(this.position.x, this.position.y, radius);
	}
	drag(){
		if(this.dragging){
	 this.position.x = mouseX + this.offsetX;
	 this.position.y = mouseY + this.offsetY;
		}
	}
}
