console.log('sending page load');
chrome.runtime.sendMessage({whatDo: 'pageLoad'});