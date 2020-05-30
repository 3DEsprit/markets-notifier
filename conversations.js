(function() {
  // add replies to list object
  window.messageChecker = window.messageChecker || {};
  const Utilities = new messageChecker.Utilities;

  messageChecker.Conversations = function() {
    this.total = 0;
    this.conversationList = [];
  };

  messageChecker.Conversations.prototype = {
    initList: cb => {
      this.conversationList = [];

      Utilities.fetchPage(window.inboxUrl, out => {
        if (out.querySelector('.conversations').children.length) {
          [].forEach.call(out.querySelector('.conversations').children, conversation => {
            // eslint-disable-next-line no-cond-assign
            if (inner = conversation.querySelector('.conversation-inner')) {
              this.conversationList.push(Utilities.parsePreview(inner))
            }
          });
          console.log(this.conversationList);
        }

        cb(this.conversationList);
      });
    }
  };

  // make single instance for extension
  messageChecker.setupConversations = function() {
    let background = chrome.extension.getBackgroundPage();
    if (!Object.prototype.hasOwnProperty.call(background.messageChecker, 'Conversations')) {
      background.messageChecker.Conversations = new messageChecker.Conversations;
    }
    return background.messageChecker.Conversations;
  };
})();
