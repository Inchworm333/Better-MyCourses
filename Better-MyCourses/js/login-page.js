document.querySelector('body > div > div:nth-child(3)').remove();

document.querySelectorAll('.col-md-3 .support img').forEach((img) => {
	let src = img.src.replace('https://mycourses.rit.edu/d2l/loginh/img/', '').split('.')[0];

	img.src = chrome.runtime.getURL(`img/login-icons/${src}.svg`);
	img.width = '72';
	img.height = '72';
})

document.querySelector('body > br').nextSibling.remove();
document.querySelector('body > br').remove();