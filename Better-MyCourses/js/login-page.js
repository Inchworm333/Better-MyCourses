window.addEventListener('load', () => {
	let image = document.querySelector('img:nth-of-type(1)');
	image.load = 'eager';
	image.src = chrome.runtime.getURL('img/login-icons/Login-logo.svg');
})