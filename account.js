(function() {
  // add replies to list object
  window.messageChecker = window.messageChecker || {};

  messageChecker.Account = function() {};

  messageChecker.Account.prototype = {
    checkLoginStatus: () => {
      Utilities.fetchPage(window.inboxUrl, out => {
        if (!out.querySelector('.login-signup-wrap')) {
          // show solid icon
        } else {
          // not logged in
          // inform user on popup
        }
      });
    }
  };

  // make single instance for extension
  messageChecker.setupAccount = function() {
    var background = chrome.extension.getBackgroundPage();
    if (!Object.prototype.hasOwnProperty.call(background.messageChecker, 'Account')) {
      background.messageChecker.Account = new messageChecker.Account;
    }
    return background.messageChecker.Account;
  };
})();
