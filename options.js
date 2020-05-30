(function() {
  // change interval and reply list types
  window.messageChecker = window.messageChecker || {};

  let Preferences = new messageChecker.Preferences;

  let notificationSetting = document.getElementById('notifications');
  Preferences.get('notifications', notes => {
    notificationSetting.checked = notes;
    notificationSetting.addEventListener('click', () => {
      Preferences.set('notifications', notif.checked);
    });
  });

  let submitButton = document.getElementById('filter-submit');
  submitButton.addEventListener('click', function() {
    let filterData = document.getElementById('filters');
    Preferences.set('filter', filterData);
  });
})();
