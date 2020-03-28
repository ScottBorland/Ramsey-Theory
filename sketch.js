let people = [];

let numberOfPeople = 5;
let numberOfFriendships = 8;

let numberOfTriangles = 0;

const radius = 20;
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

function setup() {
	createCanvas(windowWidth, windowHeight);

	for(var i = 0; i < numberOfPeople; i++){
		people.push(new Person(i, primes[i], Array(), random(width), random(height)));
	}
	generateRandomFriendships();

	for(var i = 0; i < people.length; i++){
		people[i].generateFriendPrimeProduct();
	}
}

function draw() {

	document.getElementById("root").ondragstart = function () { return false; };
	background(51);

	drawConnections();

	for (var i = 0; i < people.length; i++) {
		people[i].show();
		people[i].drag();
	}
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
	if(keyCode === SHIFT){
		checkForTriangles();
	}
}

function checkForTriangles(){
	let triangles = [];
	let trianglePrimeProducts = [];
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
							}
						}
						if(!duplicate){
						triangles.push(people[i].prime);
						triangles.push(people[people[i].friendships[j]].prime);
						triangles.push(people[people[i].friendships[k]].prime);
						trianglePrimeProducts.push((people[i].prime) * (people[people[i].friendships[j]].prime) * (people[people[i].friendships[k]].prime));
						numberOfTriangles ++;
						}
					}
				}
			}
		}
	}
	console.log(triangles);
}

function checkIfFriends(person1Prime, person2PrimeProduct){
	if(person2PrimeProduct % person1Prime == 0){
		return true;
	} else{
		return false;
	}
}

function checkForReciprocation(){
	let testedNumbers = [];
	//pairs of reciprocal friends are stored next to each other in the list
	let reciprocalFriendships = [];
	for(var i = 0; i < people.length; i++){
		for(var j = 0; j < people[i].friendships.length; j++){
			if(people[people[i].friendships[j]].friendPrimeProduct % people[i].prime == 0){
					reciprocalFriendships.push(people[i].prime);
					reciprocalFriendships.push(people[people[i].friendships[j]].prime);
			}
		}
	}
	console.log(reciprocalFriendships);
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

function drawConnections(){
	for(var i = 0; i < people.length; i++){
		stroke(10, 255, 10);
		strokeWeight(2);
		for(var j = 0; j < people[i].friendships.length; j++){
			line(people[i].position.x, people[i].position.y, people[people[i].friendships[j]].position.x, people[people[i].friendships[j]].position.y)
		}
	}
}

class Person{
	constructor(number, prime, friendships, x, y){
		this.number = number;
		this.prime = prime;
		this.friendships = friendships;
		this.position = createVector(x, y);
		this.friendPrimeProduct = 1;

		this.dragging = false;
		this.offsetX;
		this.offsetY;
	}

	generateFriendPrimeProduct(){
		for(var i = 0; i < this.friendships.length; i++){
			this.friendPrimeProduct *= people[this.friendships[i]].prime;
		}
	}

	show(){
		stroke(40, 24, 87);
		strokeWeight(1);
		fill(233, 64, 76);
		if(this.dragging ){
			fill(0, 255, 90);
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
