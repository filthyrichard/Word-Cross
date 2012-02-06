function Game(wordList) {
    this.wordList = wordList;
    this.wordDirections =  {
            horizontal : 0,
            vertical : 1
        };
    this.tileMap = [];
    this.tile = {
			width: 32,
			height: 32
		};
	this.grid = {
			width: 20,
			height: 20
		};
	this.states = {
			splash: 0,
			playing: 1,
			gameOver: 2
		};
	this.useHelp = false;
	this.help = {
			row : -1,
			col : -1,
			direction : -1
		};
	this.letterScores = {A : 1, B : 3, C : 3, D : 2, E : 1, F : 4, G : 2, H : 4, I : 1, J : 8, K : 5, L : 1, M : 2, N : 1, O : 1, P : 3, Q : 10, R : 1, S : 1, T : 1, U : 1, V : 4, W : 4, X : 8, Y : 8, Z : 10};
	this.startWord = wordList.getWord();
	this.wordBeingDragged = '';
	this.currentDragPosition = {x : 0, y : 0};
	this.wordDirection = this.wordDirections.horizontal;
	this.nextWord = '';
	this.wordsAdded = [];
	this.score = 0;
	this.state = this.states.splash;
}

Game.prototype.initialise = function() {
    var i = 0, 
		j = 0,
		startX = Math.floor(this.grid.width / 2) - Math.floor(this.startWord.length / 2),
		startY = Math.floor(this.grid.height / 2),
		charNum = 0;

	this.state = this.states.splash;
	this.startWord = this.wordList.getWord();
	this.score = 0;
	this.wordsAdded = [];
	this.wordBeingDragged = '';
	this.nextWord = this.wordList.getWord();
	this.wordsAdded.push(this.startWord);
	this.score = this.getScoreForWord(this.startWord);

	for (i = 0; i < this.grid.width; i += 1) {
		this.tileMap[i] = [];
		for (j = 0; j < this.grid.height; j += 1) {
			this.tileMap[i][j] = '';
		}
	}

	//this.nextWord = "RAVING";
	//this.nextWord = "ACE";
	//this.tileMap = [['B', 'U', 'S', 'B', 'O', 'Y', 'S', '', '', '', '', '', 'V', 'A', 'S', 'C', 'U', 'L', 'U', 'M', ],['O', '', 'U', '', '', '', 'U', '', '', '', '', '', '', '', '', '', '', '', '', '', ],['G', '', 'P', '', 'L', '', 'B', '', '', '', '', '', 'V', 'A', 'R', 'A', 'C', 'T', 'O', 'R', ],['O', '', 'E', '', 'O', '', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ],['N', '', 'R', '', 'L', '', 'I', '', 'C', 'H', 'A', 'N', 'D', 'L', 'E', 'R', '', 'L', '', 'P', ],['G', '', 'S', '', 'L', '', 'T', '', '', '', 'D', '', '', '', '', 'E', '', 'I', '', 'A', ],['', '', 'E', '', 'E', '', 'L', '', '', '', 'V', '', '', '', '', 'S', '', 'T', '', 'V', ],['', '', 'X', '', 'R', '', 'E', '', '', '', 'I', '', '', '', '', 'H', '', 'E', '', 'E', ],['A', '', '', '', '', '', '', '', 'P', '', 'S', '', '', '', '', 'A', '', 'R', '', 'S', ],['T', '', '', '', '', '', '', '', 'O', '', 'O', '', '', '', '', 'P', '', 'A', '', '', ],['T', '', '', '', '', '', 'D', 'A', 'M', 'O', 'D', 'A', 'R', 'E', '', 'E', '', 'T', '', '', ],['A', '', '', '', '', '', '', '', 'E', '', 'Y', '', '', '', '', 'S', '', 'I', '', '', ],['C', '', '', '', '', 'H', '', '', 'L', '', '', '', '', '', '', '', '', '', '', 'H', ],['H', '', 'S', '', '', 'I', '', '', 'O', 'X', 'Y', 'G', 'E', 'N', 'S', '', '', '', '', 'I', ],['', '', 'U', '', '', 'N', '', '', '', '', '', '', '', '', '', '', '', '', '', 'G', ],['', '', 'B', '', '', 'D', '', '', '', 'P', 'A', 'R', 'O', 'T', 'O', 'I', 'D', '', '', 'H', ],['', '', 'A', '', '', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', 'L', ],['', '', 'D', '', '', 'R', '', '', '', '', '', 'S', 'W', 'I', 'N', 'D', 'L', 'E', '', 'A', ],['', '', 'A', '', '', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', 'N', ],['T', 'H', 'R', 'E', 'A', 'D', 'E', 'R', '', '', '', '', 'P', 'U', 'M', 'M', 'E', 'L', 'E', 'D', ],];

	// place the first word
	for (i = startX, charNum = 0; i < startX + this.startWord.length; i += 1, charNum += 1) {
        this.tileMap[startY][i] = this.startWord.charAt(charNum);
	}
};

