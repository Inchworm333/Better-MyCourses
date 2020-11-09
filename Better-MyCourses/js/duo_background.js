/**
 * duo_background.js
 *
 * @file Background listener and function executor for bypassing the RIT MyCourses authentication system.
 * @author Nicholas Valletta (Inchworm333) <inchworm333@gmail.com>
 * @version 1.0.0
 */

//Constants
const duo_url = 'https://start.rit.edu/Shibboleth.sso/Login?authnContextClassRef=' +
	'http://rit.edu/ac/classes/mfa&target=https://start.rit.edu/Duo/createOfflineCodes';

let needsNewCodes = false;

/**
 * Listens for messages about duo authentication such as getting/storing/updating passcodes.
 *
 * @listens chrome.runtime.onMessage
 */
chrome.runtime.onMessage.addListener((message) => {
	if (message.whatDo === "getPasscodes") {
		console.log('bg: set needsNewCodes to true');
		needsNewCodes = true;
	} else if (message.whatDo === "storePasscodes") {
		console.log('bg: storing passcodes')
		store_passcodes(message.passcodes, message.exp);
	} else if (message.whatDo === "updatePasscodes") {
		console.log('updating used passcodes')
		update_passcodes(message.passcodes);
	} else if (message.whatDo === "pageLoad") {
		console.log('page loaded');
		if (needsNewCodes) {
			passcode_page();
		}
	}
})

/**
 * Creates minimized window that creates new passcodes
 *
 * @see duo_url
 */
function passcode_page() {
	chrome.windows.create({url: duo_url, type: 'popup', state: 'minimized', setSelfAsOpener: true});
}

/**
 * Stores the passcodes and passcode expiration date
 *
 * @param {int[]} passcodes - the list of passcodes
 * @param {Date} expiration - the date the passcodes expire
 */
function store_passcodes(passcodes, expiration) {
	passcodes = passcodes.map(passcode => {
		return {"code": passcode, "used": false}
	})
	//TODO: implement check for local or sync storage choice
	chrome.storage.local.set({loginPasscodes: passcodes, passcodeExp: expiration}, () => {
		console.log(`Stored passcodes:`);
		console.log(passcodes);
	})
}

/**
 * Updates the passcodes
 *
 * @see store_passcodes
 *
 * @param {{code: int, used: boolean}[]} passcodes
 */
function update_passcodes(passcodes) {
	//TODO: implement check for local or sync storage choice
	chrome.storage.local.set({loginPasscodes: passcodes}, () => {
		console.log(`Updated passcodes:`);
		console.log(passcodes);
	})
}