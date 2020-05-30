(function() {
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
        let convoList = out.querySelector('.conversations').children
        if (convoList.length) {
          this.total = convoList.length;
          console.log(this.total);
          [].forEach.call(convoList, conversation => {
            // eslint-disable-next-line no-cond-assign
            if (inner = conversation.querySelector('.conversation-inner')) {
              this.conversationList.push(Utilities.parsePreview(inner))
            }
          });
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
