(function() {
  // add replies to list object
  window.messageCheck = window.messageCheck || {};
  const Utilities = new messageCheck.Utilities;

  messageCheck.Conversations = function() {
    this.total = 0;
    this.conversationList = {};
  };

  messageCheck.Conversations.prototype = {
    checkList: function() {
      Utilities.fetchPage(window.inboxUrl, out => {
        if (out) {
          console.log(out);
        }
      });
    },
    forEach: function(cb) {
      messageCheck.getMessages().conversationList.map(key => {
        cb(key);
      });
    }
  };

  // make single instance for extension
  messageCheck.getMessages = function() {
    var background = chrome.extension.getBackgroundPage();
    if (!Object.prototype.hasOwnProperty.call(background.messageCheck, 'Conversations')) {
      background.messageCheck.Conversations = new messageCheck.Conversations;
    }
    return background.messageCheck.Conversations;
  };
})();