Game.prototype.start = function() {
	this.state = this.states.playing;
};

Game.prototype.getWordAsArray = function(word) {
    var array = [],
        i = 0,
        numLetters = word.length;

    for (i = 0; i < numLetters; i += 1) {
        array.push(word.charAt(i));
	}
	
	return array;
};

Game.prototype.withinGrid = function(row, col) {
    if (row >= 0 && col >= 0 && 
        row < this.grid.width && col < this.grid.height) {
        return true;
    }
    
    return false;
};

Game.prototype.setWordDirection = function(direction) {

    if (direction === this.wordDirections.horizontal || 
        direction === this.wordDirections.vertical) {
        this.wordDirection = direction;
    }
};

Game.prototype.dragWord = function(word) {
    this.wordBeingDragged = word;
};

Game.prototype.clearDragWord = function() {
    this.wordBeingDragged = '';
};

Game.prototype.setDragPosition = function(x, y) {
    this.currentDragPosition.x = x;
    this.currentDragPosition.y = y;
};

Game.prototype.enableHelp = function() {
	this.useHelp = true;
	this.help = this.getFirstLocationNextWordCanBePlaced();
};

Game.prototype.canPlaceWord = function(word, direction, row, col) {
    var i = 0,
        charNum = 0,
        okToPlace = false,
        potentialWords = [],
        potentialWordsLength = 0;

    // make sure all the tiles are blank or the same letter as the one being placed
    if (direction === this.wordDirections.vertical) {
        for (i = row, charNum = 0; i < row + word.length; i += 1, charNum += 1) {
            okToPlace = (i < this.grid.height &&
						(this.tileMap[i][col] === '' || 
                        (this.tileMap[i][col] !== '' && this.tileMap[i][col] === word[charNum])));
            if (!okToPlace) {
                return false;
            }
        }
    }
    else {
        for (i = col, charNum = 0; i < col + word.length; i += 1, charNum += 1) {
            okToPlace = (i < this.grid.width && 
						(this.tileMap[row][i] === '' || 
                        (this.tileMap[row][i] !== '' && this.tileMap[row][i] === word[charNum])));
            if (!okToPlace) {
                return false;
            }
        }
    }
	
    potentialWords = this.getWordsCreatedAfterWordPlacement(word, direction, row, col);
	potentialWordsLength = potentialWords.length;

    for (i = 0; i < potentialWordsLength; i += 1) {
        if (!this.wordList.isWord(potentialWords[i])) {
            return false;
        }
    }

    return true;
};

/* check for game over by attempting to place the next word everywhere on the board.
*  If it can be placed then it's not game over
*/
Game.prototype.isOver = function() {
	var row = 0,
		col = 0,
		numRows = this.grid.height,
		numCols = this.grid.width;
		
	for (row = 0; row < numRows; row += 1) {
		for (col = 0; col < numCols; col += 1) {
			if (this.canPlaceWord(this.nextWord, this.wordDirections.vertical, row, col)) {
				return false;
			}
			if (this.canPlaceWord(this.nextWord, this.wordDirections.horizontal, row, col)) {
				return false;
			}
		}
	}

	return true;
};

Game.prototype.getFirstLocationNextWordCanBePlaced = function() {
	var row = 0,
		col = 0,
		numRows = this.grid.height,
		numCols = this.grid.width;
		
	for (row = 0; row < numRows; row += 1) {
		for (col = 0; col < numCols; col += 1) {
			if (this.canPlaceWord(this.nextWord, this.wordDirections.vertical, row, col)) {
				return {row: row, col: col, direction: this.wordDirections.vertical};
			}
			if (this.canPlaceWord(this.nextWord, this.wordDirections.horizontal, row, col)) {
				return {row: row, col: col, direction: this.wordDirections.horizontal};
			}
		}
	}
};

Game.prototype.wordHasAlreadyBeenPlaced = function(word) {
    var i = 0,
        numWords = this.wordsAdded.length;
		
    for (i = 0; i < numWords; i += 1) {
        if (word === this.wordsAdded[i]) {
            return true;
        }
    }

    return false;
};

Game.prototype.getScoreForWord = function(word) {
	var i = 0,
		score = 0,
		wordLength = word.length;
		
	for (i = 0; i < wordLength; i += 1) {
		score += this.letterScores[word[i]];
	}
	
	return score;
};

