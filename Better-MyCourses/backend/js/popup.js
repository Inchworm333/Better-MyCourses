document.getElementById("options").addEventListener("click", function () {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('../html/options.html'));
	}
});

document.getElementById('reset').onclick = (event) => {
	chrome.storage.local.clear();
};