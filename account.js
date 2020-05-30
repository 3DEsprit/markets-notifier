(function() {
  window.messageChecker = window.messageChecker || {};
  const Utilities = new messageChecker.Utilities;

  messageChecker.Account = function() {
    this.user = undefined;
    this.enabled = false;
  };

  messageChecker.Account.prototype = {
    checkLoginStatus: function() {
      Utilities.fetchPage(window.baseUrl, function(out) {
        if (!out.querySelector('.login-signup-wrap')) {
          return { enabled: true, user: out.firstElementChild.firstElementChild.innerText };
        } else {
          return { enabled: false, user: undefined };
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
