(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _index = require('../../../package/dist/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _index2.default)({
  root: '#root',
  duration: 200
});

window.app = app;

app.on('route:before', function (props) {
  return console.log('route:before', props);
});
app.on('route:after', function (props) {
  return console.log('route:after', props);
});
app.on('transition:before', function (props) {
  return console.log('transition:before', props);
});
app.on('transition:after', function (props) {
  return console.log('transition:after', props);
});

app.on('transition:before', function (_ref) {
  var route = _ref.route;

  if (/page/.test(route)) {
    document.documentElement.classList.add('is-page');
  }
});
app.on('transition:after', function (_ref2) {
  var route = _ref2.route;

  if (/page/.test(route)) {
    document.documentElement.classList.remove('is-page');
  }
});

},{"../../../package/dist/index.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cache = {};

exports.default = {
  set: function set(route, res) {
    cache = _extends({}, cache, _defineProperty({}, route, res));
  },
  get: function get(route) {
    return cache[route];
  },
  getCache: function getCache() {
    return cache;
  }
};
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isDupe = function isDupe(script, existing) {
  var dupes = [];

  for (var i = 0; i < existing.length; i++) {
    script.isEqualNode(existing[i]) && dupes.push(i);
  }

  return dupes.length > 0;
};

exports.default = function (newDom, existingDom) {
  var existing = existingDom.getElementsByTagName('script');
  var scripts = newDom.getElementsByTagName('script');

  for (var i = 0; i < scripts.length; i++) {
    if (isDupe(scripts[i], existing)) {
      continue;
    }

    var s = document.createElement('script');
    var src = scripts[i].attributes.getNamedItem('src');

    if (src) {
      s.src = src.value;
    } else {
      s.innerHTML = scripts[i].innerHTML;
    }

    document.body.appendChild(s);
  }
};
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _operator = require('./operator');

var _operator2 = _interopRequireDefault(_operator);

var _url = require('./url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var _ref$root = _ref.root,
      root = _ref$root === undefined ? document.body : _ref$root,
      _ref$duration = _ref.duration,
      duration = _ref$duration === undefined ? 0 : _ref$duration,
      _ref$ignore = _ref.ignore,
      ignore = _ref$ignore === undefined ? [] : _ref$ignore;

  var operator = new _operator2.default({
    root: root,
    duration: duration,
    ignore: ignore
  });

  operator.setState({
    route: window.location.pathname + window.location.search,
    title: document.title
  });

  (0, _delegate2.default)(document, 'a', 'click', function (e) {
    var anchor = e.delegateTarget;
    var href = anchor.getAttribute('href') || '/';

    var internal = _url.link.isSameOrigin(href);
    var external = anchor.getAttribute('rel') === 'external';
    var disabled = anchor.classList.contains('no-ajax');
    var ignored = operator.ignored(e, href);
    var hash = _url.link.isHash(href);

    if (!internal || external || disabled || ignored || hash) {
      return;
    }

    e.preventDefault();

    if (_url.link.isSameURL(href)) {
      return;
    }

    operator.go(href);

    return false;
  });

  window.onpopstate = function (e) {
    var href = e.target.location.href;

    if (operator.ignored(e, href)) {
      if (_url.link.isHash(href)) {
        return;
      }

      return window.location.reload();
    }

    operator.go(href, null, true);
  };

  return operator;
};
},{"./operator":6,"./url":9,"delegate":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var activeLinks = [];

var toggle = function toggle(bool) {
  for (var i = 0; i < activeLinks.length; i++) {
    activeLinks[i].classList[bool ? 'add' : 'remove']('is-active');
  }
};

exports.default = function (route) {
  toggle(false);

  activeLinks.splice(0, activeLinks.length);
  activeLinks.push.apply(activeLinks, _toConsumableArray(Array.prototype.slice.call(document.querySelectorAll('[href$="' + route + '"]'))));

  toggle(true);
};
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nanoajax = require('nanoajax');

var _nanoajax2 = _interopRequireDefault(_nanoajax);

var _navigo = require('navigo');

var _navigo2 = _interopRequireDefault(_navigo);

var _scrollRestoration = require('scroll-restoration');

var _scrollRestoration2 = _interopRequireDefault(_scrollRestoration);

var _loop = require('loop.js');

var _loop2 = _interopRequireDefault(_loop);

var _url = require('./url');

var _links = require('./links');

var _links2 = _interopRequireDefault(_links);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var router = new _navigo2.default(_url.origin);

var Operator = function () {
  function Operator(config) {
    _classCallCheck(this, Operator);

    var events = (0, _loop2.default)();

    this.config = config;

    this.render = (0, _render2.default)(document.querySelector(config.root), config, events.emit);

    Object.assign(this, events);
  }

  _createClass(Operator, [{
    key: 'stop',
    value: function stop() {
      _state2.default.paused = true;
    }
  }, {
    key: 'start',
    value: function start() {
      _state2.default.paused = false;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return _state2.default._state;
    }
  }, {
    key: 'setState',
    value: function setState(_ref) {
      var route = _ref.route,
          title = _ref.title;

      _state2.default.route = route === '' ? '/' : route;
      title ? _state2.default.title = title : null;

      (0, _links2.default)(_state2.default.route);

      document.title = title;
    }
  }, {
    key: 'go',
    value: function go(href) {
      var _this = this;

      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var resolve = arguments[2];

      if (_state2.default.paused) {
        return;
      }

      var callback = function callback(title) {
        var res = {
          title: title,
          route: route
        };

        resolve ? router.resolve(route) : router.navigate(route);

        _this.setState(res);

        _this.emit('route:after', res);

        if (cb) {
          cb(res);
        }
      };

      var route = (0, _url.sanitize)(href);

      if (resolve) {
        _scrollRestoration2.default.save();
      }

      var cached = _cache2.default.get(route);

      if (cached) {
        return this.render(route, cached, callback);
      }

      this.emit('route:before', { route: route });

      this.get(route, callback);
    }
  }, {
    key: 'get',
    value: function get(route, cb) {
      var _this2 = this;

      return _nanoajax2.default.ajax({
        method: 'GET',
        url: _url.origin + '/' + route
      }, function (status, res, req) {
        if (req.status < 200 || req.status > 300 && req.status !== 304) {
          window.location = _url.origin + '/' + _state2.default.prev.route;
          return;
        }

        _cache2.default.set(route, req.response);

        _this2.render(route, req.response, cb);
      });
    }
  }, {
    key: 'push',
    value: function push() {
      var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _state2.default.title;

      if (!route) {
        return;
      }

      this.router.navigate(route);
      this.setState({ route: route, title: title });
    }
  }, {
    key: 'ignored',
    value: function ignored(event, href) {
      var _this3 = this;

      var route = (0, _url.sanitize)(href);

      return this.config.ignore.filter(function (t) {
        if (Array.isArray(t)) {
          var res = t[1](route);

          if (res) {
            _this3.emit(t[0], {
              route: route,
              event: event
            });
          }
          return res;
        } else {
          return t(route);
        }
      }).length > 0;
    }
  }]);

  return Operator;
}();

exports.default = Operator;
},{"./cache":2,"./links":5,"./render":7,"./state":8,"./url":9,"loop.js":12,"nanoajax":14,"navigo":15,"scroll-restoration":16}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tarry = require('tarry.js');

var _scrollRestoration = require('scroll-restoration');

var _scrollRestoration2 = _interopRequireDefault(_scrollRestoration);

var _eval = require('./eval.js');

var _eval2 = _interopRequireDefault(_eval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = new window.DOMParser();

var parseResponse = function parseResponse(html) {
  return parser.parseFromString(html, 'text/html');
};

exports.default = function (page, _ref, emit) {
  var duration = _ref.duration,
      root = _ref.root;
  return function (route, markup, cb) {
    var res = parseResponse(markup);
    var title = res.title;

    var start = (0, _tarry.tarry)(function () {
      emit('transition:before', { route: route });
      document.documentElement.classList.add('is-transitioning');
      page.style.height = page.clientHeight + 'px';
    });

    var render = (0, _tarry.tarry)(function () {
      page.innerHTML = res.querySelector(root).innerHTML;
      (0, _eval2.default)(res, document);
      _scrollRestoration2.default.restore();
    });

    var end = (0, _tarry.tarry)(function () {
      emit('transition:after', { route: route });
      cb(title);
      page.style.height = '';
      document.documentElement.classList.remove('is-transitioning');
    });

    (0, _tarry.queue)(start(0), render(duration), end(0))();
  };
};
},{"./eval.js":3,"scroll-restoration":16,"tarry.js":17}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  paused: false,
  _state: {
    route: '',
    title: '',
    prev: {
      route: '/',
      title: ''
    }
  },
  get route() {
    return this._state.route;
  },
  set route(loc) {
    this._state.prev.route = this.route;
    this._state.route = loc;
  },
  get title() {
    return this._state.title;
  },
  set title(val) {
    this._state.prev.title = this.title;
    this._state.title = val;
  },
  get prev() {
    return this._state.prev;
  }
};
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getOrigin = function getOrigin(location) {
  var protocol = location.protocol,
      host = location.host;

  return protocol + '//' + host;
};

var parseURL = function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a;
};

var origin = exports.origin = getOrigin(window.location);

var originRegEx = new RegExp(origin);

