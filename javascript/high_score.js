function HighScore() {
}

HighScore.save = function(state, callback) {
	var url = "/submitGame?";
	url += "score=" + state.score;
	url += "&board=" + state.board;
	url += "&width=" + state.width;
	url += "&height=" + state.height;

	Library.sendRequest(url, callback);
}

HighScore.getTop = function(number, callback) {
	var url = "/getHighScores?number=" + number;
	Library.sendRequest(url, callback);
}
