function Controller(canvas, game, drawer) {
    var me = this;
    this.canvas = canvas;
    this.game = game;
    this.drawer = drawer;
    this.handleMouseDown = function(e) {
        var x = e.clientX,
            y = e.clientY,
            shiftPressed = e.shiftKey === true,
            wordDirection = (shiftPressed) ? 1 : 0;
			
		if (me.game.state === me.game.states.playing) {

	        me.game.setDragPosition(x, y);
	        me.game.setWordDirection(wordDirection);

	        me.game.dragWord(me.game.nextWord);
	        me.canvas.addEventListener('mousemove', me.handleMouseMove, false);

	        me.drawer.draw();
		}
    };
    this.handleMouseUp = function(e) {
        var col = Math.floor(e.clientX / me.game.tile.height),
            row = Math.floor(e.clientY / me.game.tile.height),
            shiftPressed = e.shiftKey === true,
            wordDirection = (shiftPressed) ? 1 : 0,
			scoreForWord = 0;
			
		if (me.game.state === me.game.states.splash) {
			me.game.start();
	        me.drawer.draw();
			return;
		}
		
		if (me.game.state === me.game.states.gameOver) {
	        me.game.initialise();
	        me.drawer.draw();
			return;
		}
		

        me.game.setWordDirection(wordDirection);

        if (me.game.withinGrid(row, col) && 
            me.game.canPlaceWord(me.game.wordBeingDragged, me.game.wordDirection, row, col)) {
            scoreForWord = me.game.placeDraggedWord(row, col);
        }

        me.game.clearDragWord();
        me.game.setDragPosition(0, 0);
        me.canvas.removeEventListener('mousemove', me.handleMouseMove, false);
        me.drawer.draw();
    };

    this.handleMouseMove = function(e) {
        var col = Math.floor(e.clientX / me.game.tile.height),
            row = Math.floor(e.clientY / me.game.tile.height),
            shiftPressed = e.shiftKey === true,
            wordDirection = (shiftPressed) ? 1 : 0;
            
        me.game.setWordDirection(wordDirection);

        me.game.setDragPosition(e.clientX, e.clientY);
        me.drawer.draw();
    };
	
    this.initialise = function() {
        me.game.initialise();
        me.drawer.draw();

        me.canvas.addEventListener('mousedown', me.handleMouseDown, false);
        me.canvas.addEventListener('mouseup', me.handleMouseUp, false);
    };
}