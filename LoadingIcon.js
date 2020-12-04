// Definition du canvas
var context;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 320;
context.canvas.width = 320;

// Definition des variables
var speed = 20;
var count = 0;
var nbrLines = 12;
var nbrRows = 12;
var seed = [false, false, false, false, false, false, true, true, false, false, false, false,
			false, false, false, false, false, false, true, true, false, false, false, false,
			false, false, false, false, false, false, false, false, false, false, false, false,
			false, false, false, false, true, true, true, true, false, false, false, false,
			true, true, false, true, false, false, false, false, true, false, false, false,
			true, true, false, true, false, true, true, false, true, false, false, false,
			false, false, false, true, false, false, false, true, true, false, true, true,
			false, false, false, true, false, false, false, false, true, false, true, true,
			false, false, false, false, true, true, true, true, false, false, false, false,
			false, false, false, false, false, false, false, false, false, false, false, false,
			false, false, false, false, true, true, false, false, false, false, false, false,
			false, false, false, false, true, true, false, false, false, false, false, false];

// Definition de la classe necessaires au projet
class Cell{
	constructor(i,j,s){
		this.height = context.canvas.height / nbrLines;
		this.width = context.canvas.width / nbrRows;
		this.x = i * this.height;
		this.y = j * this.width;

		this.minToDie = 1;
		this.maxToDie = 4;
		this.toLive = 3;
		this.currState = s;
		this.nextState = s;
		this.neighbours = new Array();
	}

	display(){
        this.currState = this.nextState;

		if(this.currState){
        	context.fillStyle = "red";
		} else {
			context.fillStyle = "grey";
		}
		context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
	}

	displayEmpty(){
		context.fillStyle = "grey";
		context.beginPath();
        context.rect(this.x-1, this.y-1, this.width+2, this.height+2);
        context.fill();
	}

	toggle(){
		this.currState = !this.currState;
		this.nextState = !this.nextState;
	}

	update(){
		let sum = 0;
		for(cell of this.neighbours){
			if(cell.currState){
				sum++;
			}
		}
		if(this.currState){
			if(sum <= this.minToDie || sum >= this.maxToDie){
				this.nextState = false;
			}
		} else {
			if(sum == this.toLive){
				this.nextState = true;
			}
		}
	}
}

// Creer la matrice de cellules
var cells = new Array();
for(let i=0; i<nbrRows; i++){
	var temp = Array();
	for(let j=0; j<nbrLines; j++){
		temp.push(new Cell(i, j, seed[j * nbrRows + i]));
	}
	cells.push(temp);
}

// Attribuer les voisins
for(let i=0; i<nbrLines; i++){
	for(let j=0; j<nbrRows; j++){
		let up, right, down, left;
		if(i == 0){
			up = nbrLines - 1;
			down = i + 1;
		} else if(i == nbrLines - 1){
			up = i - 1;
			down = 0;
		} else {
			up = i - 1;
			down = i + 1;
		}
		if(j == 0){
			right = j + 1;
			left = nbrRows - 1;
		} else if(j == nbrRows - 1){
			right = 0;
			left = j - 1;
		} else {
			right = j + 1;
			left = j - 1;
		}
		cells[i][j].neighbours.push(cells[up][left]);
		cells[i][j].neighbours.push(cells[up][j]);
		cells[i][j].neighbours.push(cells[up][right]);
		cells[i][j].neighbours.push(cells[i][left]);
		cells[i][j].neighbours.push(cells[i][right]);
		cells[i][j].neighbours.push(cells[down][left]);
		cells[i][j].neighbours.push(cells[down][j]);
		cells[i][j].neighbours.push(cells[down][right]);

	}
}

// Boucle d'animation
loop = function(){
	if(count == 0){
		for(line of cells){
			for(cell of line){
				cell.update();
				cell.displayEmpty();
			}
		}
		for(line of cells){
			for(cell of line){
				cell.display();
			}
		}
		count++;
	} else {
		count++;
		if(count == speed){
			count = 0;
		}
	}
	if(context.canvas.style.visibility == "visible"){
		window.requestAnimationFrame(loop);
	}
}

clicked = function(event) {
	if(context.canvas.style.visibility == "visible"){
		context.canvas.style.visibility = "hidden";
	} else {
		context.canvas.style.visibility = "visible";
		window.requestAnimationFrame(loop);
	}
}