var sanitize = exports.sanitize = function sanitize(url) {
  var route = url.replace(originRegEx, '');
  return route.match(/^\//) ? route.replace(/\/{1}/, '') : route;
};

var link = exports.link = {
  isSameOrigin: function isSameOrigin(href) {
    return origin === getOrigin(parseURL(href));
  },
  isHash: function isHash(href) {
    return (/#/.test(href)
    );
  },
  isSameURL: function isSameURL(href) {
    return window.location.search === parseURL(href).search && window.location.pathname === parseURL(href).pathname;
  }
};
},{}],10:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":13}],11:[function(require,module,exports){
var closest = require('closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector, true);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"closest":10}],12:[function(require,module,exports){
"use strict";var _extends=Object.assign||function(e){for(var i,k=1;k<arguments.length;k++)for(var l in i=arguments[k],i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l]);return e};Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i={};return _extends({},e,{emit:function(l){var m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,n=!!i[l]&&i[l].queue;n&&n.forEach(function(o){return o(m)})},on:function(l){var m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;m&&(i[l]=i[l]||{queue:[]},i[l].queue.push(m))}})};

},{}],13:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],14:[function(require,module,exports){
(function (global){
// Best place to find information on XHR features is:
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

var reqfields = [
  'responseType', 'withCredentials', 'timeout', 'onprogress'
]

// Simple and small ajax function
// Takes a parameters object and a callback function
// Parameters:
//  - url: string, required
//  - headers: object of `{header_name: header_value, ...}`
//  - body:
//      + string (sets content type to 'application/x-www-form-urlencoded' if not set in headers)
//      + FormData (doesn't set content type so that browser will set as appropriate)
//  - method: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
//  - cors: If your using cross-origin, you will need this true for IE8-9
//
// The following parameters are passed onto the xhr object.
// IMPORTANT NOTE: The caller is responsible for compatibility checking.
//  - responseType: string, various compatability, see xhr docs for enum options
//  - withCredentials: boolean, IE10+, CORS only
//  - timeout: long, ms timeout, IE8+
//  - onprogress: callback, IE10+
//
// Callback function prototype:
//  - statusCode from request
//  - response
//    + if responseType set and supported by browser, this is an object of some type (see docs)
//    + otherwise if request completed, this is the string text of the response
//    + if request is aborted, this is "Abort"
//    + if request times out, this is "Timeout"
//    + if request errors before completing (probably a CORS issue), this is "Error"
//  - request object
//
// Returns the request object. So you can call .abort() or other methods
//
// DEPRECATIONS:
//  - Passing a string instead of the params object has been removed!
//
exports.ajax = function (params, callback) {
  // Any variable used more than once is var'd here because
  // minification will munge the variables whereas it can't munge
  // the object access.
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')
    , called = false

  var req = getRequest(params.cors)

  function cb(statusCode, responseText) {
    return function () {
      if (!called) {
        callback(req.status === undefined ? statusCode : req.status,
                 req.status === 0 ? "Error" : (req.response || req.responseText || responseText),
                 req)
        called = true
      }
    }
  }

  req.open(method, params.url, true)

  var success = req.onload = cb(200)
  req.onreadystatechange = function () {
    if (req.readyState === 4) success()
  }
  req.onerror = cb(null, 'Error')
  req.ontimeout = cb(null, 'Timeout')
  req.onabort = cb(null, 'Abort')

  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')

    if (!global.FormData || !(body instanceof global.FormData)) {
      setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
    }
  }

  for (var i = 0, len = reqfields.length, field; i < len; i++) {
    field = reqfields[i]
    if (params[field] !== undefined)
      req[field] = params[field]
  }

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(body)

  return req
}

function getRequest(cors) {
  // XDomainRequest is only way to do CORS in IE 8 and 9
  // But XDomainRequest isn't standards-compatible
  // Notably, it doesn't allow cookies to be sent or set by servers
  // IE 10+ is standards-compatible in its XMLHttpRequest
  // but IE 10 can still have an XDomainRequest object, so we don't want to use it
  if (cors && global.XDomainRequest && !/MSIE 1/.test(navigator.userAgent))
    return new XDomainRequest
  if (global.XMLHttpRequest)
    return new XMLHttpRequest
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Navigo", [], factory);
	else if(typeof exports === 'object')
		exports["Navigo"] = factory();
	else
		root["Navigo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var PARAMETER_REGEXP = /([:*])(\w+)/g;
	var WILDCARD_REGEXP = /\*/g;
	var REPLACE_VARIABLE_REGEXP = '([^\/]+)';
	var REPLACE_WILDCARD = '(?:.*)';
	var FOLLOWED_BY_SLASH_REGEXP = '(?:\/|$)';
	
	function clean(s) {
	  if (s instanceof RegExp) return s;
	  return s.replace(/\/+$/, '').replace(/^\/+/, '/');
	}
	
	function regExpResultToParams(match, names) {
	  if (names.length === 0) return null;
	  if (!match) return null;
	  return match.slice(1, match.length).reduce(function (params, value, index) {
	    if (params === null) params = {};
	    params[names[index]] = value;
	    return params;
	  }, null);
	}
	
	function replaceDynamicURLParts(route) {
	  var paramNames = [],
	      regexp;
	
	  if (route instanceof RegExp) {
	    regexp = route;
	  } else {
	    regexp = new RegExp(clean(route).replace(PARAMETER_REGEXP, function (full, dots, name) {
	      paramNames.push(name);
	      return REPLACE_VARIABLE_REGEXP;
	    }).replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP);
	  }
	  return { regexp: regexp, paramNames: paramNames };
	}
	
	function findMatchedRoutes(url) {
	  var routes = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  return routes.map(function (route) {
	    var _replaceDynamicURLPar = replaceDynamicURLParts(route.route);
	
	    var regexp = _replaceDynamicURLPar.regexp;
	    var paramNames = _replaceDynamicURLPar.paramNames;
	
	    var match = url.match(regexp);
	    var params = regExpResultToParams(match, paramNames);
	
	    return match ? { match: match, route: route, params: params } : false;
	  }).filter(function (m) {
	    return m;
	  });
	}
	
	function match(url, routes) {
	  return findMatchedRoutes(url, routes)[0] || false;
	}
	
	function root(url, routes) {
	  var matched = findMatchedRoutes(url, routes.filter(function (route) {
	    var u = clean(route.route);
	
	    return u !== '' && u !== '*';
	  }));
	  var fallbackURL = clean(url);
	
	  if (matched.length > 0) {
	    return matched.map(function (m) {
	      return clean(url.substr(0, m.match.index));
	    }).reduce(function (root, current) {
	      return current.length < root.length ? current : root;
	    }, fallbackURL);
	  }
	  return fallbackURL;
	}
	
	function isPushStateAvailable() {
	  return !!(typeof window !== 'undefined' && window.history && window.history.pushState);
	}
	
	function Navigo(r, useHash) {
	  this._routes = [];
	  this.root = useHash && r ? r.replace(/\/$/, '/#') : r || null;
	  this._useHash = useHash;
	  this._paused = false;
	  this._destroyed = false;
	  this._lastRouteResolved = null;
	  this._notFoundHandler = null;
	  this._defaultHandler = null;
	  this._ok = !useHash && isPushStateAvailable();
	  this._listen();
	  this.updatePageLinks();
	}
	
	Navigo.prototype = {
	  helpers: {
	    match: match,
	    root: root,
	    clean: clean
	  },
	  navigate: function navigate(path, absolute) {
	    var to;
	
	    path = path || '';
	    if (this._ok) {
	      to = (!absolute ? this._getRoot() + '/' : '') + clean(path);
	      to = to.replace(/([^:])(\/{2,})/g, '$1/');
	      history[this._paused ? 'replaceState' : 'pushState']({}, '', to);
	      this.resolve();
	    } else if (typeof window !== 'undefined') {
	      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
	    }
	    return this;
	  },
	  on: function on() {
	    if (arguments.length >= 2) {
	      this._add(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
	    } else if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
	      for (var route in arguments.length <= 0 ? undefined : arguments[0]) {
	        this._add(route, (arguments.length <= 0 ? undefined : arguments[0])[route]);
	      }
	    } else if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function') {
	      this._defaultHandler = arguments.length <= 0 ? undefined : arguments[0];
	    }
	    return this;
	  },
	  notFound: function notFound(handler) {
	    this._notFoundHandler = handler;
	  },
	  resolve: function resolve(current) {
	    var handler, m;
	    var url = (current || this._cLoc()).replace(this._getRoot(), '');
	
	    if (this._paused || url === this._lastRouteResolved) return false;
	    if (this._useHash) {
	      url = url.replace(/^\/#/, '/');
	    }
	    m = match(url, this._routes);
	
	    if (m) {
	      this._lastRouteResolved = url;
	      handler = m.route.handler;
	      m.route.route instanceof RegExp ? handler.apply(undefined, _toConsumableArray(m.match.slice(1, m.match.length))) : handler(m.params);
	      return m;
	    } else if (this._defaultHandler && (url === '' || url === '/')) {
	      this._defaultHandler();
	      return true;
	    } else if (this._notFoundHandler) {
	      this._notFoundHandler();
	    }
	    return false;
	  },
	  destroy: function destroy() {
	    this._routes = [];
	    this._destroyed = true;
	    clearTimeout(this._listenningInterval);
	    typeof window !== 'undefined' ? window.onpopstate = null : null;
	  },
	  updatePageLinks: function updatePageLinks() {
	    var self = this;
	
	    if (typeof document === 'undefined') return;
	
	    this._findLinks().forEach(function (link) {
	      if (!link.hasListenerAttached) {
	        link.addEventListener('click', function (e) {
	          var location = link.getAttribute('href');
	
	          if (!self._destroyed) {
	            e.preventDefault();
	            self.navigate(clean(location));
	          }
	        });
	        link.hasListenerAttached = true;
	      }
	    });
	  },
	  generate: function generate(name) {
	    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    return this._routes.reduce(function (result, route) {
	      var key;
	
	      if (route.name === name) {
	        result = route.route;
	        for (key in data) {
	          result = result.replace(':' + key, data[key]);
	        }
	      }
	      return result;
	    }, '');
	  },
	  link: function link(path) {
	    return this._getRoot() + path;
	  },
	  pause: function pause(status) {
	    this._paused = status;
	  },
	  disableIfAPINotAvailable: function disableIfAPINotAvailable() {
	    if (!isPushStateAvailable()) {
	      this.destroy();
	    }
	  },
	  _add: function _add(route) {
	    var handler = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	    if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
	      this._routes.push({ route: route, handler: handler.uses, name: handler.as });
	    } else {
	      this._routes.push({ route: route, handler: handler });
	    }
	    return this._add;
	  },
	  _getRoot: function _getRoot() {
	    if (this.root !== null) return this.root;
	    this.root = root(this._cLoc(), this._routes);
	    return this.root;
	  },
	  _listen: function _listen() {
	    var _this = this;
	
	    if (this._ok) {
	      window.onpopstate = function () {
	        _this.resolve();
	      };
	    } else {
	      (function () {
	        var cached = _this._cLoc(),
	            current = undefined,
	            _check = undefined;
	
	        _check = function check() {
	          current = _this._cLoc();
	          if (cached !== current) {
	            cached = current;
	            _this.resolve();
	          }
	          _this._listenningInterval = setTimeout(_check, 200);
	        };
	        _check();
	      })();
	    }
	  },
	  _cLoc: function _cLoc() {
	    if (typeof window !== 'undefined') {
	      return window.location.href;
	    }
	    return '';
	  },
	  _findLinks: function _findLinks() {
	    return [].slice.call(document.querySelectorAll('[data-navigo]'));
	  }
	};
	
	exports.default = Navigo;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;

},{}],16:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var scroll=function(a){return window.scrollTo(0,a)},state=function(){return history.state?history.state.scrollPosition:0},save=function(){window.history.replaceState({scrollPosition:window.pageYOffset||window.scrollY},'')},restore=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null,b=state();b?a?a(b):scroll(b):scroll(0)},instance={get export(){return'undefined'==typeof window?{}:('scrollRestoration'in history&&(history.scrollRestoration='manual',scroll(state()),window.onbeforeunload=save),{save:save,restore:restore,state:state})}};exports.default=instance.export;
},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var run = function run(cb, args) {
  cb();
  args.length > 0 && args.shift().apply(undefined, _toConsumableArray(args));
};

