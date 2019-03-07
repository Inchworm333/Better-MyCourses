//Options Page for Better myCourses
//by Nicholas Valletta


function save_options() {
	let signin_skip = document.getElementById('signin_skip');
	chrome.storage.sync.set({
		signin_skip: signin_skip
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
	chrome.storage.sync.get(['signin_skip'], function (items) {
		(document.getElementById('signin_skip')).checked = items.signin_skip;
	});
}


function request_optional(option, permissions) {
	chrome.permissions.request(permissions,
		function (granted) {
			let status = document.getElementById('status');
			if (granted) {
				// Option for skipping RIT sign-in
				if (option.id === 'signin_skip') {
					chrome.runtime.sendMessage({
						command: 'start_no-login',
						permissions: permissions
					}, function (response) {
						if (response.success === true) {
							option.checked = true;
							status.style.color = 'green';
							status.textContent = 'Option enabled!';
						} else {
							status.style.color = 'red';
							status.textContent = 'Error encountered, check console for details.';
							option.checked = false;
							console.error('Error encountered while enabling option: ' + response.failText)
						}
					});
				}
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


function remove_optional(permissions) {
	// chrome.permissions.contains({origins: ['https://shibboleth.main.ad.rit.edu/*']},
	// 	function(result) {
	// 	if(!result) { permissions.permissions.push('cookies');}
	// 	});
	chrome.permissions.remove(permissions, function (removed) {
		let status = document.getElementById('status');
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
		origin = {origins: ['https://shibboleth.main.ad.rit.edu/*'], permissions: ['cookies']}
	}
	option = document.getElementById(option);

	if (option.checked === true) { //Checkbox has just been checked!!! Need to enable.
		request_optional(option, origin)
	} else { //Checkbox has just been unchecked!!! Need to disable.
		remove_optional(option, origin)
	}
}

restore_options();
document.getElementById('status').style.whiteSpace = 'pre';
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('signin_skip').addEventListener('click', function () {
	permission_selector('signin_skip'); });
document.getElementById('options').addEventListener('click', function () {
	chrome.permissions.getAll(function (permissions) {
		console.log(permissions);
	})
});
document.getElementById('getcookies').addEventListener('click', function () {
	chrome.runtime.sendMessage({
		command: 'start_no-login',
		permissions: {origins: ['https://shibboleth.main.ad.rit.edu/*'], permissions: ['cookies']}
	}, function (response) {
		console.log(response);
	})
});