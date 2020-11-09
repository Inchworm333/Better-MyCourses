chrome.storage.local.get(['loginPasscodes', 'passcodeExp'], (object) => {
	let cells = document.querySelectorAll('td');
	console.log(object);
	object.loginPasscodes.forEach((passcode, index) => {
		console.log(passcode);
		cells[index].innerText = passcode.code;
	})
});