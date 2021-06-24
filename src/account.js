(function() {
  window.messageChecker = window.messageChecker || {};

  messageChecker.Account = function() {
    this.user = undefined;
    this.enabled = false;
  };

  messageChecker.Account.prototype = {
    checkLoginStatus: (page, cb) => {
      if (page.querySelector('.user-dropdown-toggle')) {
        cb({ enabled: true, user: page.querySelector('.user-dropdown-toggle strong').innerText });
      } else {
        cb({ enabled: false, user: undefined });
      }
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
