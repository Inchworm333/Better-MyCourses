//Saves and restores session cookies so you are always logged in
//by Nicholas Valletta

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.command === 'start_no-login') {
		console.log(message.permissions.origins[0]);
		get_session(message.permissions.origins[0]);
	}
});

function get_session(website) { //get the session cookies for given website
	chrome.cookies.getAllCookieStores(function (stores) {
		console.log(stores);
	});
	chrome.cookies.getAll({domain: 'https://shibboleth.main.ad.rit.edu/*'}, function (cookies) {

		save_session(cookies);
	})
}

function save_session(cookies) { //saves the cookie to chrome storage //TODO decide on local or sync storage
	//Check if there are cookies
	console.log(cookies);
	console.log("made it");
	if (cookies.length > 0) {
		let webname = cookies[0].url;
		chrome.storage.local.set({key: webname, cookies: cookies}, function () {
			console.log("Cookies stored in cookie jar :" + cookies);
		})
	} else {
		console.error("Get session did not return any cookies! \n Is user logged in?")
	}
}

function restore_session(cookies) { //restores the cookies from chrome storage //TODO add what storage used
	let website = cookies[0].domain.toString();
	console.log("Restoring cookies from " + website);
	chrome.cookies.set(cookies, function (cookie) {
		if (cookie != null) {
			console.log("Cookies successfully restored")
		} else {
			console.error("Cookies were not able to be restored")
		}
	})
}

function main() {
	if (document.URL === 'https://shibboleth.main.ad.rit.edu/*') {
		chrome.cookies.getAll({domain: 'https://shibboleth.main.ad.rit.edu/*'},
			function (cookies) { if (!(cookies.length > 0)) {
				chrome.storage.local.get(['https://shibboleth.main.ad.rit.edu/*'],function (cookies) {
					restore_session(cookies);
				})
			} }
		)
	} else if (document.URL === 'https://*.duosecurity.com/*') {
		chrome.cookies.getAll({domain: 'https://*.duosecurity.com/*', session: true},
			function (cookies) { if (!(cookies.length > 0)) {
				chrome.storage.local.get(['https://*.duosecurity.com/*'],function (cookies) {
					restore_session(cookies);
				})
			} }
		)
	}
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.command === 'start_no-login') {
		chrome.webNavigation.onCompleted.addListener(function () {
			main();
		}, {url: [{urlPrefix: 'https://shibboleth.main.ad.rit.edu/*'}]});
	}
});