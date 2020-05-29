// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };

(function() {
  // Popup Content Script
  var console = chrome.extension.getBackgroundPage().console;

  console.log('Popup loaded');
  // call object from background here
  var needFirst = replyCheck.getNeedReplies();
  var re = /(?:https:\/\/cgcookie.com\/course\/|lesson\/)([a-z\-]*)/i;
  var questions = 0, topics = 0;

  function createQuestionLink(url, flow) {
    var div = document.querySelector('.' + flow);
    var header = document.querySelector('.result');
    if(div.style.display == '') { div.style.display = 'block'; }
    if(header.style.display !== '') { div.style.display = 'none'; }
    var match = re.exec(url);
    var title = match[1].toUpperCase().replace(/\-/gi, ' ');
    var link = document.createElement('div');
    link.className = 'questions';
    var a = document.createElement('a');
    a.className = 'question';
    a.target = '_blank';
    a.href = replyCheck.getNeedReplies().mainUrl + url;
    a.innerHTML = title;
    div.appendChild(a);
  }

  function searchList(flow, cb) {
    if(needFirst._questionList[flow].length !== 0) {
      for(let n of needFirst._questionList[flow]) {
        createQuestionLink(n, flow);
        questions++;
        if(questions == needFirst._questionList[flow].length) { cb('done'); }
      }
    } else {
      topics++;
      cb('done');
    }
  }

  function createMessage(text) {
    var div = document.querySelector('.result');
    if(div.style.display == '') { div.style.display = 'block'; }
    var message = document.createElement('h3');
    message.innerHTML = text;
    div.appendChild(message);
  }

  function start() {
    console.log('Starting Popup ' + chrome.app.getDetails().version);
    topics = 0;
    searchList('Blender', (out) => {
      if(out === 'done') { searchList('Concept', (out) => {
        if(out === 'done') { searchList('Sculpt', (out) => {
          if(out === 'done') { searchList('Unity', (out) => {
            if(out === 'done') {
              console.log('Done traversing lists');
              if(topics === 4) {
                createMessage('no questions');
              }
            }
          })}
        })}
      })}
    });
  }
  start();
})();