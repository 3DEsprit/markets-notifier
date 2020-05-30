(function() {
  // watch intervals and start searching
  var nextTime, lastTime, waitTime = 0, pollTime = 15000;
  const Preferences = new messageChecker.Preferences;
  const Conversations = new messageChecker.Conversations;

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

    if(nextTime !== undefined) {
      if(Date.now() >= nextTime) {
        console.log('timeout');
        checkInbox();
      }
    }
  }

  function start() {
    updateList();
  }
  start();
})();
