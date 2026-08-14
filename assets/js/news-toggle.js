(function () {
  'use strict';

  function setItemVisibility(list, expanded, visibleCount) {
    Array.prototype.forEach.call(list.children, function (item, index) {
      item.hidden = !expanded && index >= visibleCount;
    });
  }

  function initializeListToggle(options) {
    var list = document.querySelector(options.listSelector);
    var toggle = document.querySelector(options.toggleSelector);
    var toggleWrap = document.querySelector(options.wrapSelector);

    if (!list || !toggle) {
      return;
    }

    toggleWrap = toggleWrap || toggle.parentElement;

    var expanded = false;
    var wasExpandable = false;

    function updateListState() {
      var hasHiddenItems = list.children.length > options.visibleCount;

      if (!hasHiddenItems) {
        expanded = false;
        wasExpandable = false;
        setItemVisibility(list, true, options.visibleCount);
        toggle.hidden = true;
        toggleWrap.hidden = true;
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = options.collapsedLabel;
        return;
      }

      if (!wasExpandable) {
        expanded = false;
      }

      wasExpandable = true;
      setItemVisibility(list, expanded, options.visibleCount);
      toggle.hidden = false;
      toggleWrap.hidden = false;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? options.expandedLabel : options.collapsedLabel;
    }

    toggle.addEventListener('click', function () {
      expanded = !expanded;
      setItemVisibility(list, expanded, options.visibleCount);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? options.expandedLabel : options.collapsedLabel;
    });

    updateListState();

    if (window.MutationObserver) {
      var observer = new window.MutationObserver(updateListState);
      observer.observe(list, { childList: true });
    }
  }

  function initializeExpandableLists() {
    initializeListToggle({
      listSelector: '[data-news-list]',
      toggleSelector: '[data-news-toggle]',
      wrapSelector: '[data-news-toggle-wrap]',
      visibleCount: 8,
      collapsedLabel: 'Show earlier news',
      expandedLabel: 'Show fewer news'
    });

    initializeListToggle({
      listSelector: '[data-publication-list]',
      toggleSelector: '[data-publication-toggle]',
      wrapSelector: '[data-publication-toggle-wrap]',
      visibleCount: 15,
      collapsedLabel: 'Show all publications',
      expandedLabel: 'Show fewer publications'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExpandableLists);
  } else {
    initializeExpandableLists();
  }
}());
