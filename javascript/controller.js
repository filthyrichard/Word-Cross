function Controller(canvas, game, drawer) {
	var me = this,
		displayHighScores;
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

			if (me.game.state === me.game.states.gameOver) {
				// send score and update high score
				HighScore.save(me.game.getState(), refreshHighScores);
			}
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

	this.getHelp = function(e) {
		me.game.enableHelp();
		me.drawer.draw();
	};

	this.dumpBoard = function(e) {
		var output = '[';
		for (i = 0; i < me.game.grid.width; i += 1) {
			output += '[';
			for (j = 0; j < me.game.grid.height; j += 1) {
				output += "'" + me.game.tileMap[i][j] + "', ";
			}
			output += '],';
		}	
		output += ']';
		console.log(output);
	}
	
	this.initialise = function() {
		var resourceLoader = new ResourceLoader(undefined, function () {
			me.game.initialise();
			me.drawer.draw();

			me.canvas.addEventListener('mousedown', me.handleMouseDown, false);
			me.canvas.addEventListener('mouseup', me.handleMouseUp, false);
			document.getElementById('help').addEventListener('mouseup', me.getHelp, false);
			document.getElementById('dump').addEventListener('mouseup', me.dumpBoard, false);
		});
		
		resourceLoader.addResource('images/splash.png', 'png', ResourceType.IMAGE);
		resourceLoader.addResource('letters/letters.png', 'png', ResourceType.IMAGE);
		resourceLoader.startPreloading();

		refreshHighScores();
	};

	refreshHighScores = function() {
		HighScore.getTop(10, displayHighScores);
	}

	displayHighScores = function(data) {
		var scores = JSON.parse(data.responseText),
			numScores = scores.length,
			i = 0,
			ol,
			li,
			highScoresElement;

		// create a list for the score
		ol = document.createElement("ol");
		for (i = 0; i < numScores; i += 1) {
			li = document.createElement("li");
			li.innerHTML = scores[i].user + " (" + scores[i].score + ")";
			ol.appendChild(li);
		}

		// remove the currently displayed high scores
		highScoresElement = document.getElementById("highScores");
		while (highScoresElement.childNodes.length > 0) {
			highScoresElement.removeChild(highScoresElement.firstChild);
		}

		document.getElementById("highScores").appendChild(ol);
	};
}
