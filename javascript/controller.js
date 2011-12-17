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


            // tileMap[row] = (tileMap[row] === undefined) ? [] : tileMap[row];
            // 
            // if (tileMap[row][col] === 1) {
            //  tileMap[row][col] = 0;
            // }
            // else {
            //  tileMap[row][col] = 1;
            // }
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

        //if (me.game.withinGrid(row, col)) {
            me.game.setDragPosition(e.clientX, e.clientY);
            me.drawer.draw();
        //}
    };

    this.initialise = function() {
        me.game.initialise();
        me.drawer.draw();

        me.canvas.addEventListener('mousedown', me.handleMouseDown, false);
        me.canvas.addEventListener('mouseup', me.handleMouseUp, false);
    };
}

// Controller.prototype.initialise = function() {
//     this.game.initialise();
//  this.drawer.draw();
//  
//  this.canvas.addEventListener('mousedown', this.handleMouseDown, false);
//  this.canvas.addEventListener('mouseup', this.handleMouseUp, false);
// }

// Controller.prototype.handleMouseDown = function(e) {
//     var col = Math.floor(e.clientX / this.game.tile.height),
//         row = Math.floor(e.clientY / this.game.tile.height);
// 
//     this.game.setDragPosition(e.clientX, e.clientY);
// 
//     if (this.game.withinGrid(row, col)) {
// 
//         // if we click a letter then start dragging it
//         if (this.game.tileMap[row][col] !== '') {
//             this.game.dragWord("Style");
//             
//             //tileMap[row][col] = '';
//             this.canvas.addEventListener('mousemove', this.handleMouseMove, false);
//         }
// 
//         // tileMap[row] = (tileMap[row] === undefined) ? [] : tileMap[row];
//         // 
//         // if (tileMap[row][col] === 1) {
//         //  tileMap[row][col] = 0;
//         // }
//         // else {
//         //  tileMap[row][col] = 1;
//         // }
//         this.drawer.draw();
//     }
// }
//     
// Controller.prototype.handleMouseUp = function(e) {
//     this.game.clearDragWord();
//     this.game.setDragPosition(0, 0);
//     this.canvas.removeEventListener('mousemove', this.handleMouseMove, false);
//  this.drawer.draw();
// }
// 
// Controller.prototype.handleMouseMove = function(e) {
//  var col = Math.floor(e.clientX / this.game.tile.height),
//         row = Math.floor(e.clientY / this.game.tile.height);
// 
//     if (this.game.withinGrid(row, col)) {
//         this.game.setDragPosition(e.clientX, e.clientY);
//         this.drawer.draw();
//     }
// }