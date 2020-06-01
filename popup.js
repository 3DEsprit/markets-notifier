(function() {
  const Conversations = new messageChecker.Conversations;
  const Account = new messageChecker.Account;
  const Utilities = new messageChecker.Utilities;

  function loginContent() {
    let messageList = document.querySelector('.message-list');
    let messageBlock = document.createElement('div');
    messageBlock.setAttribute('target', '_inbox');
    messageBlock.setAttribute('class', 'user-logged-out');
    messageBlock.innerText = 'Please log into the Blender Market';
    messageList.append(messageBlock);
  }

  function setUserName(user) {
    let messageList = document.querySelector('.message-list');
    let userBlock = document.createElement('div');
    userBlock.setAttribute('class', 'user ellipsis');
    userBlock.innerHTML = `User: ${user}`;
    messageList.append(userBlock);
  }

  function buildContent(message) {
    let messageList = document.querySelector('.message-list');
    let messageBlock = document.createElement('a');
    messageBlock.setAttribute('target', '_inbox');
    messageBlock.setAttribute('class', 'message-block');

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
    messageBody.innerHTML = message.subject.data;
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
            messages.map(message => buildContent(message))
          });
        } else {
          loginContent();
        }
      });
    });
  }

  populateList();
})();
