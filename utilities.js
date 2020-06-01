(function() {
  window.messageChecker = window.messageChecker || {};
  var console, background = chrome.extension.getBackgroundPage();

  if (background) {
    console = background.console
  }

  window.baseUrl = 'https://blendermarket.com';
  window.inboxUrl = 'https://blendermarket.com/inbox';

  messageChecker.Utilities = function() {};

  messageChecker.Utilities.prototype = {

    fetchPageXhr: (url, cb) => {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if(this.readyState === 4 && this.status === 200) {
          console.log(this.responseText);
          cb(this.responseText);
        } else {
          console.log('error with request');
          cb();
        }
      };
      xhr.open('GET', url, true);
      xhr.send();
    },

    fetchPage: (url, cb) => {
      fetch(url, {mode: 'cors'})
      .then(res => {
        return res.text();
      })
      .then(text => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');
        cb(doc);
      })
      .catch(err => {
        console.log(url, err);
      });
    },

    parsePreview: preview => {
      let link = `${window.baseUrl}${preview.getAttribute('href')}`
      let unread = preview.classList.toString().includes('unread');
      let media = preview.querySelector('.conversation-preview--media').style.backgroundImage;
      let subjectBlock = preview.querySelector('.conversation-preview--subject')
      let product = preview.querySelector('.conversation-preview--product');
      let subject = subjectBlock.childNodes[0];
      let time = subjectBlock.querySelector('.time').firstElementChild.dateTime

      if (product && product.innerText) {
        product = product.innerText.replace(/^Re: /, '');
      } else {
        product = 'General';
      }

      if (subject && subject.innerText) {
        subject = subject.innerText.replace(/^Re: /, '');
      }

      if (media) {
        media = media.slice(4, -1).replace(/"/g, '');
      }

      return {
        link,
        media,
        product,
        subject,
        time,
        unread
      }
    },

    timePoll: (pollTime, waitTime, cb) => {
      var stopTime = Date.newDate() + pollTime;
      var _timeInterval = (resolve, reject) => {
        var res = cb();
        res ? resolve(res) :
          Date.newDate() < stopTime ? reject(new Error(cb))
        : reject(new Error('Time over'));
      };
    }
  };
})();
