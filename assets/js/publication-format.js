(function () {
  'use strict';

  var list = document.getElementById('publication-list');

  if (!list) {
    return;
  }

  list.classList.add('publication-list--formatted');

  function clean(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function textBetween(start, end) {
    var value = '';
    var node = start.nextSibling;

    while (node && node !== end) {
      value += ' ' + (node.textContent || '');
      node = node.nextSibling;
    }

    return clean(value).replace(/^,?\s*/, '').replace(/,\s*$/, '');
  }

  function textAfter(start) {
    var value = '';
    var node = start.nextSibling;

    while (node) {
      value += ' ' + (node.textContent || '');
      node = node.nextSibling;
    }

    return clean(value).replace(/^,?\s*/, '');
  }

  Array.prototype.forEach.call(list.children, function (item) {
    var venueElement = item.querySelector('strong');
    var titleElement = item.querySelector('em');

    if (!venueElement || !titleElement) {
      return;
    }

    var venue = clean(venueElement.textContent)
      .replace(/^\[/, '')
      .replace(/\]$/, '');
    var title = clean(titleElement.textContent)
      .replace(/^[\"“]/, '')
      .replace(/[,\"”]+$/, '');
    var authors = textBetween(venueElement, titleElement);
    var source = textAfter(titleElement);

    var header = document.createElement('div');
    header.className = 'publication-entry__header';

    var venueNode = document.createElement('span');
    venueNode.className = 'publication-entry__venue';
    venueNode.textContent = venue;

    var titleNode = document.createElement('span');
    titleNode.className = 'publication-entry__title';
    titleNode.textContent = title;

    var authorsNode = document.createElement('div');
    authorsNode.className = 'publication-entry__authors';
    authorsNode.textContent = authors;

    var sourceNode = document.createElement('div');
    sourceNode.className = 'publication-entry__source';
    sourceNode.textContent = source;

    header.appendChild(venueNode);
    header.appendChild(titleNode);
    item.textContent = '';
    item.className = 'publication-entry';
    item.appendChild(header);
    item.appendChild(authorsNode);
    item.appendChild(sourceNode);
  });
}());
