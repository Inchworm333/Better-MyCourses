//Saves offline codes and auto fills them in when you are trying to login.
//by Nicholas Valletta

login()

/*
* Clicks cancel button for push, clicks remember me for 24 hours and inputs passcode.
*/
function login() {
	console.log('Starting login');
	//login_overlay();
	//document.querySelector("#login-form input[type=checkbox]").checked = true; //TODO turn on later
	fetch_passcode((value) => {
		if (value === false) {
			console.log('No passcodes, please login first')
			chrome.runtime.sendMessage({whatDo: 'getPasscodes'});
		} else {
			if (document.readyState === 'complete') {
				input_login(value);
			}
		}
	})
}

/* Checks passcodes and returns [
* True or False if the user can be auto logged in.
* A reason for not being able to login, suggestion to get more passcodes, getting more passcodes, or nothing.
* ]
 */
function check_passcodes(callback) {
	chrome.storage.local.get(['loginPasscodes', 'passcodeExp'], (object) => {
		console.log('checking passcodes');
		if (Object.keys(object).length === 0) {
			return callback([false, 'No passcodes available.']);
		} else if (object.loginPasscodes.length === 0) {
			return callback([false, 'No passcodes remaining.']);
		} else if (new Date(object.passcodeExp) <= Date.now()) {
			return callback([false, 'Passcodes have expired.']);
		} else if (object.loginPasscodes.length === 1) {
			return callback([true, 'Generating new passcodes.', true]);
		} else if (((Date.now() - new Date(object.passcodeExp)) / (1000 * 3600 * 24)) <= 7.00) {
			return callback([true, 'Passcodes expire in less than a week.', false]);
		} else {
			return callback([true]);
		}
	});
}

function fetch_passcode(callback) {
	console.log('Fetching passcodes');
	check_passcodes((object) => {
		const [success, message, forced] = object;
		let passcode;

		if (success) {
			console.log('Passcode check successful.')
			if (forced) {
				chrome.runtime.sendMessage({whatDo: 'getPasscodes'});
			}
			chrome.storage.local.get(['loginPasscodes', 'passcodeExp'], (object) => {
				passcode = object.loginPasscodes.pop();
				chrome.runtime.sendMessage({
					whatDo: 'storePasscodes',
					passcodes: object.loginPasscodes,
					exp: object.passcodeExp
				})
				return callback(passcode);
			})
		} else {
			console.log('passcode check not successful.')
			return callback(false);
		}
	});
}

function input_login(passcode) {
	console.log('logging in');
	setTimeout(() => {
		document.querySelector('#passcode').click();
		let passInput = document.querySelector('.passcode-input-wrapper input.passcode-input');
		passInput.value = passcode;
		document.querySelector('#passcode').click();
	}, 500)
}