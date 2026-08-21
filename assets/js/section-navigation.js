(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var entries = [];
  var entriesById = Object.create(null);

  function decodeId(value) {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  }

  links.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    var id = decodeId(href.slice(1));
    var section = id ? document.getElementById(id) : null;

    if (!section || entriesById[id]) return;

    var entry = { id: id, link: link, section: section };
    entries.push(entry);
    entriesById[id] = entry;
  });

  if (!entries.length) return;

  var activeId = "";
  var pendingNavigationId = "";
  var updateScheduled = false;
  var requestFrame = window.requestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 16);
  };

  function setActive(id) {
    if (!entriesById[id] || id === activeId) return;

    activeId = id;
    entries.forEach(function (entry) {
      if (entry.id === id) {
        entry.link.setAttribute("aria-current", "location");
      } else {
        entry.link.removeAttribute("aria-current");
      }
    });
  }

  function getMastheadOffset() {
    var masthead = document.querySelector(".masthead");
    return (masthead ? masthead.getBoundingClientRect().height : 0) + 28;
  }

  function updateActive() {
    updateScheduled = false;

    var threshold = getMastheadOffset();

    if (pendingNavigationId) {
      var pendingEntry = entriesById[pendingNavigationId];
      var pendingIndex = entries.indexOf(pendingEntry);
      var nextEntry = pendingIndex >= 0 ? entries[pendingIndex + 1] : null;
      if (!pendingEntry || !pendingEntry.section || (nextEntry && !nextEntry.section)) {
        pendingNavigationId = "";
        scheduleUpdate();
        return;
      }
      var pendingReached = pendingEntry.section.getBoundingClientRect().top <= threshold &&
        (!nextEntry || nextEntry.section.getBoundingClientRect().top > threshold);

      if (!pendingReached) {
        setActive(pendingNavigationId);
        return;
      }

      pendingNavigationId = "";
    }

    var current = entries[0];

    entries.forEach(function (entry) {
      if (entry.section.getBoundingClientRect().top <= threshold) {
        current = entry;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = entries[entries.length - 1];
    }

    setActive(current.id);
  }

  function scheduleUpdate() {
    if (updateScheduled) return;

    updateScheduled = true;
    requestFrame(updateActive);
  }

  function setActiveFromHash() {
    var hash = window.location.hash || "";
    var id = decodeId(hash.charAt(0) === "#" ? hash.slice(1) : hash);

    if (entriesById[id]) {
      pendingNavigationId = id;
      setActive(id);
    } else {
      pendingNavigationId = "";
    }

    scheduleUpdate();
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var href = link.getAttribute("href") || "";
      var id = decodeId(href.slice(1));

      if (entriesById[id]) {
        pendingNavigationId = id;
        setActive(id);
        scheduleUpdate();
      }
    });
  });

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", setActiveFromHash);
  window.addEventListener("load", setActiveFromHash);

  setActiveFromHash();
}());
