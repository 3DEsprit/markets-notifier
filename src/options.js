(function() {
  // change interval and reply list types
  window.messageChecker = window.messageChecker || {};

  let Preferences = new messageChecker.Preferences;

  let notificationCheckbox = document.querySelector('input[name=notifications]');
  Preferences.get('notifications', savedSetting => {
    notificationCheckbox.checked = savedSetting || false;

    notificationCheckbox.addEventListener('change', () => {
      Preferences.set('notifications', notificationCheckbox.checked);
    });
  });

  let submitButton = document.getElementById('filter-submit');
  let filterData = document.getElementById('filters');

  Preferences.get('filters', savedFilters => {
    filterData.value = savedFilters;

    submitButton.addEventListener('click', function() {
      Preferences.set('filters', filterData.value);
    });
  });
})();
