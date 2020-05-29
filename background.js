(function() {
  // watch intervals and start searching
  var nextTime, lastTime, waitTime = 0, pollTime = 15000;
  var utils = new messageCheck.Utils;
  var prefs = new messageCheck.Prefs;

  function checkInbox() {
    utils.fetchPage('blendermarket.com/inbox', out => {
      console.log(out.match(re));
    });
  }

  function addTime(time) {
    console.log('addTime');
    lastTime = new Date();
    nextTime = lastTime.getTime() + time * 60000;
  }

  function checkMessages() {
    console.log('check messages');
    addTime(waitTime);
  }

  function updateList() {
    var oldTime = waitTime;
    prefs.get('waitTime', store => {
      waitTime = store;
      if(waitTime === 0) { waitTime = 15; }
      if(waitTime !== oldTime) {
        console.log('reset');

        checkTime = setInterval(updateList, pollTime);
        checkMessages();
      }
    });

    if(nextTime !== undefined) {
      if(Date.now() >= nextTime) {
        console.log('timeout');
        checkMessages();
      }
    }
  }

  function start() {
    updateList();
  }
  start();
})();
