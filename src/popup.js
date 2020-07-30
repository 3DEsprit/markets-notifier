(function() {
  const Conversations = new messageChecker.Conversations;
  const Account = new messageChecker.Account;
  const Utilities = new messageChecker.Utilities;
  const port = chrome.runtime.connect({ name: "market_notifier" });

  MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function loginContent() {
    let messageBlock = document.querySelector('.user');
    messageBlock.setAttribute('target', '_inbox');
    messageBlock.setAttribute('class', 'user user-logged-out');
    messageBlock.innerText = 'Please log into the Blender Market';
  }

  function createInboxButton(userBlock) {
    let inboxButton = document.createElement('a');
    inboxButton.setAttribute('class', 'button inbox-button');
    inboxButton.setAttribute('href', window.inboxUrl);
    inboxButton.setAttribute('target', '_inbox');
    inboxButton.innerHTML = 'INBOX';

    userBlock.append(inboxButton);
  }

  function setUserName(user) {
    let userBlock = document.querySelector('.user');
    userBlock.setAttribute('class', 'user-block');

    let userContent = document.createElement('div');
    userContent.setAttribute('class', 'user-content ellipsis');
    userContent.innerHTML = `User: ${user}`;

    userBlock.append(userContent);
    createInboxButton(userBlock);
  }

  function buildClear() {
    let messageList = document.querySelector('.message-list');
    let contentBlock = document.createElement('div');
    contentBlock.setAttribute('class', 'content-block');

    messageBlock = document.createElement('div');
    messageBlock.setAttribute('class', 'inbox-message');
    messageBlock.innerText = "Your Inbox is Empty"
    contentBlock.append(messageBlock);
    messageList.append(contentBlock);
  }

  function buildContent(message) {
    let messageList = document.querySelector('.message-list');
    let messageBlock = document.createElement('a');
    messageBlock.setAttribute('target', '_inbox');
    messageBlock.setAttribute('class', 'button message-block');

    let contentBlock = document.createElement('div');
    contentBlock.setAttribute('class', 'content-block ellipsis');

    let messageHeader = document.createElement('div');
    messageHeader.setAttribute('class', 'message-header');

    let messageBody = document.createElement('div');
    messageBody.setAttribute('class', 'message-body');

    let messageImage = document.createElement('img');
    messageImage.setAttribute('class', 'message-image');
    messageImage.setAttribute('src', `https:${message.media}`);
    messageBlock.href = message.link;

    messageHeader.innerHTML = message.product;
    let date = new Date(message.time);

    messageBody.innerHTML = `${MonthNames[date.getMonth() + 1]} ${date.getDay() + 1} - ${message.subject.data}`;
    contentBlock.append(messageHeader);
    contentBlock.append(messageBody);
    messageBlock.append(messageImage);
    messageBlock.append(contentBlock);

    messageList.append(messageBlock);
  }

  function populateList() {
    Utilities.fetchPage(window.baseUrl, page => {
      Account.checkLoginStatus(page, loginStatus => {
        if(loginStatus.enabled) {
          setUserName(loginStatus.user);
          Conversations.initList(messages => {
            if(messages.length) {
              messages.map(message => buildContent(message))
            } else {
              buildClear();
            }
          });
        } else {
          loginContent();
        }
      });
    });

    chrome.runtime.sendMessage({}, function(response) {});
  }

  populateList();
})();
