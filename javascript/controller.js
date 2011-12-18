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

        me.game.setDragPosition(x, y);
        me.game.setWordDirection(wordDirection);

        me.game.dragWord(me.game.nextWord);
        me.canvas.addEventListener('mousemove', me.handleMouseMove, false);

        me.drawer.draw();
    };
    this.handleMouseUp = function(e) {
        var col = Math.floor(e.clientX / me.game.tile.height),
            row = Math.floor(e.clientY / me.game.tile.height),
            shiftPressed = e.shiftKey === true,
            wordDirection = (shiftPressed) ? 1 : 0,
			scoreForWord = 0;

        me.game.setWordDirection(wordDirection);

        if (me.game.withinGrid(row, col) && 
            me.game.canPlaceDraggedWord(row, col)) {
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