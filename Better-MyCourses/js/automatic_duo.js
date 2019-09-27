//Saves offline codes and auto fills them in when you are trying to login.
//by Nicholas Valletta

console.log("exicuted");

//Variables -----------------------------------------
let duo_url = 'https://start.rit.edu/Shibboleth.sso/Login?authnContextClassRef=' +
	'http://rit.edu/ac/classes/mfa&target=https://start.rit.edu/Duo/createOfflineCodes';

codes = {'codeList': [], 'number': 0};

login();

/*
Clicks cancel button for push, clicks remember me for 24 hours and inputs passcode
*/
function login() {
	login_overlay();
	// document.querySelector("#login-form input[type=checkbox]").checked = true;
	// document.querySelector("input.passcode-input").value = check_passcode(codes.number !== 0);
}

/*
 An overlay telling you to wait while we try to log you in.
*/
function login_overlay() {
	document.getElementsByClassName('base-wrapper')[0].style = "filter: blur(5px); z-index: -100;";
	let wait_here = document.createElement("div");
	wait_here.style = "height: 100%; text-align: center; vertical-align: middle; z-index: 100;";
	wait_here.innerHTML = "<h1>Please Wait</h1> <p> Better-MyCourses is trying to sign you in.</p>";
	document.querySelector("body").insertBefore(wait_here, document.querySelector("body").childNodes[0]);
	console.log("Finished overlay creation");
}

/*
Collects passcodes from create offline codes link (@duo_url)
*/
function collect_passcodes() {
	let elements = [];
	document.querySelectorAll('.offlineCodeTable td').forEach(function (element) {
		elements.push(element.innerText.match(/\d+/g)[0]);
	});//Gets all of the passcodes and puts them into the elements array
	codes.codeList = elements;
	chrome.storage.local.set({Codes: codes}, function () {
		console.log("Added codes: " + codes.toLocaleString())
	})
}

/*
Checks to make sure that there are enough passcodes to sign-in.
 */
function check_passcode(exists) {
	console.log("checking passcodes");
	if (exists) { //pass-codes already exist
		let passcodes = chrome.storage.local.get('Codes', function (object) {
			console.log("Getting passcode for sign-in");
			return object;
		});
		if (passcodes.number === 1) { //only have one passcode left, use it to get new passcodes
			console.log("Collecting new passcodes");
			chrome.tabs.create({url: duo_url});
			collect_passcodes();
			passcodes = chrome.storage.local.get('Codes', function (object) {
				console.log("Getting passcode for sign-in");
				return object;
			}); //Update passcode list
		}
		// chrome.storage.local.set({Codes:codes}) //TODO need to save updated codes

	} else { // no pass-codes exist, user needs to login
		alert("No offline codes found. Please login to generate them.");
		window.open(duo_url, '_blank');
	}
	//if()
}

