//Saves offline codes and auto fills them in when you are trying to login.
//by Nicholas Valletta

let duo_url = 'https://start.rit.edu/Shibboleth.sso/Login?authnContextClassRef=' +
	'http://rit.edu/ac/classes/mfa&target=https://start.rit.edu/Duo/createOfflineCodes';

let codes = {'data': [], 'number': 0};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.command === 'start_no-login') {
		main();
	}
});


/*
Clicks cancel button for push, clicks remember me for 24 hours and inputs passcode
*/
function login() {
	login_overlay();
	document.getElementsByClassName('btn-cancel')[0].click();
	document.querySelector("#login-form input[type=checkbox]").checked = true;
	document.querySelector("input.passcode-input").value = check_passcode(codes.number !== 0);
}

/*
 An overlay telling you to wait while we try to log you in.
*/
function login_overlay() {
	document.querySelector(".base-wrapper").setAttribute("style", "filter:blur(5px); z-index:-100;");
	let wait_here = document.createElement("div");
	wait_here.innerHTML = "<h1>Please Wait</h1> <p> Better-MyCourses is trying to sign you in.</p>";
	document.querySelector("body").insertBefore(wait_here, document.querySelector("body").childNodes[0]);
}

/*
Collects passcodes from create offline codes link (@duo_url)
*/
function collect_passcodes() {
	codes.number = codes.data.length;
	let table_elements = Array.from(document.getElementsByClassName('offlineCodeTable')[0]
		.getElementsByTagName('td')); //get offline code table
	for (let i = 0; i < table_elements.length; i++) { //to remove useless checkbox
		let code = table_elements[i].innerText.replace('☐ ', '');
		code.replace('Use this code to generate new codes: ', '');
		codes.data.push(code);
	}
	let last_code = codes.data.pop();
	codes.data.push(last_code.replace(/\D/g, '')); //to remove 'Use this code to generate new codes: '
	chrome.storage.local.set({Codes: codes}, function () {
		console.log("Added codes: " + codes.toLocaleString())
	})
}


function check_passcode(exists) {
	if (exists) { //pass-codes already exist
		let passcodes = chrome.storage.local.get('Codes', function (object) {
			console.log("Getting passcodes " +
				"for sign-in");
			return object;
		});
		if (passcodes.number === 1) { //only have one passcode left, use it to get new passcodes
			console.log("Collecting new passcodes");
			chrome.tabs.create({url: duo_url});
			collect_passcodes();
			passcodes = chrome.storage.local.get('Codes', function (object) {
				console.log("Getting passcodes " +
					"for sign-in");
				return object;
			}); //Update passcode list
		}
		// chrome.storage.local.set({Codes:codes}) //TODO need to save updated codes

	} else { // no pass-codes exist, user needs to login
		chrome.tabs.create({url: duo_url});
		alert("No offline codes found. Please login to generate them.")
	}
	//if()
}


function main() {
	if (document.URL === 'https://api-*.duosecurity.com/*') {
		login();
	}
}
