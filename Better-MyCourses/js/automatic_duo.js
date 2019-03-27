//Saves offline codes and auto fills them in when you are trying to login.
//by Nicholas Valletta

let duo_url = 'https://start.rit.edu/Shibboleth.sso/Login?authnContextClassRef=' +
	'http://rit.edu/ac/classes/mfa&target=https://start.rit.edu/Duo/createOfflineCodes';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.command === 'start_no-login') {
		main();
	}
});


/*
Clicks cancel button for push, clicks remember me for 24 hours and inputs passcode
 */
function setup() {
	//if (chrome.storage.local.) //TODO: skip if no passcodes exist
	document.getElementsByClassName('btn-cancel').click();
	document.getElementsByClassName('stay-logged-in')[0]
		.getElementsByTagName('input')[0].checked = true;
	document.getElementsByClassName('passcode-input').value = standin; //TODO: fill in
}


function get_passcode(exists) {
	if (exists) { //pass-codes already exist, get more
		chrome.tabs.create({url: duo_url});
		setup();
	} else { // no pass-codes exist, user needs to login
		chrome.tabs.create({url: duo_url});
	}
	//if()
}


function main() {
	if (document.URL === 'https://*.duosecurity.com/*') {
		setup();
	}
}
