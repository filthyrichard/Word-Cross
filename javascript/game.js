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
	this.startWord = wordList.getWord();
	this.lettersBeingDragged = [];
	this.currentDragPosition = {x : 0, y : 0};
	this.wordDirection = this.wordDirections.horizontal;
	this.nextWord = '';
	this.wordsAdded = [];
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
    var wordLength = word.length,
        i = 0;

    this.lettersBeingDragged = this.getWordAsArray(word);
};

Game.prototype.clearDragWord = function() {
    this.lettersBeingDragged = [];
};

Game.prototype.setDragPosition = function(x, y) {
    this.currentDragPosition.x = x;
    this.currentDragPosition.y = y;
};

Game.prototype.canPlaceDraggedWord = function(row, col) {
    var i = 0,
        charNum = 0,
        okToPlace = false,
        potentialWords = [],
        potentialWordsLength = 0;

    // make sure all the tiles are blank or the same letter as the one being placed
    if (this.wordDirection === this.wordDirections.vertical) {
        for (i = row, charNum = 0; i < row + this.lettersBeingDragged.length; i += 1, charNum += 1) {
            okToPlace = (this.tileMap[i][col] === '' || 
                        (this.tileMap[i][col] !== '' && this.tileMap[i][col] === this.lettersBeingDragged[charNum]));
            if (!okToPlace) {
                return false;
            }
        }
    }
    else {
        for (i = col, charNum = 0; i < col + this.lettersBeingDragged.length; i += 1, charNum += 1) {
            okToPlace = (this.tileMap[row][i] === '' || 
                        (this.tileMap[row][i] !== '' && this.tileMap[row][i] === this.lettersBeingDragged[charNum]));
            if (!okToPlace) {
                return false;
            }
        }
    }

    potentialWords = this.getWordsCreatedAfterDraggedWordPlacement(row, col);

    for (i = 0; i < potentialWordsLength; i += 1) {
        if (!this.wordList.isWord(potentialWords[i])) {
            return false;
        }
    }

    return true;
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

Game.prototype.placeDraggedWord = function(row, col) {
    var i = 0,
        charNum = 0;

    if (this.wordDirection === this.wordDirections.vertical) {
        for (i = row, charNum = 0; i < row + this.lettersBeingDragged.length; i += 1, charNum += 1) {
            this.tileMap[i][col] = this.lettersBeingDragged[charNum];
        }
    }
    else {
        for (i = col, charNum = 0; i < col + this.lettersBeingDragged.length; i += 1, charNum += 1) {
            this.tileMap[row][i] = this.lettersBeingDragged[charNum];
        }
    }

    this.wordsAdded.push(this.lettersBeingDragged.join(''));
    this.nextWord = this.wordList.getWord();
};

/**
* Get the words that are created after the dragged word has been placed
* in a particular position
*/
Game.prototype.getWordsCreatedAfterDraggedWordPlacement = function(row, col) {
    var wordsCreated = [],
        i = 0,
        j = 0,
        charNum = 0,
        word = '';

    if (this.wordDirection === this.wordDirections.vertical) {
        // loop through each letter of the word
        for (i = row, charNum = 0; i < row + this.lettersBeingDragged.length; i += 1, charNum += 1) {

            // find the start of the word created horizontally
            word = this.lettersBeingDragged[charNum];
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
        word = this.lettersBeingDragged.join('');
        j = row - 1;
        while (j >= 0 && this.tileMap[j][col] !== '') {
            word = this.tileMap[j][col] + word;
            j -= 1;
        }
    
        // find the end of the word created vertically
        j = row + this.lettersBeingDragged.length;
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
        for (i = col, charNum = 0; i < col + this.lettersBeingDragged.length; i += 1, charNum += 1) {
        
            // find the start of the word created vertically
            word = this.lettersBeingDragged[charNum];
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
        word = this.lettersBeingDragged.join('');
        j = col - 1;
        while (j >= 0 && this.tileMap[row][j] !== '') {
            word = this.tileMap[row][j] + word;
            j -= 1;
        }
    
        // find the end of the word created horizontally
        j = col + this.lettersBeingDragged.length;
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