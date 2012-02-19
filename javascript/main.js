window.onload = function () {
	var wordListURL = '/word_list_nine_characters_or_less.txt',
		wordListLoaded = function () {
			var canvas = document.getElementById('myCanvas'),
				game = new Game(wordList),
				drawer = new Drawer(canvas, game),
				controller = new Controller(canvas, game, drawer);
				controller.initialise();
		},
		wordList = new WordList(wordListURL, wordListLoaded);
};
