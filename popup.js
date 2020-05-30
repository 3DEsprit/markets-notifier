(function() {
  // Popup Content Script
  var console = chrome.extension.getBackgroundPage().console;
  const Conversations = new messageChecker.Conversations;

  function populateList() {
    Conversations.initList(messages => {
      let messageList = document.querySelector('.message-list');
      messages.map(message => {
        var messageBlock = document.createElement('div');
        var messageHeader = document.createElement('div');
        var messageBody = document.createElement('div');
        var messageImage = document.createElement('img');
        messageImage.style = message.media;
        // messageBlock.src = message.link;
        messageHeader.innerHTML = message.product;
        messageBody.innerHTML = message.subject;
        messageBlock.append(messageHeader);
        messageBlock.append(messageBody);
        messageBlock.append(messageImage);
        console.log(messageBlock);
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
