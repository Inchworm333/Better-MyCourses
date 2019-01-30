//Background script
//by Nicholas Valletta

if (chrome.permissions.contains({origins: ['https://shibboleth.main.ad.rit.edu/*']},
	function (result) {
	return result;
	} )) {
	chrome.webNavigation.onCompleted.addListener(function (callback) {
	
	});
}