//Options Page for Better myCourses
//by Nicholas Valletta


function save_options() {
	let signin_skip = document.getElementById('signin_skip');
	let duo_skip = document.getElementById('duo_skip');
	chrome.storage.sync.set({
		signin_skip: signin_skip,
		duo_skip: duo_skip
	}, function () {
		var status = document.getElementById('status');
		status.style.color = 'green';
		status.textContent = 'Options Saved!';
		setTimeout(function () {
			status.textContent = '\n';
			status.style.color = 'initial';
		}, 1000);
	});
}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		signin_skip: false,
		duo_skip: false
	}, function (items) {
		(document.getElementById('signin_skip').innerHTML).checked = items.signin_skip;
		(document.getElementById('duo_skip').innerHTML).checked = items.duo_skip;
	});
}


function request_optional(option, permissions) {
	chrome.permissions.contains({permissions: ['cookies']}, function(result){
		if (!result) {
			return permissions.permissions = permissions.permissions + 'cookies';
		}
	});
	chrome.permissions.request(permissions,
		function (granted) {
			var status = document.getElementById('status');
			if (granted) {
				option.checked = true;
				//todo run script for option
				status.style.color = 'green';
				status.textContent = 'Option enabled!';
			} else {
				status.style.color = 'red';
				status.textContent = 'You need to accept the permission in order to enable this option!';
				option.checked = false;
			}
			setTimeout(function () {
				status.textContent = '\n';
				status.style.color = 'initial';
			}, 1500);
		});
}


function remove_optional(option, permissions) {
	chrome.permissions.contains({origins: ['https://shibboleth.main.ad.rit.edu/*',
			'https://*.duosecurity.com/*']}, function(result) {
		if(!result) { permissions.permissions = permissions.permissions + 'cookies';}
		});
	chrome.permissions.remove(permissions, function (removed) {
		var status = document.getElementById('status');
		if (removed) {
			status.style.color = 'green';
			status.textContent = 'Optional permissions removed successfully.';
		} else {
			status.style.color = 'red';
			status.textContent = 'Optional permissions could not be removed.';
		}
		setTimeout(function () {
			status.textContent = '\n';
			status.style.color = 'initial';
		}, 1000);
	});
}


function permission_selector(option) {
	var origin;
	if(option === 'signin_skip') {
		origin = {origins: ['https://shibboleth.main.ad.rit.edu/*']}
	} else {
		origin = {origins: ['https://*.duosecurity.com/*']}
	}
	option = document.getElementById(option);
	
	if(option.checked === true) { //disabled, need to enable
		request_optional(option, origin)
	} else { //enabled, need to disable
		remove_optional(option, origin)
	}
}

document.getElementById('status').style.whiteSpace = 'pre';
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('signin_skip').addEventListener('click', function () {
	permission_selector('signin_skip'); });
document.getElementById('duo_skip').addEventListener('click',function () {
	permission_selector('duo_skip'); });
document.addEventListener(chrome.permissions.onAdded.addListener(function (permissions) {
	if (permissions.origins.includes("domain:"))
}))