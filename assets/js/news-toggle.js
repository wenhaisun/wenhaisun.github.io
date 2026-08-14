(function () {
  'use strict';

  var visibleCount = 8;

  function setItemVisibility(list, expanded) {
    Array.prototype.forEach.call(list.children, function (item, index) {
      item.hidden = !expanded && index >= visibleCount;
    });
  }

  function initializeNewsToggle() {
    var list = document.querySelector('[data-news-list]');
    var toggle = document.querySelector('[data-news-toggle]');
    var toggleWrap = document.querySelector('[data-news-toggle-wrap]');

    if (!list || !toggle) {
      return;
    }

    toggleWrap = toggleWrap || toggle.parentElement;

    var expanded = false;
    var wasExpandable = false;

    function updateNewsState() {
      var hasEarlierNews = list.children.length > visibleCount;

      if (!hasEarlierNews) {
        expanded = false;
        wasExpandable = false;
        setItemVisibility(list, true);
        toggle.hidden = true;
        toggleWrap.hidden = true;
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = 'Show earlier news';
        return;
      }

      if (!wasExpandable) {
        expanded = false;
      }

      wasExpandable = true;
      setItemVisibility(list, expanded);
      toggle.hidden = false;
      toggleWrap.hidden = false;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? 'Show fewer news' : 'Show earlier news';
    }

    toggle.addEventListener('click', function () {
      expanded = !expanded;
      setItemVisibility(list, expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? 'Show fewer news' : 'Show earlier news';
    });

    updateNewsState();

    if (window.MutationObserver) {
      var observer = new window.MutationObserver(updateNewsState);
      observer.observe(list, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNewsToggle);
  } else {
    initializeNewsToggle();
  }
}());
