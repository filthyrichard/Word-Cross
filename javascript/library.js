function Library() {
}

Library.getHTTPRequest = function() {
	var xmlhttp = false,
		i = 0,
		XMLHttpFactories = [
			function () {return new XMLHttpRequest()},
			function () {return new ActiveXObject("Msxml2.XMLHTTP")},
			function () {return new ActiveXObject("Msxml3.XMLHTTP")},
			function () {return new ActiveXObject("Microsoft.XMLHTTP")}
		];

	for (var i = 0; i < XMLHttpFactories.length;i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	
	return xmlhttp;
};

Library.sendRequest = function(url, callback, postData) {
	var req = Library.getHTTPRequest(),
		method = (postData) ? "POST" : "GET";
	
	if (!req) {
		return;
	}

	req.open(method, url, true);
	req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	
	if (postData) {
		req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	}
	req.onreadystatechange = function () {
		if (req.readyState != 4) {
			return;
		}
		if (req.status != 200 && req.status != 304 && req.status != 0) {
			return;
		}
		if (callback) {
			callback(req);
		}
	}
	if (req.readyState == 4) {
		return;
	}

	req.send(postData);
};
