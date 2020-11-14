/**
 * automatic_duo.js
 *
 * @file Auto fills in offline codes for the MyCourses Duo 2 factor authentication system.
 * @author Nicholas Valletta (Inchworm333) <Inchworm333@gmail.com>
 * @version 1.0.0
 */

login()

/**
 * Starts the duo login process by clicking the keep me logged in and getting the passcodes.
 */
function login() {
	console.log('Starting login');
	//login_overlay(); //TODO probably not needed due to how fast stuff happens. Might replace with notification instead
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
		if (object.loginPasscodes.length !== 9 || object.loginPasscodes.every(obj => obj.used)) {
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
		console.log(object);
		const [success, message, forced] = object;

		if (success) {
			console.log('Passcode check successful.')
			if (forced) {
				chrome.runtime.sendMessage({whatDo: 'getPasscodes'});
			}
			chrome.storage.local.get(['loginPasscodes', 'passcodeExp'], (object) => {
				let usedIndex = object.loginPasscodes.findIndex(loginPasscode => !loginPasscode.used); //Gets first un-used passcode
				object.loginPasscodes[usedIndex].used = true;
				chrome.runtime.sendMessage({
					whatDo: 'updatePasscodes',
					passcodes: object.loginPasscodes,
					exp: object.passcodeExp
				})
				return callback(object.loginPasscodes[usedIndex].code);
			})
		} else {
			console.log('passcode check not successful.')
			return callback(false);
		}
	});
}

/**
 * Selects the passcode option and then enters the offline passcode.
 * @param {int} passcode - an offline code for Duo
 */
function input_login(passcode) {
	console.log('logging in');
	document.querySelector('#passcode').click();
	let passInput = document.querySelector('.passcode-input-wrapper input.passcode-input');
	passInput.value = passcode;
	document.querySelector('#passcode').click();

}