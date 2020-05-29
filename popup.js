(function() {
  // Popup Content Script
  var console = chrome.extension.getBackgroundPage().console;

  console.log('Popup loaded');
  // call object from background here

  function start() {
    console.log('Starting Popup ' + chrome.app.getDetails().version);
  }

  start();
})();
