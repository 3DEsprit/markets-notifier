(function() {
  // add replies to list object
  window.messageChecker = window.messageChecker || {};
  const Utilities = new messageChecker.Utilities;

  messageChecker.Conversations = () => {
    this.total = 0;
    this.conversationList = {};
  };

  messageChecker.Conversations.prototype = {
    checkList: () => {
      Utilities.fetchPage(window.inboxUrl, out => {
        this.conversationList = out.querySelector('.conversations').children;
        return this.conversationList;
      });
    },
    forEach: () => {
      [].forEach.call(this.conversationList, conversation => {
        let previewObject =  parsePreview(conversation.querySelector('conversation-inner'))
        console.log(previewObject)
      });
    },
    parsePreview: preview => {
      let media = preview.querySelector('.conversation-preview-media')
      let subject = preview.querySelector('.conversation-preview--subject')
      let product = preview.querySelector('.conversation-preview--product')

      return {
        media,
        subject,
        product
      }
    }
  };

  // make single instance for extension
  messageChecker.buildConversations = () => {
    let background = chrome.extension.getBackgroundPage();
    if (!Object.prototype.hasOwnProperty.call(background.messageChecker, 'Conversations')) {
      background.messageChecker.Conversations = new messageChecker.Conversations;
    }
    return background.messageChecker.Conversations;
  };
})();
