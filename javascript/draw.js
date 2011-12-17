function Drawer(canvas, game) {
    this.game = game;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
}

Drawer.prototype.draw = function() {
    var row = 0,
		col = 0,
		tilePositionX = 0,
		tilePositionY = 0,
		height = this.game.grid.height,
		width = this.game.grid.width,
		letter = new Image(),
		draggedWordLength = this.game.lettersBeingDragged.length,
		nextWordLength = this.game.nextWord.length,
		i = 0;

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
					letter = new Image();
					letter.src = 'letters/' + this.game.tileMap[row][col] + '.png';
					this.context.drawImage(letter, tilePositionX, tilePositionY, 32, 32);
				} 
			}
		}
	}

    // draw the word currently being dragged
    if (draggedWordLength > 0) {
        for (i = 0; i < draggedWordLength; i += 1) {
            letter.src = 'letters/' + this.game.lettersBeingDragged[i] + '.png';
            if (this.game.wordDirection === this.game.wordDirections.vertical) {
                tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2);
                tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2) + (i * this.game.tile.height);
            }
            else {
                tilePositionX = this.game.currentDragPosition.x - (this.game.tile.width / 2) + (i * this.game.tile.width);
                tilePositionY = this.game.currentDragPosition.y - (this.game.tile.height / 2);
            }
            
            this.context.drawImage(letter, tilePositionX, tilePositionY, 32, 32);
        }
    }
    
    // draw the next word
    for (i = 0; i < nextWordLength; i += 1) {
        letter.src = 'letters/' + this.game.nextWord.charAt(i) + '.png';
        tilePositionX = 10 + (i * this.game.tile.width);
        tilePositionY = (height * this.game.tile.height) + this.game.tile.height;
        this.context.drawImage(letter, tilePositionX, tilePositionY, 32, 32);
    }
};