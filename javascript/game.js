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
	this.letterScores = {A : 1, B : 3, C : 3, D : 2, E : 1, F : 4, G : 2, H : 4, I : 1, J : 8, K : 5, L : 1, M : 2, N : 1, O : 1, P : 3, Q : 10, R : 1, S : 1, T : 1, U : 1, V : 4, W : 4, X : 8, Y : 8, Z : 10};
	this.startWord = wordList.getWord();
	this.wordBeingDragged = '';
	this.currentDragPosition = {x : 0, y : 0};
	this.wordDirection = this.wordDirections.horizontal;
	this.nextWord = '';
	this.wordsAdded = [];
	this.score = 0;
}

Game.prototype.initialise = function() {
    var i = 0, 
		j = 0,
		startX = Math.floor(this.grid.width / 2) - Math.floor(this.startWord.length / 2),
		startY = Math.floor(this.grid.height / 2),
		charNum = 0;

	for (i = 0; i < this.grid.width; i += 1) {
		this.tileMap[i] = [];
		for (j = 0; j < this.grid.height; j += 1) {
			this.tileMap[i][j] = '';
		}
	}

	// place the first word
	for (i = startX, charNum = 0; i < startX + this.startWord.length; i += 1, charNum += 1) {
        this.tileMap[startY][i] = this.startWord.charAt(charNum);
	}

	this.score = 0;
	this.nextWord = this.wordList.getWord();
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
}

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

Game.prototype.placeDraggedWord = function(row, col) {
    var i = 0,
        charNum = 0
		scoreForWord = 0,
		multiplier = 1;

    if (this.wordDirection === this.wordDirections.vertical) {
        for (i = row, charNum = 0; i < row + this.wordBeingDragged.length; i += 1, charNum += 1) {
			if (this.tileMap[i][col] !== '') {
				multiplier += this.letterScores[this.tileMap[i][col]];
			}

            this.tileMap[i][col] = this.wordBeingDragged[charNum];
			scoreForWord += this.letterScores[this.wordBeingDragged[charNum]];
        }
    }
    else {
        for (i = col, charNum = 0; i < col + this.wordBeingDragged.length; i += 1, charNum += 1) {
			if (this.tileMap[row][i] !== '') {
				multiplier += this.letterScores[this.tileMap[row][i]];
			}

            this.tileMap[row][i] = this.wordBeingDragged[charNum];
			scoreForWord += this.letterScores[this.wordBeingDragged[charNum]];
        }
    }

	scoreForWord *= multiplier;
	this.score += scoreForWord;

    this.wordsAdded.push(this.wordBeingDragged);
    this.nextWord = this.wordList.getWord();

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
            if (word.length > 1) {
                wordsCreated.push(word);
            }
        }
        
        // find the start of the word created vertically
        j = row - 1;
        while (j >= 0 && this.tileMap[j][col] !== '') {
            word = this.tileMap[j][col] + wordToPlace;
            j -= 1;
        }
    
        // find the end of the word created vertically
        j = row + this.wordBeingDragged.length;
        while (j < this.grid.width && this.tileMap[j][col] !== '') {
            word = word + this.tileMap[j][col];
            j += 1;
        }
    
        // if the vertical word length is > 1 then add to the found words
        if (word.length > 1) {
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
            if (word.length > 1) {
                wordsCreated.push(word);
            }
        }

        // find the start of the word created horizontally
        j = col - 1;
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
        if (word.length > 1) {
            wordsCreated.push(word);
        }
    }
        
    return wordsCreated;
};