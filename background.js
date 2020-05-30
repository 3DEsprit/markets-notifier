(function() {
  var nextTime, lastTime, waitTime = 0, pollTime = 15000;
  const Preferences = new messageChecker.Preferences;
  const Conversations = messageChecker.buildConversations();

  function checkInbox() {
    Conversations.initConversations();
    Conversations.map();
  }

  function updateList() {
    var oldTime = waitTime;
    Preferences.get('waitTime', store => {
      waitTime = store;
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
    });

    if (nextTime !== undefined) {
      if (Date.now() >= nextTime) {
        console.log('timeout');
        checkInbox();
      }
    }
  }

  function _statusUpdate() {
    console.log('update notification status');
    Preferences.get('notifications', store => {
      status = store;
      if (status && nextTime) {
        if (Conversations.total > 0) {
          new Notification('BlenderMarket Inbox', {
            icon: chrome.extension.getURL('icon.png'),
            body: `${Conversations.total.toString()} messages`
          });
        }
      }
    });
  }

  function start() {
    updateList();
  }
  start();
})();
