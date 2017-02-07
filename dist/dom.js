'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tarry = require('tarry.js');

var _util = require('./util');

/**
 * Init new native parser
 */
var parser = new window.DOMParser();

/**
 * Get the target of the ajax req
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
var parseResponse = function parseResponse(html) {
  return parser.parseFromString(html, 'text/html');
};

/**
 * Finds all <script> tags in the new
 * markup and evaluates their contents
 *
 * @param {object} root DOM node containing new markup via AJAX
 * @param {...object} sources Other DOM nodes to scrape script tags from
 */
var evalScripts = function evalScripts(source) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var errors = [];
  var scripts = Array.prototype.slice.call(source.getElementsByTagName('script'));
  var existing = root ? Array.prototype.slice.call(root.getElementsByTagName('script')) : [];

  var dupe = function dupe(s) {
    return existing.filter(function (e) {
      return s.innerHTML === e.innerHTML && s.src === e.src;
    }).length > 0;
  };

  scripts.length > 0 && scripts.forEach(function (t) {
    var s = t.cloneNode(true);

    if (dupe(s)) return;

    s.setAttribute('data-ajaxed', 'true');

    try {
      eval(s.innerHTML); // eslint-disable-line 
    } catch (e) {
      errors.push(e);
    }

    try {
      root ? root.insertBefore(s, root.children[0]) : source.replaceChild(s, t);
    } catch (e) {
      errors.push(e);
      document.head.insertBefore(s, document.head.children[0]);
    }
  });

  if (errors.length > 0) {
    console.groupCollapsed('operator.js');
    errors.forEach(function (e) {
      return console.log(e);
    });
    console.groupEnd();
  }
};

/**
 * Get width/height of element or window
 *
 * @param {object} el Element or window
 * @param {string} type 'Height' or 'Width
 */
var returnSize = function returnSize(el, type) {
  var isWindow = el !== null && el.window;

  if (isWindow) {
    return Math.max(el['outer' + type], document.documentElement['client' + type]);
  }

  return Math.max(el['offset' + type], el['client' + type]);
};

/**
 * Helper to smoothly swap old
 * markup with new markup
 *
 * @param {object} markup New node to append to DOM
 */

exports.default = function (root, duration, events) {
  return function (markup, cb) {
    var dom = parseResponse(markup);
    var title = dom.head.getElementsByTagName('title')[0].innerHTML;
    var main = document.querySelector(root);

    var start = (0, _tarry.tarry)(function () {
      events.emit('before:transition');
      document.documentElement.classList.add('is-transitioning');
      main.style.height = returnSize(main, 'Height') + 'px';
    }, duration);

    var render = (0, _tarry.tarry)(function () {
      main.innerHTML = dom.querySelector(root).innerHTML;
      cb(title, main);
      evalScripts(main);
      evalScripts(dom.head, document.head);
      (0, _util.restoreScrollPos)();
    }, duration);

    var removeTransitionStyles = (0, _tarry.tarry)(function () {
      document.documentElement.classList.remove('is-transitioning');
      main.style.height = '';
    }, duration);

    var signalEnd = (0, _tarry.tarry)(function () {
      return events.emit('after:transition');
    }, duration);

    (0, _tarry.queue)(start, render, removeTransitionStyles, signalEnd)();
  };
};