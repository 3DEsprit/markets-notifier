(function() {
  var console = chrome.extension.getBackgroundPage().console;
  window.messageChecker = window.messageChecker || {};

  messageChecker.Preferences = function() {
    this.settings = {
      options: {
        lastTime: 0,
        pollTime: 10000,
        waitTime: 15,
        notifications: true,
        filters: []
      }
    }
  };

  messageChecker.Preferences.prototype = {
    get: function(key, cb) {
      chrome.storage.sync.get(this.settings, store => {
        cb(store.options[key]);
      });
    },
    set: function(key, val) {
      chrome.storage.sync.get(this.settings, store => {
        store.options[key] = val;
        chrome.storage.sync.set(store);
      });
    },
    getSync: function(key) {
      chrome.storage.sync.get(this.settings, store => {
        return (store.options[key]);
      });
    },
    checkSettings: function() {
      chrome.storage.sync.get(this.settings, store => {
        console.log(store);
      });
    }
  };
})();
