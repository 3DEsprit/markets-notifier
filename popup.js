(function() {
  // Popup Content Script
  const Conversations = new messageChecker.Conversations;
  var console, backgroundPage = chrome.extension.getBackgroundPage();

  if (backgroundPage) {
    console = backgroundPage.console
    console.log('Popup loaded');
  }

  function buildContent(message) {
    let messageList = document.querySelector('.message-list');
    let messageBlock = document.createElement('a');
    messageBlock.setAttribute('target', '_inbox');
    messageBlock.setAttribute('class', 'message-block');

    let contentBlock = document.createElement('div');
    contentBlock.setAttribute('class', 'content-block');

    let messageHeader = document.createElement('div');
    messageHeader.setAttribute('class', 'message-header');

    let messageBody = document.createElement('div');
    messageBody.setAttribute('class', 'message-body');

    let messageImage = document.createElement('img');
    messageImage.setAttribute('class', 'message-image');
    messageImage.style = message.media;
    messageBlock.href = message.link;

    messageHeader.innerHTML = message.product;
    messageBody.innerHTML = message.subject;
    contentBlock.append(messageHeader);
    contentBlock.append(messageBody);
    messageBlock.append(messageImage);
    messageBlock.append(contentBlock);

    messageList.append(messageBlock);
  }

  function populateList() {
    Conversations.initList(messages => {
      messages.map(message => buildContent(message))
    });
  }

  // call object from background here
  function start() {
    console.log('Starting Popup ' + chrome.app.getDetails().version);
    populateList();
  }

  start();
})();
