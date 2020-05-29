(function() {
  // add replies to list object
  window.messageCheck = window.messageCheck || {};
  var utils = new messageCheck.Utils;

  messageCheck.Conversations = function() {
    this.total = 0;
    this.messageList = {};
  };

  messageCheck.Conversations.prototype = {
    checkList: function() {
      utils.fetchPage('https://blendermarket.com/', out => {
        if (out) {
          console.log(out);
        }
      });
    },
    forEach: function(cb) {
      messageCheck.getMessages().messageList.map(key => {
        cb(key);
      });
    }
  };

  // make single instance for extension
  messageCheck.getMessages = function() {
    var background = chrome.extension.getBackgroundPage();
    if (!background.messageCheck.hasOwnProperty('conversations')) {
      background.messageCheck.Conversations = new messageCheck.Conversations;
    }
    return background.messageCheck.Conversations;
  };
})();
