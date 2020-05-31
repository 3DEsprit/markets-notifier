(function() {
  // change interval and reply list types
  window.messageChecker = window.messageChecker || {};
  let background = chrome.extension.getBackgroundPage();

  if(background) {
    let console = background.console
    console.log('options loaded')
  }

  let Preferences = new messageChecker.Preferences;

  let notificationCheckbox = document.querySelector('input[name=notifications]');
  Preferences.get('notifications', savedSetting => {
    notificationCheckbox.checked = savedSetting || false;

    notificationCheckbox.addEventListener('change', () => {
      Preferences.set('notifications', notificationCheckbox.checked);
    });
  });

  let submitButton = document.getElementById('filter-submit')
  submitButton.addEventListener('click', function() {
    let filterData = document.getElementById('filters');
    Preferences.set('filter', filterData.value);
  });
})();
