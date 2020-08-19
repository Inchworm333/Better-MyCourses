/*Duo Background
 * Fetches new offline passcodes in the background.
 * by Nicholas Valletta
 */

//Constants
const duo_url = 'https://start.rit.edu/Shibboleth.sso/Login?authnContextClassRef=' +
	'http://rit.edu/ac/classes/mfa&target=https://start.rit.edu/Duo/createOfflineCodes';

let needsNewCodes = false;

chrome.runtime.onMessage.addListener((message) => {
	if (message.whatDo === "getPasscodes") {
		console.log('bg: set needsNewCodes to true');
		needsNewCodes = true;
	} else if (message.whatDo === "storePasscodes") {
		console.log('bg: storing passcodes')
		store_passcodes(message.passcodes, message.exp);
	} else if (message.whatDo === "pageLoad") {
		console.log('page loaded');
		if (needsNewCodes) {
			passcode_page();
			needsNewCodes = false;
		}
	}
})

function passcode_page() {
	chrome.windows.create({url: duo_url, type: 'popup', state: 'minimized'});
}

function offline_page(callback) {
	console.log('getting page thing')
	let xhr = new XMLHttpRequest();
	xhr.open('GET', duo_url, true);
	xhr.responseType = 'document';
	xhr.send();
	xhr.onreadystatechange = () => {
		console.log('ready state changed')
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				let doc = xhr.response;
				let xhr2 = new XMLHttpRequest();
				xhr2.open('POST', doc.querySelector('form').action);
				xhr2.send(`SAMLResponse=${doc.querySelector('input[name="SAMLResponse"]').value}&RelayState=${doc.querySelector('input[name="RelayState"]').value}`);
				xhr2.onreadystatechange = () => {
					if (xhr2.readyState === XMLHttpRequest.DONE) {
						if (xhr2.status === 200) {
							let doc2 = xhr2.response;
							console.log(xhr.response);
							return callback(xhr.response);
						}
					}
				}
			}
		}
	}
}

function store_passcodes(passcodes, expiration) {
	//TODO: implement check for local or sync storage choice
	chrome.storage.local.set({loginPasscodes: passcodes, passcodeExp: expiration}, () => {
		console.log(`Stored passcodes: ${passcodes}`);
	})
}