var tarry = exports.tarry = function tarry(cb) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var override = 'number' === typeof args[0] ? args[0] : null;
    return 'number' === typeof override && override > -1 ? tarry(cb, override) : 'number' === typeof delay && delay > -1 ? setTimeout(function () {
      return run(cb, args);
    }, delay) : run(cb, args);
  };
};

var queue = exports.queue = function queue() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function () {
    return args.shift().apply(undefined, args);
  };
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsIi4uL3BhY2thZ2UvZGlzdC9jYWNoZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9kaXN0L2xpbmtzLmpzIiwiLi4vcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vcGFja2FnZS9kaXN0L3JlbmRlci5qcyIsIi4uL3BhY2thZ2UvZGlzdC9zdGF0ZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9jbG9zZXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbG9vcC5qcy9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL25hbm9hamF4L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL3RhcnJ5LmpzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFTO0FBQ25CLFFBQU0sT0FEYTtBQUVuQixZQUFVO0FBRlMsQ0FBVCxDQUFaOztBQUtBLE9BQU8sR0FBUCxHQUFhLEdBQWI7O0FBRUEsSUFBSSxFQUFKLENBQU8sY0FBUCxFQUF1QixVQUFDLEtBQUQ7QUFBQSxTQUFXLFFBQVEsR0FBUixDQUFZLGNBQVosRUFBNEIsS0FBNUIsQ0FBWDtBQUFBLENBQXZCO0FBQ0EsSUFBSSxFQUFKLENBQU8sYUFBUCxFQUFzQixVQUFDLEtBQUQ7QUFBQSxTQUFXLFFBQVEsR0FBUixDQUFZLGFBQVosRUFBMkIsS0FBM0IsQ0FBWDtBQUFBLENBQXRCO0FBQ0EsSUFBSSxFQUFKLENBQU8sbUJBQVAsRUFBNEIsVUFBQyxLQUFEO0FBQUEsU0FBVyxRQUFRLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxLQUFqQyxDQUFYO0FBQUEsQ0FBNUI7QUFDQSxJQUFJLEVBQUosQ0FBTyxrQkFBUCxFQUEyQixVQUFDLEtBQUQ7QUFBQSxTQUFXLFFBQVEsR0FBUixDQUFZLGtCQUFaLEVBQWdDLEtBQWhDLENBQVg7QUFBQSxDQUEzQjs7QUFFQSxJQUFJLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixnQkFBZTtBQUFBLE1BQVosS0FBWSxRQUFaLEtBQVk7O0FBQ3pDLE1BQUksT0FBTyxJQUFQLENBQVksS0FBWixDQUFKLEVBQXdCO0FBQ3RCLGFBQVMsZUFBVCxDQUF5QixTQUF6QixDQUFtQyxHQUFuQyxDQUF1QyxTQUF2QztBQUNEO0FBQ0YsQ0FKRDtBQUtBLElBQUksRUFBSixDQUFPLGtCQUFQLEVBQTJCLGlCQUFlO0FBQUEsTUFBWixLQUFZLFNBQVosS0FBWTs7QUFDeEMsTUFBSSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQUosRUFBd0I7QUFDdEIsYUFBUyxlQUFULENBQXlCLFNBQXpCLENBQW1DLE1BQW5DLENBQTBDLFNBQTFDO0FBQ0Q7QUFDRixDQUpEOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBLGFBQWEsR0FBSSxVQUFTLE9BQU8sTUFBUCxFQUFlLFNBQVMsQ0FBVCxDQUFXLENBQUMsSUFBSSxHQUFJLEVBQUosQ0FBTSxFQUFFLENBQVosQ0FBYyxFQUFFLFVBQVUsTUFBMUIsQ0FBaUMsR0FBakMsQ0FBcUMsSUFBSSxHQUFJLEVBQVIsR0FBYSxHQUFFLFVBQVUsQ0FBVixDQUFGLENBQWUsQ0FBNUIsQ0FBOEIsT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLENBQXJDLENBQXVDLENBQXZDLElBQTRDLEVBQUUsQ0FBRixFQUFLLEVBQUUsQ0FBRixDQUFqRCxFQUF1RCxNQUFPLEVBQUUsQ0FBM0ssQ0FBNEssT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQThCLFlBQTlCLENBQTJDLENBQUMsTUFBTSxDQUFDLENBQVIsQ0FBM0MsQyxDQUF1RCxRQUFRLE9BQVIsQ0FBZ0IsVUFBVSxDQUFDLEdBQUksR0FBRSxFQUFFLFVBQVUsTUFBWixFQUFtQyxJQUFLLEVBQXBCLGFBQVUsQ0FBVixDQUFwQixDQUEwQyxVQUFVLENBQVYsQ0FBMUMsR0FBTixDQUFnRSxJQUFoRSxDQUFxRSxNQUFPLGFBQVksQ0FBWixDQUFjLENBQUMsS0FBSyxTQUFXLENBQVgsQ0FBYSxDQUFDLEdBQUksR0FBRSxFQUFFLFVBQVUsTUFBWixFQUFtQyxJQUFLLEVBQXBCLGFBQVUsQ0FBVixDQUFwQixDQUEwQyxVQUFVLENBQVYsQ0FBMUMsQ0FBdUQsSUFBN0QsQ0FBa0UsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFGLENBQUYsRUFBUSxFQUFFLENBQUYsRUFBSyxLQUFqRixDQUF1RixHQUFHLEVBQUUsT0FBRixDQUFVLFNBQVMsQ0FBVCxDQUFXLENBQUMsTUFBTyxHQUFFLENBQUYsQ0FBSyxDQUFsQyxDQUFvQyxDQUFsSixDQUFtSixHQUFHLFNBQVcsQ0FBWCxDQUFhLENBQUMsR0FBSSxHQUFFLEVBQUUsVUFBVSxNQUFaLEVBQW1DLElBQUssRUFBcEIsYUFBVSxDQUFWLENBQXBCLENBQTBDLFVBQVUsQ0FBVixDQUExQyxDQUF1RCxJQUE3RCxDQUFrRSxJQUFJLEVBQUUsQ0FBRixFQUFLLEVBQUUsQ0FBRixHQUFNLENBQUMsUUFBRCxDQUFYLENBQXNCLEVBQUUsQ0FBRixFQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLENBQWhCLENBQTFCLENBQThDLENBQXBSLENBQWQsQ0FBcVMsQzs7O0FDQTVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlVBOzs7Ozs7Ozs7O0FDQUEsSUFBTSxNQUFNLFNBQU4sR0FBTSxDQUFDLEVBQUQsRUFBSyxJQUFMLEVBQWM7QUFDeEI7QUFDQSxPQUFLLE1BQUwsR0FBYyxDQUFkLElBQW1CLEtBQUssS0FBTCx1Q0FBZ0IsSUFBaEIsRUFBbkI7QUFDRCxDQUhEOztBQUtPLElBQU0sd0JBQVEsU0FBUixLQUFRLENBQUMsRUFBRDtBQUFBLE1BQUssS0FBTCx1RUFBYSxJQUFiO0FBQUEsU0FBc0IsWUFBYTtBQUFBLHNDQUFULElBQVM7QUFBVCxVQUFTO0FBQUE7O0FBQ3RELFFBQUksV0FBVyxhQUFhLE9BQU8sS0FBSyxDQUFMLENBQXBCLEdBQThCLEtBQUssQ0FBTCxDQUE5QixHQUF3QyxJQUF2RDtBQUNBLFdBQU8sYUFBYSxPQUFPLFFBQXBCLElBQWdDLFdBQVcsQ0FBQyxDQUE1QyxHQUNILE1BQU0sRUFBTixFQUFVLFFBQVYsQ0FERyxHQUVILGFBQWEsT0FBTyxLQUFwQixJQUE2QixRQUFRLENBQUMsQ0FBdEMsR0FDRSxXQUFXO0FBQUEsYUFBTSxJQUFJLEVBQUosRUFBUSxJQUFSLENBQU47QUFBQSxLQUFYLEVBQWdDLEtBQWhDLENBREYsR0FFRSxJQUFJLEVBQUosRUFBUSxJQUFSLENBSk47QUFLRCxHQVBvQjtBQUFBLENBQWQ7O0FBU0EsSUFBTSx3QkFBUSxTQUFSLEtBQVE7QUFBQSxxQ0FBSSxJQUFKO0FBQUksUUFBSjtBQUFBOztBQUFBLFNBQWE7QUFBQSxXQUFNLEtBQUssS0FBTCxvQkFBZ0IsSUFBaEIsQ0FBTjtBQUFBLEdBQWI7QUFBQSxDQUFkIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBvcGVyYXRvciBmcm9tICcuLi8uLi8uLi9wYWNrYWdlL2Rpc3QvaW5kZXguanMnXG5cbmNvbnN0IGFwcCA9IG9wZXJhdG9yKHtcbiAgcm9vdDogJyNyb290JyxcbiAgZHVyYXRpb246IDIwMCxcbn0pXG5cbndpbmRvdy5hcHAgPSBhcHBcblxuYXBwLm9uKCdyb3V0ZTpiZWZvcmUnLCAocHJvcHMpID0+IGNvbnNvbGUubG9nKCdyb3V0ZTpiZWZvcmUnLCBwcm9wcykpXG5hcHAub24oJ3JvdXRlOmFmdGVyJywgKHByb3BzKSA9PiBjb25zb2xlLmxvZygncm91dGU6YWZ0ZXInLCBwcm9wcykpXG5hcHAub24oJ3RyYW5zaXRpb246YmVmb3JlJywgKHByb3BzKSA9PiBjb25zb2xlLmxvZygndHJhbnNpdGlvbjpiZWZvcmUnLCBwcm9wcykpXG5hcHAub24oJ3RyYW5zaXRpb246YWZ0ZXInLCAocHJvcHMpID0+IGNvbnNvbGUubG9nKCd0cmFuc2l0aW9uOmFmdGVyJywgcHJvcHMpKVxuXG5hcHAub24oJ3RyYW5zaXRpb246YmVmb3JlJywgKHsgcm91dGUgfSkgPT4ge1xuICBpZiAoL3BhZ2UvLnRlc3Qocm91dGUpKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXBhZ2UnKVxuICB9XG59KVxuYXBwLm9uKCd0cmFuc2l0aW9uOmFmdGVyJywgKHsgcm91dGUgfSkgPT4ge1xuICBpZiAoL3BhZ2UvLnRlc3Qocm91dGUpKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBhZ2UnKVxuICB9XG59KVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBjYWNoZSA9IHt9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHNldDogZnVuY3Rpb24gc2V0KHJvdXRlLCByZXMpIHtcbiAgICBjYWNoZSA9IF9leHRlbmRzKHt9LCBjYWNoZSwgX2RlZmluZVByb3BlcnR5KHt9LCByb3V0ZSwgcmVzKSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gZ2V0KHJvdXRlKSB7XG4gICAgcmV0dXJuIGNhY2hlW3JvdXRlXTtcbiAgfSxcbiAgZ2V0Q2FjaGU6IGZ1bmN0aW9uIGdldENhY2hlKCkge1xuICAgIHJldHVybiBjYWNoZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgaXNEdXBlID0gZnVuY3Rpb24gaXNEdXBlKHNjcmlwdCwgZXhpc3RpbmcpIHtcbiAgdmFyIGR1cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBleGlzdGluZy5sZW5ndGg7IGkrKykge1xuICAgIHNjcmlwdC5pc0VxdWFsTm9kZShleGlzdGluZ1tpXSkgJiYgZHVwZXMucHVzaChpKTtcbiAgfVxuXG4gIHJldHVybiBkdXBlcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKG5ld0RvbSwgZXhpc3RpbmdEb20pIHtcbiAgdmFyIGV4aXN0aW5nID0gZXhpc3RpbmdEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuICB2YXIgc2NyaXB0cyA9IG5ld0RvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzRHVwZShzY3JpcHRzW2ldLCBleGlzdGluZykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgdmFyIHNyYyA9IHNjcmlwdHNbaV0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ3NyYycpO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgcy5zcmMgPSBzcmMudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHMuaW5uZXJIVE1MID0gc2NyaXB0c1tpXS5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGVsZWdhdGUgPSByZXF1aXJlKCdkZWxlZ2F0ZScpO1xuXG52YXIgX2RlbGVnYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlbGVnYXRlKTtcblxudmFyIF9vcGVyYXRvciA9IHJlcXVpcmUoJy4vb3BlcmF0b3InKTtcblxudmFyIF9vcGVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vcGVyYXRvcik7XG5cbnZhciBfdXJsID0gcmVxdWlyZSgnLi91cmwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKF9yZWYpIHtcbiAgdmFyIF9yZWYkcm9vdCA9IF9yZWYucm9vdCxcbiAgICAgIHJvb3QgPSBfcmVmJHJvb3QgPT09IHVuZGVmaW5lZCA/IGRvY3VtZW50LmJvZHkgOiBfcmVmJHJvb3QsXG4gICAgICBfcmVmJGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbixcbiAgICAgIGR1cmF0aW9uID0gX3JlZiRkdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gMCA6IF9yZWYkZHVyYXRpb24sXG4gICAgICBfcmVmJGlnbm9yZSA9IF9yZWYuaWdub3JlLFxuICAgICAgaWdub3JlID0gX3JlZiRpZ25vcmUgPT09IHVuZGVmaW5lZCA/IFtdIDogX3JlZiRpZ25vcmU7XG5cbiAgdmFyIG9wZXJhdG9yID0gbmV3IF9vcGVyYXRvcjIuZGVmYXVsdCh7XG4gICAgcm9vdDogcm9vdCxcbiAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgaWdub3JlOiBpZ25vcmVcbiAgfSk7XG5cbiAgb3BlcmF0b3Iuc2V0U3RhdGUoe1xuICAgIHJvdXRlOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoLFxuICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZVxuICB9KTtcblxuICAoMCwgX2RlbGVnYXRlMi5kZWZhdWx0KShkb2N1bWVudCwgJ2EnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBhbmNob3IgPSBlLmRlbGVnYXRlVGFyZ2V0O1xuICAgIHZhciBocmVmID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcvJztcblxuICAgIHZhciBpbnRlcm5hbCA9IF91cmwubGluay5pc1NhbWVPcmlnaW4oaHJlZik7XG4gICAgdmFyIGV4dGVybmFsID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCc7XG4gICAgdmFyIGRpc2FibGVkID0gYW5jaG9yLmNsYXNzTGlzdC5jb250YWlucygnbm8tYWpheCcpO1xuICAgIHZhciBpZ25vcmVkID0gb3BlcmF0b3IuaWdub3JlZChlLCBocmVmKTtcbiAgICB2YXIgaGFzaCA9IF91cmwubGluay5pc0hhc2goaHJlZik7XG5cbiAgICBpZiAoIWludGVybmFsIHx8IGV4dGVybmFsIHx8IGRpc2FibGVkIHx8IGlnbm9yZWQgfHwgaGFzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChfdXJsLmxpbmsuaXNTYW1lVVJMKGhyZWYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3BlcmF0b3IuZ28oaHJlZik7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaHJlZiA9IGUudGFyZ2V0LmxvY2F0aW9uLmhyZWY7XG5cbiAgICBpZiAob3BlcmF0b3IuaWdub3JlZChlLCBocmVmKSkge1xuICAgICAgaWYgKF91cmwubGluay5pc0hhc2goaHJlZikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIG9wZXJhdG9yLmdvKGhyZWYsIG51bGwsIHRydWUpO1xuICB9O1xuXG4gIHJldHVybiBvcGVyYXRvcjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxudmFyIGFjdGl2ZUxpbmtzID0gW107XG5cbnZhciB0b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGUoYm9vbCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdGl2ZUxpbmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgYWN0aXZlTGlua3NbaV0uY2xhc3NMaXN0W2Jvb2wgPyAnYWRkJyA6ICdyZW1vdmUnXSgnaXMtYWN0aXZlJyk7XG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICB0b2dnbGUoZmFsc2UpO1xuXG4gIGFjdGl2ZUxpbmtzLnNwbGljZSgwLCBhY3RpdmVMaW5rcy5sZW5ndGgpO1xuICBhY3RpdmVMaW5rcy5wdXNoLmFwcGx5KGFjdGl2ZUxpbmtzLCBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWYkPVwiJyArIHJvdXRlICsgJ1wiXScpKSkpO1xuXG4gIHRvZ2dsZSh0cnVlKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX25hbm9hamF4ID0gcmVxdWlyZSgnbmFub2FqYXgnKTtcblxudmFyIF9uYW5vYWpheDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9uYW5vYWpheCk7XG5cbnZhciBfbmF2aWdvID0gcmVxdWlyZSgnbmF2aWdvJyk7XG5cbnZhciBfbmF2aWdvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hdmlnbyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24gPSByZXF1aXJlKCdzY3JvbGwtcmVzdG9yYXRpb24nKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxSZXN0b3JhdGlvbik7XG5cbnZhciBfbG9vcCA9IHJlcXVpcmUoJ2xvb3AuanMnKTtcblxudmFyIF9sb29wMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvb3ApO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbnZhciBfbGlua3MgPSByZXF1aXJlKCcuL2xpbmtzJyk7XG5cbnZhciBfbGlua3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGlua3MpO1xuXG52YXIgX3JlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyJyk7XG5cbnZhciBfcmVuZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlbmRlcik7XG5cbnZhciBfc3RhdGUgPSByZXF1aXJlKCcuL3N0YXRlJyk7XG5cbnZhciBfc3RhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RhdGUpO1xuXG52YXIgX2NhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuXG52YXIgX2NhY2hlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhY2hlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIHJvdXRlciA9IG5ldyBfbmF2aWdvMi5kZWZhdWx0KF91cmwub3JpZ2luKTtcblxudmFyIE9wZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBPcGVyYXRvcihjb25maWcpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3BlcmF0b3IpO1xuXG4gICAgdmFyIGV2ZW50cyA9ICgwLCBfbG9vcDIuZGVmYXVsdCkoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5yZW5kZXIgPSAoMCwgX3JlbmRlcjIuZGVmYXVsdCkoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdCksIGNvbmZpZywgZXZlbnRzLmVtaXQpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBldmVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE9wZXJhdG9yLCBbe1xuICAgIGtleTogJ3N0b3AnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RhcnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRTdGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgICAgcmV0dXJuIF9zdGF0ZTIuZGVmYXVsdC5fc3RhdGU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0U3RhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRTdGF0ZShfcmVmKSB7XG4gICAgICB2YXIgcm91dGUgPSBfcmVmLnJvdXRlLFxuICAgICAgICAgIHRpdGxlID0gX3JlZi50aXRsZTtcblxuICAgICAgX3N0YXRlMi5kZWZhdWx0LnJvdXRlID0gcm91dGUgPT09ICcnID8gJy8nIDogcm91dGU7XG4gICAgICB0aXRsZSA/IF9zdGF0ZTIuZGVmYXVsdC50aXRsZSA9IHRpdGxlIDogbnVsbDtcblxuICAgICAgKDAsIF9saW5rczIuZGVmYXVsdCkoX3N0YXRlMi5kZWZhdWx0LnJvdXRlKTtcblxuICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnbycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdvKGhyZWYpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIHZhciByZXNvbHZlID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICBpZiAoX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIGNhbGxiYWNrKHRpdGxlKSB7XG4gICAgICAgIHZhciByZXMgPSB7XG4gICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgIHJvdXRlOiByb3V0ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc29sdmUgPyByb3V0ZXIucmVzb2x2ZShyb3V0ZSkgOiByb3V0ZXIubmF2aWdhdGUocm91dGUpO1xuXG4gICAgICAgIF90aGlzLnNldFN0YXRlKHJlcyk7XG5cbiAgICAgICAgX3RoaXMuZW1pdCgncm91dGU6YWZ0ZXInLCByZXMpO1xuXG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfdXJsLnNhbml0aXplKShocmVmKTtcblxuICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnNhdmUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhY2hlZCA9IF9jYWNoZTIuZGVmYXVsdC5nZXQocm91dGUpO1xuXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihyb3V0ZSwgY2FjaGVkLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdCgncm91dGU6YmVmb3JlJywgeyByb3V0ZTogcm91dGUgfSk7XG5cbiAgICAgIHRoaXMuZ2V0KHJvdXRlLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KHJvdXRlLCBjYikge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBfbmFub2FqYXgyLmRlZmF1bHQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogX3VybC5vcmlnaW4gKyAnLycgKyByb3V0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHN0YXR1cywgcmVzLCByZXEpIHtcbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPCAyMDAgfHwgcmVxLnN0YXR1cyA+IDMwMCAmJiByZXEuc3RhdHVzICE9PSAzMDQpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBfdXJsLm9yaWdpbiArICcvJyArIF9zdGF0ZTIuZGVmYXVsdC5wcmV2LnJvdXRlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jYWNoZTIuZGVmYXVsdC5zZXQocm91dGUsIHJlcS5yZXNwb25zZSk7XG5cbiAgICAgICAgX3RoaXMyLnJlbmRlcihyb3V0ZSwgcmVxLnJlc3BvbnNlLCBjYik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdwdXNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHVzaCgpIHtcbiAgICAgIHZhciByb3V0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciB0aXRsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX3N0YXRlMi5kZWZhdWx0LnRpdGxlO1xuXG4gICAgICBpZiAoIXJvdXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUocm91dGUpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJvdXRlOiByb3V0ZSwgdGl0bGU6IHRpdGxlIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2lnbm9yZWQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpZ25vcmVkKGV2ZW50LCBocmVmKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIHJvdXRlID0gKDAsIF91cmwuc2FuaXRpemUpKGhyZWYpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuaWdub3JlLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0KSkge1xuICAgICAgICAgIHZhciByZXMgPSB0WzFdKHJvdXRlKTtcblxuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIF90aGlzMy5lbWl0KHRbMF0sIHtcbiAgICAgICAgICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0KHJvdXRlKTtcbiAgICAgICAgfVxuICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gT3BlcmF0b3I7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE9wZXJhdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90YXJyeSA9IHJlcXVpcmUoJ3RhcnJ5LmpzJyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24gPSByZXF1aXJlKCdzY3JvbGwtcmVzdG9yYXRpb24nKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxSZXN0b3JhdGlvbik7XG5cbnZhciBfZXZhbCA9IHJlcXVpcmUoJy4vZXZhbC5qcycpO1xuXG52YXIgX2V2YWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXZhbCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBwYXJzZXIgPSBuZXcgd2luZG93LkRPTVBhcnNlcigpO1xuXG52YXIgcGFyc2VSZXNwb25zZSA9IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoaHRtbCkge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJyk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAocGFnZSwgX3JlZiwgZW1pdCkge1xuICB2YXIgZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uLFxuICAgICAgcm9vdCA9IF9yZWYucm9vdDtcbiAgcmV0dXJuIGZ1bmN0aW9uIChyb3V0ZSwgbWFya3VwLCBjYikge1xuICAgIHZhciByZXMgPSBwYXJzZVJlc3BvbnNlKG1hcmt1cCk7XG4gICAgdmFyIHRpdGxlID0gcmVzLnRpdGxlO1xuXG4gICAgdmFyIHN0YXJ0ID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgZW1pdCgndHJhbnNpdGlvbjpiZWZvcmUnLCB7IHJvdXRlOiByb3V0ZSB9KTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy10cmFuc2l0aW9uaW5nJyk7XG4gICAgICBwYWdlLnN0eWxlLmhlaWdodCA9IHBhZ2UuY2xpZW50SGVpZ2h0ICsgJ3B4JztcbiAgICB9KTtcblxuICAgIHZhciByZW5kZXIgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBwYWdlLmlubmVySFRNTCA9IHJlcy5xdWVyeVNlbGVjdG9yKHJvb3QpLmlubmVySFRNTDtcbiAgICAgICgwLCBfZXZhbDIuZGVmYXVsdCkocmVzLCBkb2N1bWVudCk7XG4gICAgICBfc2Nyb2xsUmVzdG9yYXRpb24yLmRlZmF1bHQucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGVuZCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YWZ0ZXInLCB7IHJvdXRlOiByb3V0ZSB9KTtcbiAgICAgIGNiKHRpdGxlKTtcbiAgICAgIHBhZ2Uuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgIH0pO1xuXG4gICAgKDAsIF90YXJyeS5xdWV1ZSkoc3RhcnQoMCksIHJlbmRlcihkdXJhdGlvbiksIGVuZCgwKSkoKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBwYXVzZWQ6IGZhbHNlLFxuICBfc3RhdGU6IHtcbiAgICByb3V0ZTogJycsXG4gICAgdGl0bGU6ICcnLFxuICAgIHByZXY6IHtcbiAgICAgIHJvdXRlOiAnLycsXG4gICAgICB0aXRsZTogJydcbiAgICB9XG4gIH0sXG4gIGdldCByb3V0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucm91dGU7XG4gIH0sXG4gIHNldCByb3V0ZShsb2MpIHtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnJvdXRlID0gdGhpcy5yb3V0ZTtcbiAgICB0aGlzLl9zdGF0ZS5yb3V0ZSA9IGxvYztcbiAgfSxcbiAgZ2V0IHRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS50aXRsZTtcbiAgfSxcbiAgc2V0IHRpdGxlKHZhbCkge1xuICAgIHRoaXMuX3N0YXRlLnByZXYudGl0bGUgPSB0aGlzLnRpdGxlO1xuICAgIHRoaXMuX3N0YXRlLnRpdGxlID0gdmFsO1xuICB9LFxuICBnZXQgcHJldigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucHJldjtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZ2V0T3JpZ2luID0gZnVuY3Rpb24gZ2V0T3JpZ2luKGxvY2F0aW9uKSB7XG4gIHZhciBwcm90b2NvbCA9IGxvY2F0aW9uLnByb3RvY29sLFxuICAgICAgaG9zdCA9IGxvY2F0aW9uLmhvc3Q7XG5cbiAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArIGhvc3Q7XG59O1xuXG52YXIgcGFyc2VVUkwgPSBmdW5jdGlvbiBwYXJzZVVSTCh1cmwpIHtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGEuaHJlZiA9IHVybDtcbiAgcmV0dXJuIGE7XG59O1xuXG52YXIgb3JpZ2luID0gZXhwb3J0cy5vcmlnaW4gPSBnZXRPcmlnaW4od2luZG93LmxvY2F0aW9uKTtcblxudmFyIG9yaWdpblJlZ0V4ID0gbmV3IFJlZ0V4cChvcmlnaW4pO1xuXG52YXIgc2FuaXRpemUgPSBleHBvcnRzLnNhbml0aXplID0gZnVuY3Rpb24gc2FuaXRpemUodXJsKSB7XG4gIHZhciByb3V0ZSA9IHVybC5yZXBsYWNlKG9yaWdpblJlZ0V4LCAnJyk7XG4gIHJldHVybiByb3V0ZS5tYXRjaCgvXlxcLy8pID8gcm91dGUucmVwbGFjZSgvXFwvezF9LywgJycpIDogcm91dGU7XG59O1xuXG52YXIgbGluayA9IGV4cG9ydHMubGluayA9IHtcbiAgaXNTYW1lT3JpZ2luOiBmdW5jdGlvbiBpc1NhbWVPcmlnaW4oaHJlZikge1xuICAgIHJldHVybiBvcmlnaW4gPT09IGdldE9yaWdpbihwYXJzZVVSTChocmVmKSk7XG4gIH0sXG4gIGlzSGFzaDogZnVuY3Rpb24gaXNIYXNoKGhyZWYpIHtcbiAgICByZXR1cm4gKC8jLy50ZXN0KGhyZWYpXG4gICAgKTtcbiAgfSxcbiAgaXNTYW1lVVJMOiBmdW5jdGlvbiBpc1NhbWVVUkwoaHJlZikge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uc2VhcmNoID09PSBwYXJzZVVSTChocmVmKS5zZWFyY2ggJiYgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBwYXJzZVVSTChocmVmKS5wYXRobmFtZTtcbiAgfVxufTsiLCJ2YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IsIGNoZWNrWW9TZWxmKSB7XHJcbiAgdmFyIHBhcmVudCA9IGNoZWNrWW9TZWxmID8gZWxlbWVudCA6IGVsZW1lbnQucGFyZW50Tm9kZVxyXG5cclxuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gZG9jdW1lbnQpIHtcclxuICAgIGlmIChtYXRjaGVzKHBhcmVudCwgc2VsZWN0b3IpKSByZXR1cm4gcGFyZW50O1xyXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGVcclxuICB9XHJcbn1cclxuIiwidmFyIGNsb3Nlc3QgPSByZXF1aXJlKCdjbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBsaXN0ZW5lckZuID0gbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEZpbmRzIGNsb3Nlc3QgbWF0Y2ggYW5kIGludm9rZXMgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGxpc3RlbmVyKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGUuZGVsZWdhdGVUYXJnZXQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZWxlbWVudCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCJcInVzZSBzdHJpY3RcIjt2YXIgX2V4dGVuZHM9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKWZvcih2YXIgZCBpbiBjPWFyZ3VtZW50c1tiXSxjKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjLGQpJiYoYVtkXT1jW2RdKTtyZXR1cm4gYX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7ZXhwb3J0cy5kZWZhdWx0PWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOnt9LGI9e307cmV0dXJuIF9leHRlbmRzKHt9LGEse2VtaXQ6ZnVuY3Rpb24gZChmKXt2YXIgZz0xPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1sxXSE9PXZvaWQgMD9hcmd1bWVudHNbMV06bnVsbCxoPSEhYltmXSYmYltmXS5xdWV1ZTtoJiZoLmZvckVhY2goZnVuY3Rpb24oail7cmV0dXJuIGooZyl9KX0sb246ZnVuY3Rpb24gYyhmKXt2YXIgZz0xPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1sxXSE9PXZvaWQgMD9hcmd1bWVudHNbMV06bnVsbDtnJiYoYltmXT1iW2ZdfHx7cXVldWU6W119LGJbZl0ucXVldWUucHVzaChnKSl9fSl9OyIsIlxyXG4vKipcclxuICogRWxlbWVudCBwcm90b3R5cGUuXHJcbiAqL1xyXG5cclxudmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XHJcblxyXG4vKipcclxuICogVmVuZG9yIGZ1bmN0aW9uLlxyXG4gKi9cclxuXHJcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4vKipcclxuICogRXhwb3NlIGBtYXRjaCgpYC5cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoO1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cclxuICpcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcclxuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcclxuICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcclxuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufSIsIi8vIEJlc3QgcGxhY2UgdG8gZmluZCBpbmZvcm1hdGlvbiBvbiBYSFIgZmVhdHVyZXMgaXM6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3RcblxudmFyIHJlcWZpZWxkcyA9IFtcbiAgJ3Jlc3BvbnNlVHlwZScsICd3aXRoQ3JlZGVudGlhbHMnLCAndGltZW91dCcsICdvbnByb2dyZXNzJ1xuXVxuXG4vLyBTaW1wbGUgYW5kIHNtYWxsIGFqYXggZnVuY3Rpb25cbi8vIFRha2VzIGEgcGFyYW1ldGVycyBvYmplY3QgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb25cbi8vIFBhcmFtZXRlcnM6XG4vLyAgLSB1cmw6IHN0cmluZywgcmVxdWlyZWRcbi8vICAtIGhlYWRlcnM6IG9iamVjdCBvZiBge2hlYWRlcl9uYW1lOiBoZWFkZXJfdmFsdWUsIC4uLn1gXG4vLyAgLSBib2R5OlxuLy8gICAgICArIHN0cmluZyAoc2V0cyBjb250ZW50IHR5cGUgdG8gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgaWYgbm90IHNldCBpbiBoZWFkZXJzKVxuLy8gICAgICArIEZvcm1EYXRhIChkb2Vzbid0IHNldCBjb250ZW50IHR5cGUgc28gdGhhdCBicm93c2VyIHdpbGwgc2V0IGFzIGFwcHJvcHJpYXRlKVxuLy8gIC0gbWV0aG9kOiAnR0VUJywgJ1BPU1QnLCBldGMuIERlZmF1bHRzIHRvICdHRVQnIG9yICdQT1NUJyBiYXNlZCBvbiBib2R5XG4vLyAgLSBjb3JzOiBJZiB5b3VyIHVzaW5nIGNyb3NzLW9yaWdpbiwgeW91IHdpbGwgbmVlZCB0aGlzIHRydWUgZm9yIElFOC05XG4vL1xuLy8gVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgb250byB0aGUgeGhyIG9iamVjdC5cbi8vIElNUE9SVEFOVCBOT1RFOiBUaGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb21wYXRpYmlsaXR5IGNoZWNraW5nLlxuLy8gIC0gcmVzcG9uc2VUeXBlOiBzdHJpbmcsIHZhcmlvdXMgY29tcGF0YWJpbGl0eSwgc2VlIHhociBkb2NzIGZvciBlbnVtIG9wdGlvbnNcbi8vICAtIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbiwgSUUxMCssIENPUlMgb25seVxuLy8gIC0gdGltZW91dDogbG9uZywgbXMgdGltZW91dCwgSUU4K1xuLy8gIC0gb25wcm9ncmVzczogY2FsbGJhY2ssIElFMTArXG4vL1xuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gcHJvdG90eXBlOlxuLy8gIC0gc3RhdHVzQ29kZSBmcm9tIHJlcXVlc3Rcbi8vICAtIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlc3BvbnNlVHlwZSBzZXQgYW5kIHN1cHBvcnRlZCBieSBicm93c2VyLCB0aGlzIGlzIGFuIG9iamVjdCBvZiBzb21lIHR5cGUgKHNlZSBkb2NzKVxuLy8gICAgKyBvdGhlcndpc2UgaWYgcmVxdWVzdCBjb21wbGV0ZWQsIHRoaXMgaXMgdGhlIHN0cmluZyB0ZXh0IG9mIHRoZSByZXNwb25zZVxuLy8gICAgKyBpZiByZXF1ZXN0IGlzIGFib3J0ZWQsIHRoaXMgaXMgXCJBYm9ydFwiXG4vLyAgICArIGlmIHJlcXVlc3QgdGltZXMgb3V0LCB0aGlzIGlzIFwiVGltZW91dFwiXG4vLyAgICArIGlmIHJlcXVlc3QgZXJyb3JzIGJlZm9yZSBjb21wbGV0aW5nIChwcm9iYWJseSBhIENPUlMgaXNzdWUpLCB0aGlzIGlzIFwiRXJyb3JcIlxuLy8gIC0gcmVxdWVzdCBvYmplY3Rcbi8vXG4vLyBSZXR1cm5zIHRoZSByZXF1ZXN0IG9iamVjdC4gU28geW91IGNhbiBjYWxsIC5hYm9ydCgpIG9yIG90aGVyIG1ldGhvZHNcbi8vXG4vLyBERVBSRUNBVElPTlM6XG4vLyAgLSBQYXNzaW5nIGEgc3RyaW5nIGluc3RlYWQgb2YgdGhlIHBhcmFtcyBvYmplY3QgaGFzIGJlZW4gcmVtb3ZlZCFcbi8vXG5leHBvcnRzLmFqYXggPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAvLyBBbnkgdmFyaWFibGUgdXNlZCBtb3JlIHRoYW4gb25jZSBpcyB2YXInZCBoZXJlIGJlY2F1c2VcbiAgLy8gbWluaWZpY2F0aW9uIHdpbGwgbXVuZ2UgdGhlIHZhcmlhYmxlcyB3aGVyZWFzIGl0IGNhbid0IG11bmdlXG4gIC8vIHRoZSBvYmplY3QgYWNjZXNzLlxuICB2YXIgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzIHx8IHt9XG4gICAgLCBib2R5ID0gcGFyYW1zLmJvZHlcbiAgICAsIG1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgKGJvZHkgPyAnUE9TVCcgOiAnR0VUJylcbiAgICAsIGNhbGxlZCA9IGZhbHNlXG5cbiAgdmFyIHJlcSA9IGdldFJlcXVlc3QocGFyYW1zLmNvcnMpXG5cbiAgZnVuY3Rpb24gY2Ioc3RhdHVzQ29kZSwgcmVzcG9uc2VUZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IHN0YXR1c0NvZGUgOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICByZXEuc3RhdHVzID09PSAwID8gXCJFcnJvclwiIDogKHJlcS5yZXNwb25zZSB8fCByZXEucmVzcG9uc2VUZXh0IHx8IHJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgIHJlcSlcbiAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSlcblxuICB2YXIgc3VjY2VzcyA9IHJlcS5vbmxvYWQgPSBjYigyMDApXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSBzdWNjZXNzKClcbiAgfVxuICByZXEub25lcnJvciA9IGNiKG51bGwsICdFcnJvcicpXG4gIHJlcS5vbnRpbWVvdXQgPSBjYihudWxsLCAnVGltZW91dCcpXG4gIHJlcS5vbmFib3J0ID0gY2IobnVsbCwgJ0Fib3J0JylcblxuICBpZiAoYm9keSkge1xuICAgIHNldERlZmF1bHQoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKVxuXG4gICAgaWYgKCFnbG9iYWwuRm9ybURhdGEgfHwgIShib2R5IGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSkge1xuICAgICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcWZpZWxkcy5sZW5ndGgsIGZpZWxkOyBpIDwgbGVuOyBpKyspIHtcbiAgICBmaWVsZCA9IHJlcWZpZWxkc1tpXVxuICAgIGlmIChwYXJhbXNbZmllbGRdICE9PSB1bmRlZmluZWQpXG4gICAgICByZXFbZmllbGRdID0gcGFyYW1zW2ZpZWxkXVxuICB9XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gaGVhZGVycylcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgaGVhZGVyc1tmaWVsZF0pXG5cbiAgcmVxLnNlbmQoYm9keSlcblxuICByZXR1cm4gcmVxXG59XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoY29ycykge1xuICAvLyBYRG9tYWluUmVxdWVzdCBpcyBvbmx5IHdheSB0byBkbyBDT1JTIGluIElFIDggYW5kIDlcbiAgLy8gQnV0IFhEb21haW5SZXF1ZXN0IGlzbid0IHN0YW5kYXJkcy1jb21wYXRpYmxlXG4gIC8vIE5vdGFibHksIGl0IGRvZXNuJ3QgYWxsb3cgY29va2llcyB0byBiZSBzZW50IG9yIHNldCBieSBzZXJ2ZXJzXG4gIC8vIElFIDEwKyBpcyBzdGFuZGFyZHMtY29tcGF0aWJsZSBpbiBpdHMgWE1MSHR0cFJlcXVlc3RcbiAgLy8gYnV0IElFIDEwIGNhbiBzdGlsbCBoYXZlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB1c2UgaXRcbiAgaWYgKGNvcnMgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICEvTVNJRSAxLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3RcbiAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdClcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHQob2JqLCBrZXksIHZhbHVlKSB7XG4gIG9ialtrZXldID0gb2JqW2tleV0gfHwgdmFsdWVcbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiTmF2aWdvXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdHZhciBQQVJBTUVURVJfUkVHRVhQID0gLyhbOipdKShcXHcrKS9nO1xuXHR2YXIgV0lMRENBUkRfUkVHRVhQID0gL1xcKi9nO1xuXHR2YXIgUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFAgPSAnKFteXFwvXSspJztcblx0dmFyIFJFUExBQ0VfV0lMRENBUkQgPSAnKD86LiopJztcblx0dmFyIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCA9ICcoPzpcXC98JCknO1xuXHRcblx0ZnVuY3Rpb24gY2xlYW4ocykge1xuXHQgIGlmIChzIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gcztcblx0ICByZXR1cm4gcy5yZXBsYWNlKC9cXC8rJC8sICcnKS5yZXBsYWNlKC9eXFwvKy8sICcvJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlZ0V4cFJlc3VsdFRvUGFyYW1zKG1hdGNoLCBuYW1lcykge1xuXHQgIGlmIChuYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHQgIGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuXHQgIHJldHVybiBtYXRjaC5zbGljZSgxLCBtYXRjaC5sZW5ndGgpLnJlZHVjZShmdW5jdGlvbiAocGFyYW1zLCB2YWx1ZSwgaW5kZXgpIHtcblx0ICAgIGlmIChwYXJhbXMgPT09IG51bGwpIHBhcmFtcyA9IHt9O1xuXHQgICAgcGFyYW1zW25hbWVzW2luZGV4XV0gPSB2YWx1ZTtcblx0ICAgIHJldHVybiBwYXJhbXM7XG5cdCAgfSwgbnVsbCk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUpIHtcblx0ICB2YXIgcGFyYW1OYW1lcyA9IFtdLFxuXHQgICAgICByZWdleHA7XG5cdFxuXHQgIGlmIChyb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHQgICAgcmVnZXhwID0gcm91dGU7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoY2xlYW4ocm91dGUpLnJlcGxhY2UoUEFSQU1FVEVSX1JFR0VYUCwgZnVuY3Rpb24gKGZ1bGwsIGRvdHMsIG5hbWUpIHtcblx0ICAgICAgcGFyYW1OYW1lcy5wdXNoKG5hbWUpO1xuXHQgICAgICByZXR1cm4gUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFA7XG5cdCAgICB9KS5yZXBsYWNlKFdJTERDQVJEX1JFR0VYUCwgUkVQTEFDRV9XSUxEQ0FSRCkgKyBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFApO1xuXHQgIH1cblx0ICByZXR1cm4geyByZWdleHA6IHJlZ2V4cCwgcGFyYW1OYW1lczogcGFyYW1OYW1lcyB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwpIHtcblx0ICB2YXIgcm91dGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHJldHVybiByb3V0ZXMubWFwKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIF9yZXBsYWNlRHluYW1pY1VSTFBhciA9IHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHZhciByZWdleHAgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucmVnZXhwO1xuXHQgICAgdmFyIHBhcmFtTmFtZXMgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucGFyYW1OYW1lcztcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXhwKTtcblx0ICAgIHZhciBwYXJhbXMgPSByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgcGFyYW1OYW1lcyk7XG5cdFxuXHQgICAgcmV0dXJuIG1hdGNoID8geyBtYXRjaDogbWF0Y2gsIHJvdXRlOiByb3V0ZSwgcGFyYW1zOiBwYXJhbXMgfSA6IGZhbHNlO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbiAobSkge1xuXHQgICAgcmV0dXJuIG07XG5cdCAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIG1hdGNoKHVybCwgcm91dGVzKSB7XG5cdCAgcmV0dXJuIGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzKVswXSB8fCBmYWxzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcm9vdCh1cmwsIHJvdXRlcykge1xuXHQgIHZhciBtYXRjaGVkID0gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIHUgPSBjbGVhbihyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgcmV0dXJuIHUgIT09ICcnICYmIHUgIT09ICcqJztcblx0ICB9KSk7XG5cdCAgdmFyIGZhbGxiYWNrVVJMID0gY2xlYW4odXJsKTtcblx0XG5cdCAgaWYgKG1hdGNoZWQubGVuZ3RoID4gMCkge1xuXHQgICAgcmV0dXJuIG1hdGNoZWQubWFwKGZ1bmN0aW9uIChtKSB7XG5cdCAgICAgIHJldHVybiBjbGVhbih1cmwuc3Vic3RyKDAsIG0ubWF0Y2guaW5kZXgpKTtcblx0ICAgIH0pLnJlZHVjZShmdW5jdGlvbiAocm9vdCwgY3VycmVudCkge1xuXHQgICAgICByZXR1cm4gY3VycmVudC5sZW5ndGggPCByb290Lmxlbmd0aCA/IGN1cnJlbnQgOiByb290O1xuXHQgICAgfSwgZmFsbGJhY2tVUkwpO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsbGJhY2tVUkw7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCkge1xuXHQgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBOYXZpZ28ociwgdXNlSGFzaCkge1xuXHQgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgIHRoaXMucm9vdCA9IHVzZUhhc2ggJiYgciA/IHIucmVwbGFjZSgvXFwvJC8sICcvIycpIDogciB8fCBudWxsO1xuXHQgIHRoaXMuX3VzZUhhc2ggPSB1c2VIYXNoO1xuXHQgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gbnVsbDtcblx0ICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9vayA9ICF1c2VIYXNoICYmIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCk7XG5cdCAgdGhpcy5fbGlzdGVuKCk7XG5cdCAgdGhpcy51cGRhdGVQYWdlTGlua3MoKTtcblx0fVxuXHRcblx0TmF2aWdvLnByb3RvdHlwZSA9IHtcblx0ICBoZWxwZXJzOiB7XG5cdCAgICBtYXRjaDogbWF0Y2gsXG5cdCAgICByb290OiByb290LFxuXHQgICAgY2xlYW46IGNsZWFuXG5cdCAgfSxcblx0ICBuYXZpZ2F0ZTogZnVuY3Rpb24gbmF2aWdhdGUocGF0aCwgYWJzb2x1dGUpIHtcblx0ICAgIHZhciB0bztcblx0XG5cdCAgICBwYXRoID0gcGF0aCB8fCAnJztcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB0byA9ICghYWJzb2x1dGUgPyB0aGlzLl9nZXRSb290KCkgKyAnLycgOiAnJykgKyBjbGVhbihwYXRoKTtcblx0ICAgICAgdG8gPSB0by5yZXBsYWNlKC8oW146XSkoXFwvezIsfSkvZywgJyQxLycpO1xuXHQgICAgICBoaXN0b3J5W3RoaXMuX3BhdXNlZCA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHt9LCAnJywgdG8pO1xuXHQgICAgICB0aGlzLnJlc29sdmUoKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC8jKC4qKSQvLCAnJykgKyAnIycgKyBwYXRoO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBvbjogZnVuY3Rpb24gb24oKSB7XG5cdCAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG5cdCAgICAgIHRoaXMuX2FkZChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0sIGFyZ3VtZW50cy5sZW5ndGggPD0gMSA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1sxXSk7XG5cdCAgICB9IGVsc2UgaWYgKF90eXBlb2YoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgZm9yICh2YXIgcm91dGUgaW4gYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSB7XG5cdCAgICAgICAgdGhpcy5fYWRkKHJvdXRlLCAoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKVtyb3V0ZV0pO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgbm90Rm91bmQ6IGZ1bmN0aW9uIG5vdEZvdW5kKGhhbmRsZXIpIHtcblx0ICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IGhhbmRsZXI7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKGN1cnJlbnQpIHtcblx0ICAgIHZhciBoYW5kbGVyLCBtO1xuXHQgICAgdmFyIHVybCA9IChjdXJyZW50IHx8IHRoaXMuX2NMb2MoKSkucmVwbGFjZSh0aGlzLl9nZXRSb290KCksICcnKTtcblx0XG5cdCAgICBpZiAodGhpcy5fcGF1c2VkIHx8IHVybCA9PT0gdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLl91c2VIYXNoKSB7XG5cdCAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvIy8sICcvJyk7XG5cdCAgICB9XG5cdCAgICBtID0gbWF0Y2godXJsLCB0aGlzLl9yb3V0ZXMpO1xuXHRcblx0ICAgIGlmIChtKSB7XG5cdCAgICAgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gdXJsO1xuXHQgICAgICBoYW5kbGVyID0gbS5yb3V0ZS5oYW5kbGVyO1xuXHQgICAgICBtLnJvdXRlLnJvdXRlIGluc3RhbmNlb2YgUmVnRXhwID8gaGFuZGxlci5hcHBseSh1bmRlZmluZWQsIF90b0NvbnN1bWFibGVBcnJheShtLm1hdGNoLnNsaWNlKDEsIG0ubWF0Y2gubGVuZ3RoKSkpIDogaGFuZGxlcihtLnBhcmFtcyk7XG5cdCAgICAgIHJldHVybiBtO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9kZWZhdWx0SGFuZGxlciAmJiAodXJsID09PSAnJyB8fCB1cmwgPT09ICcvJykpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIoKTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX25vdEZvdW5kSGFuZGxlcikge1xuXHQgICAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9LFxuXHQgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cdCAgICBjbGVhclRpbWVvdXQodGhpcy5fbGlzdGVubmluZ0ludGVydmFsKTtcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm9ucG9wc3RhdGUgPSBudWxsIDogbnVsbDtcblx0ICB9LFxuXHQgIHVwZGF0ZVBhZ2VMaW5rczogZnVuY3Rpb24gdXBkYXRlUGFnZUxpbmtzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdFxuXHQgICAgdGhpcy5fZmluZExpbmtzKCkuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHQgICAgICBpZiAoIWxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCkge1xuXHQgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XG5cdCAgICAgICAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZCkge1xuXHQgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIHNlbGYubmF2aWdhdGUoY2xlYW4obG9jYXRpb24pKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgICBsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShuYW1lKSB7XG5cdCAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHJldHVybiB0aGlzLl9yb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHJvdXRlKSB7XG5cdCAgICAgIHZhciBrZXk7XG5cdFxuXHQgICAgICBpZiAocm91dGUubmFtZSA9PT0gbmFtZSkge1xuXHQgICAgICAgIHJlc3VsdCA9IHJvdXRlLnJvdXRlO1xuXHQgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc6JyArIGtleSwgZGF0YVtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sICcnKTtcblx0ICB9LFxuXHQgIGxpbms6IGZ1bmN0aW9uIGxpbmsocGF0aCkge1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFJvb3QoKSArIHBhdGg7XG5cdCAgfSxcblx0ICBwYXVzZTogZnVuY3Rpb24gcGF1c2Uoc3RhdHVzKSB7XG5cdCAgICB0aGlzLl9wYXVzZWQgPSBzdGF0dXM7XG5cdCAgfSxcblx0ICBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGU6IGZ1bmN0aW9uIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZSgpIHtcblx0ICAgIGlmICghaXNQdXNoU3RhdGVBdmFpbGFibGUoKSkge1xuXHQgICAgICB0aGlzLmRlc3Ryb3koKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9hZGQ6IGZ1bmN0aW9uIF9hZGQocm91dGUpIHtcblx0ICAgIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBpZiAoKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihoYW5kbGVyKSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyLnVzZXMsIG5hbWU6IGhhbmRsZXIuYXMgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLl9hZGQ7XG5cdCAgfSxcblx0ICBfZ2V0Um9vdDogZnVuY3Rpb24gX2dldFJvb3QoKSB7XG5cdCAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSByZXR1cm4gdGhpcy5yb290O1xuXHQgICAgdGhpcy5yb290ID0gcm9vdCh0aGlzLl9jTG9jKCksIHRoaXMuX3JvdXRlcyk7XG5cdCAgICByZXR1cm4gdGhpcy5yb290O1xuXHQgIH0sXG5cdCAgX2xpc3RlbjogZnVuY3Rpb24gX2xpc3RlbigpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIF90aGlzLnJlc29sdmUoKTtcblx0ICAgICAgfTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIGNhY2hlZCA9IF90aGlzLl9jTG9jKCksXG5cdCAgICAgICAgICAgIGN1cnJlbnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgICAgIF9jaGVjayA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgICAgX2NoZWNrID0gZnVuY3Rpb24gY2hlY2soKSB7XG5cdCAgICAgICAgICBjdXJyZW50ID0gX3RoaXMuX2NMb2MoKTtcblx0ICAgICAgICAgIGlmIChjYWNoZWQgIT09IGN1cnJlbnQpIHtcblx0ICAgICAgICAgICAgY2FjaGVkID0gY3VycmVudDtcblx0ICAgICAgICAgICAgX3RoaXMucmVzb2x2ZSgpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgX3RoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCA9IHNldFRpbWVvdXQoX2NoZWNrLCAyMDApO1xuXHQgICAgICAgIH07XG5cdCAgICAgICAgX2NoZWNrKCk7XG5cdCAgICAgIH0pKCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfY0xvYzogZnVuY3Rpb24gX2NMb2MoKSB7XG5cdCAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0sXG5cdCAgX2ZpbmRMaW5rczogZnVuY3Rpb24gX2ZpbmRMaW5rcygpIHtcblx0ICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5hdmlnb10nKSk7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTmF2aWdvO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmF2aWdvLmpzLm1hcCIsIid1c2Ugc3RyaWN0JztPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywnX19lc01vZHVsZScse3ZhbHVlOiEwfSk7dmFyIHNjcm9sbD1mdW5jdGlvbihhKXtyZXR1cm4gd2luZG93LnNjcm9sbFRvKDAsYSl9LHN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGhpc3Rvcnkuc3RhdGU/aGlzdG9yeS5zdGF0ZS5zY3JvbGxQb3NpdGlvbjowfSxzYXZlPWZ1bmN0aW9uKCl7d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtzY3JvbGxQb3NpdGlvbjp3aW5kb3cucGFnZVlPZmZzZXR8fHdpbmRvdy5zY3JvbGxZfSwnJyl9LHJlc3RvcmU9ZnVuY3Rpb24oKXt2YXIgYT0wPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1swXSE9PXZvaWQgMD9hcmd1bWVudHNbMF06bnVsbCxiPXN0YXRlKCk7Yj9hP2EoYik6c2Nyb2xsKGIpOnNjcm9sbCgwKX0saW5zdGFuY2U9e2dldCBleHBvcnQoKXtyZXR1cm4ndW5kZWZpbmVkJz09dHlwZW9mIHdpbmRvdz97fTooJ3Njcm9sbFJlc3RvcmF0aW9uJ2luIGhpc3RvcnkmJihoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uPSdtYW51YWwnLHNjcm9sbChzdGF0ZSgpKSx3aW5kb3cub25iZWZvcmV1bmxvYWQ9c2F2ZSkse3NhdmU6c2F2ZSxyZXN0b3JlOnJlc3RvcmUsc3RhdGU6c3RhdGV9KX19O2V4cG9ydHMuZGVmYXVsdD1pbnN0YW5jZS5leHBvcnQ7IiwiY29uc3QgcnVuID0gKGNiLCBhcmdzKSA9PiB7XG4gIGNiKClcbiAgYXJncy5sZW5ndGggPiAwICYmIGFyZ3Muc2hpZnQoKSguLi5hcmdzKVxufVxuXG5leHBvcnQgY29uc3QgdGFycnkgPSAoY2IsIGRlbGF5ID0gbnVsbCkgPT4gKC4uLmFyZ3MpID0+IHtcbiAgbGV0IG92ZXJyaWRlID0gJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzBdID8gYXJnc1swXSA6IG51bGwgXG4gIHJldHVybiAnbnVtYmVyJyA9PT0gdHlwZW9mIG92ZXJyaWRlICYmIG92ZXJyaWRlID4gLTEgXG4gICAgPyB0YXJyeShjYiwgb3ZlcnJpZGUpIFxuICAgIDogJ251bWJlcicgPT09IHR5cGVvZiBkZWxheSAmJiBkZWxheSA+IC0xIFxuICAgICAgPyBzZXRUaW1lb3V0KCgpID0+IHJ1bihjYiwgYXJncyksIGRlbGF5KSBcbiAgICAgIDogcnVuKGNiLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgcXVldWUgPSAoLi4uYXJncykgPT4gKCkgPT4gYXJncy5zaGlmdCgpKC4uLmFyZ3MpXG4iXX0=
