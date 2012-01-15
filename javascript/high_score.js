function HighScore() {
}

HighScore.save = function(state) {
	var url = "/submitGame?";
	url += "score=" + state.score;
	url += "&board=" + state.board;
	url += "&width=" + state.width;
	url += "&height=" + state.height;

	Library.sendRequest(url);
}

HighScore.getTop = function(number, callback) {
	var url = "/getHighScores?number=" + number;
	Library.sendRequest(url, callback);
}