// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     "id": "sampleContextMenu",
//     "title": "Sample Context Menu",
//     "contexts": ["selection"]
//   });
// });

// // This will run when a bookmark is created.
// chrome.bookmarks.onCreated.addListener(() => {
//   // do something
// });

// chrome.runtime.onMessage.addListener((message, sender, reply) => {
//     chrome.runtime.onMessage.removeListener(event);
// });

// chrome.runtime.onMessage.addListener((message, callback) => {
//   if (message.data == “setAlarm”) {
//     chrome.alarms.create({delayInMinutes: 5})
//   } else if (message.data == “runLogic”) {
//     chrome.tabs.executeScript({file: 'logic.js'});
//   } else if (message.data == “changeColor”) {
//     chrome.tabs.executeScript(
//         {code: 'document.body.style.backgroundColor="orange"'});
//   };
// });

// chrome.storage.local.set({variable: variableInformation});

// chrome.runtime.onSuspend.addListener(function() {
//   console.log("Unloading.");
//   chrome.browserAction.setBadgeText({text: ""});
// });

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({color: '#3aa757'}, () => {
//     console.log("The color is green.");
//   });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'developer.chrome.com'},
//       })
//       ],
//           actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });

// // sync settings across chrome
// chrome.storage.sync.set({key: value}, () => {
//   console.log('Value is set to ' + value);
// });

// chrome.storage.sync.get(['key'], (result) => {
//   console.log('Value currently is ' + result.key);
// });

(function() {
  // watch intervals and start searching
  var nextTime, lastTime, waitTime = 0, pollTime = 15000, message, status, links = 0, checkTime, flash, badgeColor = true;
  var utils = new replyCheck.Utils;
  var prefs = new replyCheck.Prefs;
  var courseFirst = replyCheck.getCourses();
  var courses = new replyCheck.Courses;
  var needFirst = replyCheck.getNeedReplies();
  var need = new replyCheck.NeedReplies;

  function grabLinks(flow, cb) {
    for(let course of courses[flow]) {
      var fullUrl = need.mainUrl + course + '#lessons';
      utils.fetchPage(fullUrl, (out) => {
        var re = /(?:lesson-list-item )[^]*?(?:<a href="https:\/\/cgcookie.com\/)lesson\/[a-z\-]*?\//ig;
        let match = out.match(re);
        links++;
        for(let m of match) {
          var url = /lesson\/[a-z\-]*?\//ig;
          courseFirst[flow + 'Lesson'].push(m.match(url).toString());
          if(links === courses[flow].length && m === match[match.length -1]) { cb('linksDone'); }
        }
      });
    }
  }

  function addTime(time) {
    console.log('addTime');
    lastTime = new Date();
    nextTime = lastTime.getTime() + time * 60000;
  }

  function checkQuestions() {
    console.log('check messages');
    addTime(waitTime);
  }

  function updateList() {
    var oldTime = waitTime;
    prefs._get('waitTime', (store) => {
      waitTime = store;
      if(waitTime === 0) { waitTime = 15; }
      if(waitTime !== oldTime) {
        console.log('reset');

        checkTime = setInterval(updateList, pollTime);
        checkQuestions();
      }
    });

    if(nextTime !== undefined) {
      if(Date.now() >= nextTime) {
        console.log('timeout');
        checkQuestions();
      }
    }
  }

  function start() {
    updateList();
  }
  start();
})();