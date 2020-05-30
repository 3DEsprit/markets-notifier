(function() {
  let nextTime, lastTime, waitTime = 0, pollTime = 15000;
  const Account = new messageChecker.Account;
  const Utilities = new messageChecker.Utilities;
  const Preferences = new messageChecker.Preferences;
  const Conversations = new messageChecker.Conversations;
  let convoMembers = messageChecker.setupConversations();

  function checkInbox() {
    Utilities.fetchPage(window.baseUrl, page => {
      Account.checkLoginStatus(page, loginStatus => {
        if (loginStatus.enabled) {
          Conversations.initList(() => {
            badgeUpdate();
            statusUpdate();
          });
        }
      });
    });
  }

  function updateList() {
    let oldTime = waitTime;
    if (waitTime === 0) {
      waitTime = 15;
    }

    if (waitTime !== oldTime) {
      console.log('reset');

      checkTime = setInterval(updateList, pollTime);
      lastTime = new Date();
      nextTime = lastTime.getTime() + waitTime * 60000;
      checkInbox();
    }

    if (nextTime !== undefined) {
      if (Date.now() >= nextTime) {
        console.log('timeout');
        checkInbox();
      }
    }
  }

  function badgeUpdate() {
    console.log('Update badge');
    if(convoMembers.total > 0) {
      chrome.browserAction.setBadgeText({text: convoMembers.total.toString()});
    }
    if(convoMembers.total !== 0) {
      chrome.browserAction.setBadgeBackgroundColor({color: [185,0,0,255]});
    } else {
      chrome.browserAction.setBadgeBackgroundColor({color: [125,125,225,255]});
    }
  }

  function statusUpdate() {
    console.log('update notification status');
    Preferences.get('notifications', isEnabled => {
      let total = convoMembers.total ? convoMembers.total.toString() : '0';
      if (isEnabled && nextTime) {
        new Notification('BlenderMarket Inbox', {
          icon: chrome.extension.getURL('images/get_started128.png'),
          body: `${total} messages`
        });
      }
    });
  }

  checkTime = setInterval(updateList, pollTime);

  function start() {
    updateList();
  }
  start();
})();
