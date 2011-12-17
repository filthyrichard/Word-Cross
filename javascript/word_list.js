function WordList() {
    this.words = [];
    this.words.push("CAT");
    this.words.push("SLOT");
    this.words.push("BONKERS");
    this.words.push("OMEGA");
    this.words.push("TRUFFLE");
    this.words.push("LITTLE");
    this.words.push("ELATED");
    this.words.push("MARTIAN");
    this.words.push("DEVIL");
    this.words.push("CONTAIN");
    this.words.push("DEVICES");
    this.words.push("FOUR");
    this.words.push("PREMIERSHIP");
    this.words.push("CUP");
    this.words.push("TURNSTILE");
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