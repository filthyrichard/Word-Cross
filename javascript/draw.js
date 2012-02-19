function Drawer(canvas, game) {
	var spritesheet = "letters/letters.png";
	this.game = game;
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.letterSprites = new Sprite(spritesheet, this.game.tile.width, this.game.tile.height, 0, 0, 0, 0);
}

Drawer.prototype.getLetterPosition = function(letter) {
	var letters = [],
		letterCode = 0;
	letter = letter.toUpperCase(letter);
	letterCode = letter.charCodeAt();
	return letterCode - 65;
}

Drawer.prototype.draw = function() {
	var row = 0,
		col = 0,
		xOffset = 360,
		yOffset = 100,
		tilePositionX = 0,
		tilePositionY = 0,
		height = this.game.grid.height,
		width = this.game.grid.width,
		draggedWordLength = this.game.wordBeingDragged.length,
		nextWordLength = this.game.nextWord.length,
		i = 0,
		image = new Image();
		
	switch (this.game.state) {
		case this.game.states.splash:
			document.getElementsByTagName("body")[0].id = 'splashpage';
			document.getElementById("help").style.display = "none";
			image.src = "images/splash.png";
			this.context.drawImage(image, 0, 0);
			break;
		case this.game.states.gameOver:
			document.getElementsByTagName("body")[0].id = '';
			document.getElementById("help").style.display = "none";
			image.src = "images/gameover.png";
			this.context.drawImage(image, 0, 0);
			this.context.fillText("Game Over. Score: " + this.game.score, 10, 10);
			break;
		case this.game.states.playing:
			document.getElementsByTagName("body")[0].id = 'gamepage';
			document.getElementById("help").style.display = "";
			this.context.fillStyle = "rgba(255, 255, 255, 1)";
			this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);
			image.src = "images/board.png";
			this.context.drawImage(image, 0, 0);

			// draw the grid
			for (row = 0; row < height; row += 1) {
				for (col = 0; col < width; col += 1) {
					tilePositionX = this.game.tile.width * col + xOffset;
					tilePositionY = this.game.tile.height * row + yOffset;

					//this.context.strokeStyle = '#CCCCCC';
					//this.context.strokeRect(tilePositionX, tilePositionY, this.game.tile.width, this.game.tile.height);

					if (this.game.tileMap[row] !== null && this.game.tileMap[row][col] !== null) {
						if (this.game.tileMap[row][col] !== '') {
							this.letterSprites.setOffset(0, this.getLetterPosition(this.game.tileMap[row][col]) * this.game.tile.height);
							this.letterSprites.setPosition(tilePositionX, tilePositionY);
							this.letterSprites.draw(this.context);
						} 
					}
				}
			}

			// draw the word currently being dragged
			if (draggedWordLength > 0) {
				for (i = 0; i < draggedWordLength; i += 1) {
					//if (this.game.wordDirection === this.game.wordDirections.vertical) {
					//	tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2) + xOffset;
					//	tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2) + (i * this.game.tile.height) + yOffset;
					//}
					//else {
					//	tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2) + (i * this.game.tile.width) + xOffset;
					//	tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2) + yOffset;
					//}
					if (this.game.wordDirection === this.game.wordDirections.vertical) {
						tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2) + 5;
						tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2) + (i * this.game.tile.height);
					}
					else {
						tilePositionX = this.game.currentDragPosition.x + (i * this.game.tile.width) - (this.game.tile.width / 2);
						tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height - 5);
					}

			
					this.letterSprites.setOffset(0, this.getLetterPosition(this.game.wordBeingDragged[i]) * this.game.tile.height);
					this.letterSprites.setPosition(tilePositionX, tilePositionY);
					this.letterSprites.draw(this.context);
				}
			}
	
			// draw the next word
			for (i = 0; i < nextWordLength; i += 1) {
				tilePositionX = 30 + (i * this.game.tile.width);
				tilePositionY = (height * this.game.tile.height) + this.game.tile.height + 15;
				this.letterSprites.setOffset(0, this.getLetterPosition(this.game.nextWord.charAt(i)) * this.game.tile.height);
				this.letterSprites.setPosition(tilePositionX, tilePositionY);
				this.letterSprites.draw(this.context);
			}

			// draw the help
			if (this.game.useHelp === true) {
				tilePositionX = this.game.help.col * this.game.tile.width + xOffset;
				tilePositionY = this.game.help.row * this.game.tile.height + yOffset;
				if (this.game.help.direction === this.game.wordDirections.horizontal) {
					rectWidth = (nextWordLength) * this.game.tile.width;
					rectHeight = this.game.tile.height; 
				}
				else {
					rectHeight = (nextWordLength) * this.game.tile.height;
					rectWidth = this.game.tile.width; 
				}
				this.context.strokeStyle = 'red';
				this.context.strokeRect(tilePositionX, tilePositionY, rectWidth, rectHeight);
			}


			// update the score
			window.document.getElementById('score').innerHTML = this.game.score;
		
			break;
	}
};
