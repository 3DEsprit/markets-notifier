(function() {
  window.messageCheck = window.messageCheck || {};

  messageCheck.Utils = function() {
    this.messageCheck = '';
  };

  messageCheck.Utils.prototype = {
    callConsole: function(file) {
      console.log('FooFunc prototype loaded from ' + file);
    },

    fetchPageXhr: function(url, cb) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
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

    fetchPage: function(url, cb) {
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

    timePoll(pollTime, waitTime, cb) {
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
