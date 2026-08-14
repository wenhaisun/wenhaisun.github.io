(function () {
  'use strict';

  var nav = document.getElementById('site-nav');

  if (!nav) {
    return;
  }

  var button = nav.querySelector('button');
  var visibleLinks = nav.querySelector('.visible-links');
  var hiddenLinks = nav.querySelector('.hidden-links');
  var breakpoints = [];

  function availableWidth() {
    if (!button || button.classList.contains('hidden')) {
      return nav.clientWidth;
    }

    return nav.clientWidth - button.offsetWidth - 30;
  }

  function updateButtonState(expanded) {
    if (!button || !hiddenLinks) {
      return;
    }

    button.setAttribute('aria-expanded', String(expanded));
    button.classList.toggle('close', expanded);
    hiddenLinks.classList.toggle('hidden', !expanded);
  }

  function updateNavigation() {
    if (!button || !visibleLinks || !hiddenLinks) {
      return;
    }

    var available = availableWidth();
    var movable = visibleLinks.querySelectorAll('li:not(.masthead__menu-item--lg)');

    while (visibleLinks.scrollWidth > available && movable.length) {
      breakpoints.push(visibleLinks.scrollWidth);
      hiddenLinks.insertBefore(movable[movable.length - 1], hiddenLinks.firstChild);
      button.classList.remove('hidden');
      available = availableWidth();
      movable = visibleLinks.querySelectorAll('li:not(.masthead__menu-item--lg)');
    }

    while (breakpoints.length && available > breakpoints[breakpoints.length - 1]) {
      visibleLinks.appendChild(hiddenLinks.firstElementChild);
      breakpoints.pop();
      available = availableWidth();
    }

    if (!breakpoints.length) {
      button.classList.add('hidden');
      updateButtonState(false);
    }
  }

  function updateFooterSpacing() {
    var footer = document.querySelector('.page__footer');

    if (footer) {
      document.body.style.marginBottom = footer.offsetHeight + 'px';
    }
  }

  if (button && hiddenLinks) {
    button.addEventListener('click', function () {
      updateButtonState(hiddenLinks.classList.contains('hidden'));
    });

    hiddenLinks.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        updateButtonState(false);
      }
    });
  }

  window.addEventListener('resize', updateNavigation);
  window.addEventListener('load', function () {
    updateNavigation();
    updateFooterSpacing();
  });

  if (window.ResizeObserver) {
    var footer = document.querySelector('.page__footer');

    if (footer) {
      new window.ResizeObserver(updateFooterSpacing).observe(footer);
    }
  }

  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', updateNavigation);
  }

  updateNavigation();
  updateFooterSpacing();
}());
