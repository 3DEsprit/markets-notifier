(function() {
  // Popup Content Script
  var console = chrome.extension.getBackgroundPage().console;
  const Conversations = new messageChecker.Conversations;

  function populateList() {
    Conversations.initList(messages => {
      console.log(messages);
      let messageList = document.querySelector('.message-list');
      messages.map(message => {
        var messageBlock = document.createElement('div');
        messageBlock.innerHTML = message.subject;
        messageList.append(messageBlock);
      })
    });
  }

  console.log('Popup loaded');
  // call object from background here

  function start() {
    console.log('Starting Popup ' + chrome.app.getDetails().version);
    populateList();
  }

  start();
})();
