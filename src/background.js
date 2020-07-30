(function() {
  const pollTime = 300000;

  const Account = new messageChecker.Account;
  const Utilities = new messageChecker.Utilities;
  const Preferences = new messageChecker.Preferences;
  const Conversations = new messageChecker.Conversations;

  function checkInbox(cb = null) {
    Utilities.fetchPage(window.baseUrl, page => {
      Account.checkLoginStatus(page, loginStatus => {
        if (loginStatus.enabled) {
          Conversations.initList(list => {
            checkList(list);
            if(cb) cb(list.length);
          });
        }
      });
    });
  }

  function checkList(list) {
    console.log(`list: ${list.length}`)
    let lastTime, currentTime = new Date(), update = false;

    Preferences.get('lastTime', savedLast => {
      lastTime = savedLast != {} ? new Date(savedLast) : currentTime;

      Preferences.get('notifications', isEnabled => {
        if (isEnabled) list.map(message => lastTime < new Date(message.time) ? messageNotification(message) : false);
      });

      Preferences.set('lastTime', new Date().valueOf());
      badgeUpdate(list.length);
    });
  }

  function badgeUpdate(total) {
    if(total !== 0) {
      chrome.browserAction.setBadgeText({text: total.toString()});
      chrome.browserAction.setBadgeBackgroundColor({color: [185,0,0,255]});
    } else {
      chrome.browserAction.setBadgeText({text: '0'});
      chrome.browserAction.setBadgeBackgroundColor({color: [125,125,225,255]});
    }
  }

  function sendMessage(message) {
    new Notification(`New Message for ${message.product}`, {
      icon: chrome.extension.getURL('images/notification_icon_128.png'),
      body: `${message.subject.data}`
    });
  }

  function messageNotification(message) {
    Preferences.get('filters', savedFilters => {
      if(typeof savedFilters === String) {
        savedFilters.toLowerCase().replace(' ', '').split(',').forEach(filter => {
          if(message.product.toLowerCase().includes(filter)) {
            sendMessage(message);
          }
        });
      } else {
        sendMessage(message);
      }
    });
  }

  function statusUpdate(total) {
    new Notification('BlenderMarket Inbox', {
      icon: chrome.extension.getURL('images/notification_icon_128.png'),
      body: `${total ? total.toString() : '0'} messages`
    });
  }

  checkTime = setInterval(checkInbox, pollTime);

  checkInbox(listLength => statusUpdate(listLength));

  // sync lookup on popup
  // TODO refactor to single screen scrape
  chrome.runtime.onMessage.addListener(function() {
    checkInbox();
  });
})();
