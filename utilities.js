(function() {
  window.messageChecker = window.messageChecker || {};

  window.inboxUrl = 'https://blendermarket.com/inbox';

  messageChecker.Utilities = () => {
    this.messageChecker = '';
  };

  messageChecker.Utilities.prototype = {
    callConsole: file => {
      console.log('FooFunc prototype loaded from ' + file);
    },

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
        cb(text);
      })
      .catch(err => {
        console.log(url, err);
      });
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
