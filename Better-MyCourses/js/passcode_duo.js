collect_passcodes()

function collect_passcodes() {
	let passcodes = [];
	let expiration = new Date(document.querySelector('.offlineCodeHeader span b').innerText.substring(10));

	let passcodeElements = document.querySelectorAll('.offlineCodeTable td');
	passcodeElements.forEach((element) => {
		passcodes.push(element.innerText.replace(/\D/g, ''));
	});

	chrome.runtime.sendMessage({
		whatDo: 'storePasscodes',
		passcodes: passcodes,
		exp: expiration
	})
	chrome.windows.remove(chrome.windows.WINDOW_ID_CURRENT);
}