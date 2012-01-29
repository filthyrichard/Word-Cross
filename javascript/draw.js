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
		tilePositionX = 0,
		tilePositionY = 0,
		height = this.game.grid.height,
		width = this.game.grid.width,
		draggedWordLength = this.game.wordBeingDragged.length,
		nextWordLength = this.game.nextWord.length,
		i = 0,
		splashImage = new Image();
		
	switch (this.game.state) {
		case this.game.states.splash:
			splashImage.src = "images/splash.png";
			this.context.drawImage(splashImage, 0, 0);
			break;
		case this.game.states.gameOver:
			splashImage.src = "images/splash.png";
			this.context.drawImage(splashImage, 0, 0);
			this.context.fillText("Game Over. Score: " + this.game.score, 10, 10);
			break;
		case this.game.states.playing:
			this.context.fillStyle = '#FFFFFF';
			this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);

			// draw the grid
			for (row = 0; row < height; row += 1) {
				for (col = 0; col < width; col += 1) {
					tilePositionX = this.game.tile.width * col;
					tilePositionY = this.game.tile.height * row;

					this.context.strokeStyle = '#CCCCCC';
					this.context.strokeRect(tilePositionX, tilePositionY, this.game.tile.width, this.game.tile.height);

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
					if (this.game.wordDirection === this.game.wordDirections.vertical) {
						tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2);
						tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2) + (i * this.game.tile.height);
					}
					else {
						tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2) + (i * this.game.tile.width);
						tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2);
					}
			
					this.letterSprites.setOffset(0, this.getLetterPosition(this.game.wordBeingDragged[i]) * this.game.tile.height);
					this.letterSprites.setPosition(tilePositionX, tilePositionY);
					this.letterSprites.draw(this.context);
				}
			}
	
			// draw the next word
			for (i = 0; i < nextWordLength; i += 1) {
				tilePositionX = 10 + (i * this.game.tile.width);
				tilePositionY = (height * this.game.tile.height) + this.game.tile.height;
				this.letterSprites.setOffset(0, this.getLetterPosition(this.game.nextWord.charAt(i)) * this.game.tile.height);
				this.letterSprites.setPosition(tilePositionX, tilePositionY);
				this.letterSprites.draw(this.context);
			}
	
			// update the score
			window.document.getElementById('score').innerHTML = this.game.score;
		
			break;
	}
};
