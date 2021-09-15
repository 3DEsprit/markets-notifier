(function() {
  const Conversations = new messageChecker.Conversations;
  const Account = new messageChecker.Account;
  const Utilities = new messageChecker.Utilities;
  const port = chrome.runtime.connect({ name: "market_notifier" });

  MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // button creation
  function createButton(userBlock, isLogin) {
    let inboxButton = document.createElement('a');
    inboxButton.setAttribute('class', 'button inbox-button');
    inboxButton.setAttribute('target', '_inbox');

    if(isLogin) {
      inboxButton.setAttribute('href', window.loginUrl);
      inboxButton.innerText = 'LOGIN';
    } else {
      inboxButton.setAttribute('href', window.inboxUrl);
      inboxButton.innerHTML = 'INBOX';
    }

    userBlock.append(inboxButton);
  }

  // header creation
  function createUserBlock(user) {
    let userBlock = document.querySelector('.user');

    let userContent = document.createElement('div');
    userContent.setAttribute('class', 'user-content ellipsis');
    if(user) {
      userContent.innerHTML = `User: ${user}`;
      userBlock.setAttribute('class', 'user-block');
      userBlock.append(userContent);
      createButton(userBlock, false);
    } else {      
      let messageBlock = document.createElement('p');
      messageBlock.innerText = 'Please log into the Blender Market';
      userBlock.append(messageBlock);

      userBlock.setAttribute('class', 'user user-logged-out');
      userBlock.append(userContent);
      createButton(userBlock, true);

    }
  }

  // message markup
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

    messageBody.innerHTML = `${message.time} - ${message.subject}`;
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
          createUserBlock(loginStatus.user);
          Conversations.initList(messages => {
            if(messages.length) {
              messages.map(message => buildContent(message))
            } else {
              buildClear();
            }
          });
        } else {
          createUserBlock();
        }
      });
    });

    chrome.runtime.sendMessage({}, function(response) {});
  }

  populateList();
})();
