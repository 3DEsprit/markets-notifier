(function() {
  const pollTime = 900000;

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
    let lastTime, currentTime = new Date();

    Preferences.get('lastTime', savedLast => {
      lastTime = savedLast != {} ? new Date(savedLast) : currentTime;

      Preferences.get('notifications', isEnabled => {
        if (isEnabled) {
          list.map(message => {
            if (lastTime < new Date(message.time)) {
              console.log(`${currentTime} - ${lastTime}: new message ${message.product} ${message.time}`)
              messageNotification(message);
            }
          });
        }
      });

      Preferences.set('lastTime', new Date().valueOf());
      badgeUpdate(list.length);
    });
  }

  function badgeUpdate(total) {
    console.log('badge');
    if(total > 0) {
      chrome.browserAction.setBadgeText({text: total.toString()});
      chrome.browserAction.setBadgeBackgroundColor({color: [185,0,0,255]});
    } else {
      chrome.browserAction.setBadgeText({text: '0'});
      chrome.browserAction.setBadgeBackgroundColor({color: [125,125,225,255]});
    }
  }

  function messageNotification(message) {
    Preferences.get('filters', savedFilters => {
      savedFilters.replace(' ', '').split(',').forEach(filter => {
        if(message.product.includes(filter)) {
          new Notification(`New Message for ${message.product}`, {
            icon: chrome.extension.getURL('images/notification_icon_128.png'),
            body: `${message.subject.data}`
          });
        }
      });
    });
  }

  function statusUpdate(total) {
    if (total > 0) {
      new Notification('BlenderMarket Inbox', {
        icon: chrome.extension.getURL('images/notification_icon_128.png'),
        body: `${total ? total.toString() : '0'} messages`
      });
    }
  }

  checkTime = setInterval(checkInbox, pollTime);

  checkInbox(listLength => statusUpdate(listLength));
})();
