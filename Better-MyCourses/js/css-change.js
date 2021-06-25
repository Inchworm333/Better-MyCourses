//let cust = document.querySelector("body > custom-style style");

//cust.innerText = "html { --d2l-branding-primary-color: #00FF00; }";

//let homeLink = document.querySelector('d2l-navigation-link-image');

//homeLink.style.setProperty('filter', 'invert(1)');

// https://github.com/Qix-/color
// https://browserify.org/

window.onload = () => {
	let link = document.createElement("link");
	link.href = chrome.runtime.getURL('css/frame.css')
	link.rel = "stylesheet";
	link.type = "text/css";

	document.querySelectorAll('.d2l-iframe-fit-user-content').forEach(frame => {
		frame.contentDocument.head.appendChild(link);
	})

	document.querySelectorAll('.d2l-iframe-fit-user-content').forEach(frame => {
		frame.contentDocument.querySelectorAll('[style]').forEach(element => {
			if (element.style.backgroundColor === 'white') {
				element.style.backgroundColor = 'transparent';
			} else {
				element.style.backgroundColor = 'hue-rotate:180deg'
			}
		})
	})

	document.querySelectorAll('.d2l-htmlblock-untrusted [style]').forEach(element => {
		element.style = '';
	})
}
