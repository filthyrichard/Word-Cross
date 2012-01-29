function WordList(wordListURL, callbackWhenLoaded) {
	var self = this;
	this.words = [];
	this.callbackWhenLoaded = callbackWhenLoaded;

	var wordsLoaded = function(response) {
		self.words = response.responseText.split(/\r\n|\r|\n/);
		self.callbackWhenLoaded();
	}

	Library.sendRequest(wordListURL, wordsLoaded, false);
}

WordList.prototype.getWord = function() {
	var rand = Math.floor(Math.random() * this.words.length);
	return this.words[rand];
};

WordList.prototype.isWord = function(word) {
	var numWords = this.words.length,
		i = 0;

	for (i = 0; i < numWords; i += 1) {
		if (this.words[i] === word) {
			return true;
		}
	}

	return false;
};
