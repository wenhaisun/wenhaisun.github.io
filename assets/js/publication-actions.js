(function () {
  'use strict';

  function initializePublicationActions() {
    var toggles = document.querySelectorAll('[data-publication-bib-toggle]');

    Array.prototype.forEach.call(toggles, function (toggle) {
      var panelId = toggle.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;

      if (!panel) {
        return;
      }

      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePublicationActions);
  } else {
    initializePublicationActions();
  }
}());
