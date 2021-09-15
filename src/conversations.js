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
        let queryOut = out.querySelector('.conversations')

        if (queryOut) {
          let convoList = queryOut.children
          if (convoList.length) {
            this.total = convoList.length;
            [].forEach.call(convoList, conversation => {
              // eslint-disable-next-line no-cond-assign
              if (conversation) {
                this.conversationList.push(Utilities.parsePreview(conversation))
              }
            });
          }
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