Game.prototype.placeDraggedWord = function(row, col) {
    var i = 0,
        charNum = 0,
		scoreForWord = 0,
		multiplier = 1, 
		wordsCreated = [],
		max = 0;

	wordsCreated = this.getWordsCreatedAfterWordPlacement(this.wordBeingDragged, this.wordDirection, row, col);
	max = wordsCreated.length;

	for (i = 0; i < max; i += 1) {
		scoreForWord += this.getScoreForWord(wordsCreated[i]);
	}

    if (this.wordDirection === this.wordDirections.vertical) {
        for (i = row, charNum = 0; i < row + this.wordBeingDragged.length; i += 1, charNum += 1) {
			if (this.tileMap[i][col] !== '') {
				multiplier += this.letterScores[this.tileMap[i][col]];
			}

            this.tileMap[i][col] = this.wordBeingDragged[charNum];
        }
    }
    else {
        for (i = col, charNum = 0; i < col + this.wordBeingDragged.length; i += 1, charNum += 1) {
			if (this.tileMap[row][i] !== '') {
				multiplier += this.letterScores[this.tileMap[row][i]];
			}

            this.tileMap[row][i] = this.wordBeingDragged[charNum];
        }
    }

	scoreForWord = scoreForWord + (this.getScoreForWord(this.wordBeingDragged) * multiplier);

	if (this.useHelp === false) {
		this.score += scoreForWord;
	}

    this.wordsAdded.push(this.wordBeingDragged);
    this.nextWord = this.wordList.getWord();
	while (this.wordHasAlreadyBeenPlaced(this.nextWord)) {
    	this.nextWord = this.wordList.getWord();
	}
	this.useHelp = false;
	
	if (this.isOver()) {
		this.state = this.states.gameOver;
	}

	return scoreForWord;
};

/**
* Get the words that are created after the dragged word has been placed
* in a particular position
*/
Game.prototype.getWordsCreatedAfterWordPlacement = function(wordToPlace, direction, row, col) {
    var wordsCreated = [],
        i = 0,
        j = 0,
        charNum = 0,
        word = '';

    if (direction === this.wordDirections.vertical) {
        // loop through each letter of the word
        for (i = row, charNum = 0; i < row + wordToPlace.length; i += 1, charNum += 1) {

            // find the start of the word created horizontally
            word = wordToPlace[charNum];
            j = col - 1;
            while (j >= 0 && this.tileMap[i][j] !== '') {
                word = this.tileMap[i][j] + word;
                j -= 1;
            }
            
            // find the end of the word created horizontally
            j = col + 1;
            while (j < this.grid.width && this.tileMap[i][j] !== '') {
                word = word + this.tileMap[i][j];
                j += 1;
            }

            // if the horizontal word length is > 1 then add to the found words        
            if (word.length > 1 && !this.wordHasAlreadyBeenPlaced(word)) {
                wordsCreated.push(word);
            }
        }
        
        // find the start of the word created vertically
        j = row - 1;
		word = wordToPlace;
        while (j >= 0 && this.tileMap[j][col] !== '') {
            word = this.tileMap[j][col] + word;
            j -= 1;
        }
    
        // find the end of the word created vertically
        j = row + wordToPlace.length;
        while (j < this.grid.height && this.tileMap[j][col] !== '') {
            word = word + this.tileMap[j][col];
            j += 1;
        }
    
        // if the vertical word length is > 1 then add to the found words
        if (word !== wordToPlace && word.length > 1 && !this.wordHasAlreadyBeenPlaced(word)) {
            wordsCreated.push(word);
        }
    }
    else {
        // loop through each letter of the word
        for (i = col, charNum = 0; i < col + wordToPlace.length; i += 1, charNum += 1) {
        
            // find the start of the word created vertically
            word = wordToPlace[charNum];
            j = row - 1;
            while (j >= 0 && this.tileMap[j][i] !== '') {
                word = this.tileMap[j][i] + word;
                j -= 1;
            }

            // find the end of the word created vertically
            j = row + 1;
            while (j < this.grid.height && this.tileMap[j][i] !== '') {
                word = word + this.tileMap[j][i];
                j += 1;
            }

            // if the vertical word length is > 1 then add to the found words
            if (word.length > 1 && !this.wordHasAlreadyBeenPlaced(word)) {
                wordsCreated.push(word);
            }
        }

        // find the start of the word created horizontally
        j = col - 1;
		word = wordToPlace;
        while (j >= 0 && this.tileMap[row][j] !== '') {
            word = this.tileMap[row][j] + word;
            j -= 1;
        }

        // find the end of the word created horizontally
        j = col + wordToPlace.length;
        while (j < this.grid.width && this.tileMap[row][j] !== '') {
            word = word + this.tileMap[row][j];
            j += 1;
        }

        // if the horizontal word length is > 1 then add to the found words        
        if (word !== wordToPlace && word.length > 1 && !this.wordHasAlreadyBeenPlaced(word)) {
            wordsCreated.push(word);
        }
    }

    return wordsCreated;
};

/**
* Return an object that contains the state for the game, including:
* - score
* - board as a string
* - board height
* - board width
*/
Game.prototype.getState = function() {
	var state = {},
		i = 0,
		j = 0;

	state.score = this.score;
	state.width = this.grid.width;
	state.height = this.grid.height;
	state.board = "";

	for (i = 0; i < this.grid.height; i += 1) {
		for (j = 0; j < this.grid.width; j += 1) {
			if (this.tileMap[i][j] === "") {
				state.board += " ";
			}
			else {
				state.board += this.tileMap[i][j];
			}
		}
	}

	return state;
};
