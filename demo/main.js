(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _index = require('../../../package/dist/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _index2.default)({
  root: '#root',
  duration: 200
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
      cb(title);
      page.style.height = '';
      document.documentElement.classList.remove('is-transitioning');
      emit('transition:after', { route: route });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsIi4uL3BhY2thZ2UvZGlzdC9jYWNoZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9kaXN0L2xpbmtzLmpzIiwiLi4vcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vcGFja2FnZS9kaXN0L3JlbmRlci5qcyIsIi4uL3BhY2thZ2UvZGlzdC9zdGF0ZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9jbG9zZXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbG9vcC5qcy9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL25hbm9hamF4L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL3RhcnJ5LmpzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFTO0FBQ25CLFFBQU0sT0FEYTtBQUVuQixZQUFVO0FBRlMsQ0FBVCxDQUFaOztBQUtBLElBQUksRUFBSixDQUFPLG1CQUFQLEVBQTRCLGdCQUFlO0FBQUEsTUFBWixLQUFZLFFBQVosS0FBWTs7QUFDekMsTUFBSSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQUosRUFBd0I7QUFDdEIsYUFBUyxlQUFULENBQXlCLFNBQXpCLENBQW1DLEdBQW5DLENBQXVDLFNBQXZDO0FBQ0Q7QUFDRixDQUpEO0FBS0EsSUFBSSxFQUFKLENBQU8sa0JBQVAsRUFBMkIsaUJBQWU7QUFBQSxNQUFaLEtBQVksU0FBWixLQUFZOztBQUN4QyxNQUFJLE9BQU8sSUFBUCxDQUFZLEtBQVosQ0FBSixFQUF3QjtBQUN0QixhQUFTLGVBQVQsQ0FBeUIsU0FBekIsQ0FBbUMsTUFBbkMsQ0FBMEMsU0FBMUM7QUFDRDtBQUNGLENBSkQ7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQSxhQUFhLEdBQUksVUFBUyxPQUFPLE1BQVAsRUFBZSxTQUFTLENBQVQsQ0FBVyxDQUFDLElBQUksR0FBSSxFQUFKLENBQU0sRUFBRSxDQUFaLENBQWMsRUFBRSxVQUFVLE1BQTFCLENBQWlDLEdBQWpDLENBQXFDLElBQUksR0FBSSxFQUFSLEdBQWEsR0FBRSxVQUFVLENBQVYsQ0FBRixDQUFlLENBQTVCLENBQThCLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxDQUFyQyxDQUF1QyxDQUF2QyxJQUE0QyxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsQ0FBakQsRUFBdUQsTUFBTyxFQUFFLENBQTNLLENBQTRLLE9BQU8sY0FBUCxDQUFzQixPQUF0QixDQUE4QixZQUE5QixDQUEyQyxDQUFDLE1BQU0sQ0FBQyxDQUFSLENBQTNDLEMsQ0FBdUQsUUFBUSxPQUFSLENBQWdCLFVBQVUsQ0FBQyxHQUFJLEdBQUUsRUFBRSxVQUFVLE1BQVosRUFBbUMsSUFBSyxFQUFwQixhQUFVLENBQVYsQ0FBcEIsQ0FBMEMsVUFBVSxDQUFWLENBQTFDLEdBQU4sQ0FBZ0UsSUFBaEUsQ0FBcUUsTUFBTyxhQUFZLENBQVosQ0FBYyxDQUFDLEtBQUssU0FBVyxDQUFYLENBQWEsQ0FBQyxHQUFJLEdBQUUsRUFBRSxVQUFVLE1BQVosRUFBbUMsSUFBSyxFQUFwQixhQUFVLENBQVYsQ0FBcEIsQ0FBMEMsVUFBVSxDQUFWLENBQTFDLENBQXVELElBQTdELENBQWtFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRixDQUFGLEVBQVEsRUFBRSxDQUFGLEVBQUssS0FBakYsQ0FBdUYsR0FBRyxFQUFFLE9BQUYsQ0FBVSxTQUFTLENBQVQsQ0FBVyxDQUFDLE1BQU8sR0FBRSxDQUFGLENBQUssQ0FBbEMsQ0FBb0MsQ0FBbEosQ0FBbUosR0FBRyxTQUFXLENBQVgsQ0FBYSxDQUFDLEdBQUksR0FBRSxFQUFFLFVBQVUsTUFBWixFQUFtQyxJQUFLLEVBQXBCLGFBQVUsQ0FBVixDQUFwQixDQUEwQyxVQUFVLENBQVYsQ0FBMUMsQ0FBdUQsSUFBN0QsQ0FBa0UsSUFBSSxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsR0FBTSxDQUFDLFFBQUQsQ0FBWCxDQUFzQixFQUFFLENBQUYsRUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFoQixDQUExQixDQUE4QyxDQUFwUixDQUFkLENBQXFTLEM7OztBQ0E1bkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTs7Ozs7Ozs7OztBQ0FBLElBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxFQUFELEVBQUssSUFBTCxFQUFjO0FBQ3hCO0FBQ0EsT0FBSyxNQUFMLEdBQWMsQ0FBZCxJQUFtQixLQUFLLEtBQUwsdUNBQWdCLElBQWhCLEVBQW5CO0FBQ0QsQ0FIRDs7QUFLTyxJQUFNLHdCQUFRLFNBQVIsS0FBUSxDQUFDLEVBQUQ7QUFBQSxNQUFLLEtBQUwsdUVBQWEsSUFBYjtBQUFBLFNBQXNCLFlBQWE7QUFBQSxzQ0FBVCxJQUFTO0FBQVQsVUFBUztBQUFBOztBQUN0RCxRQUFJLFdBQVcsYUFBYSxPQUFPLEtBQUssQ0FBTCxDQUFwQixHQUE4QixLQUFLLENBQUwsQ0FBOUIsR0FBd0MsSUFBdkQ7QUFDQSxXQUFPLGFBQWEsT0FBTyxRQUFwQixJQUFnQyxXQUFXLENBQUMsQ0FBNUMsR0FDSCxNQUFNLEVBQU4sRUFBVSxRQUFWLENBREcsR0FFSCxhQUFhLE9BQU8sS0FBcEIsSUFBNkIsUUFBUSxDQUFDLENBQXRDLEdBQ0UsV0FBVztBQUFBLGFBQU0sSUFBSSxFQUFKLEVBQVEsSUFBUixDQUFOO0FBQUEsS0FBWCxFQUFnQyxLQUFoQyxDQURGLEdBRUUsSUFBSSxFQUFKLEVBQVEsSUFBUixDQUpOO0FBS0QsR0FQb0I7QUFBQSxDQUFkOztBQVNBLElBQU0sd0JBQVEsU0FBUixLQUFRO0FBQUEscUNBQUksSUFBSjtBQUFJLFFBQUo7QUFBQTs7QUFBQSxTQUFhO0FBQUEsV0FBTSxLQUFLLEtBQUwsb0JBQWdCLElBQWhCLENBQU47QUFBQSxHQUFiO0FBQUEsQ0FBZCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgb3BlcmF0b3IgZnJvbSAnLi4vLi4vLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzJ1xuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCcsXG4gIGR1cmF0aW9uOiAyMDBcbn0pXG5cbmFwcC5vbigndHJhbnNpdGlvbjpiZWZvcmUnLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmICgvcGFnZS8udGVzdChyb3V0ZSkpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtcGFnZScpXG4gIH1cbn0pXG5hcHAub24oJ3RyYW5zaXRpb246YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmICgvcGFnZS8udGVzdChyb3V0ZSkpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGFnZScpXG4gIH1cbn0pXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGNhY2hlID0ge307XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgc2V0OiBmdW5jdGlvbiBzZXQocm91dGUsIHJlcykge1xuICAgIGNhY2hlID0gX2V4dGVuZHMoe30sIGNhY2hlLCBfZGVmaW5lUHJvcGVydHkoe30sIHJvdXRlLCByZXMpKTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQocm91dGUpIHtcbiAgICByZXR1cm4gY2FjaGVbcm91dGVdO1xuICB9LFxuICBnZXRDYWNoZTogZnVuY3Rpb24gZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIGNhY2hlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBpc0R1cGUgPSBmdW5jdGlvbiBpc0R1cGUoc2NyaXB0LCBleGlzdGluZykge1xuICB2YXIgZHVwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGV4aXN0aW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgc2NyaXB0LmlzRXF1YWxOb2RlKGV4aXN0aW5nW2ldKSAmJiBkdXBlcy5wdXNoKGkpO1xuICB9XG5cbiAgcmV0dXJuIGR1cGVzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAobmV3RG9tLCBleGlzdGluZ0RvbSkge1xuICB2YXIgZXhpc3RpbmcgPSBleGlzdGluZ0RvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG4gIHZhciBzY3JpcHRzID0gbmV3RG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaXNEdXBlKHNjcmlwdHNbaV0sIGV4aXN0aW5nKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB2YXIgc3JjID0gc2NyaXB0c1tpXS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnc3JjJyk7XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICBzLnNyYyA9IHNyYy52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcy5pbm5lckhUTUwgPSBzY3JpcHRzW2ldLmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kZWxlZ2F0ZSA9IHJlcXVpcmUoJ2RlbGVnYXRlJyk7XG5cbnZhciBfZGVsZWdhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVsZWdhdGUpO1xuXG52YXIgX29wZXJhdG9yID0gcmVxdWlyZSgnLi9vcGVyYXRvcicpO1xuXG52YXIgX29wZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29wZXJhdG9yKTtcblxudmFyIF91cmwgPSByZXF1aXJlKCcuL3VybCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoX3JlZikge1xuICB2YXIgX3JlZiRyb290ID0gX3JlZi5yb290LFxuICAgICAgcm9vdCA9IF9yZWYkcm9vdCA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQuYm9keSA6IF9yZWYkcm9vdCxcbiAgICAgIF9yZWYkZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uLFxuICAgICAgZHVyYXRpb24gPSBfcmVmJGR1cmF0aW9uID09PSB1bmRlZmluZWQgPyAwIDogX3JlZiRkdXJhdGlvbixcbiAgICAgIF9yZWYkaWdub3JlID0gX3JlZi5pZ25vcmUsXG4gICAgICBpZ25vcmUgPSBfcmVmJGlnbm9yZSA9PT0gdW5kZWZpbmVkID8gW10gOiBfcmVmJGlnbm9yZTtcblxuICB2YXIgb3BlcmF0b3IgPSBuZXcgX29wZXJhdG9yMi5kZWZhdWx0KHtcbiAgICByb290OiByb290LFxuICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICBpZ25vcmU6IGlnbm9yZVxuICB9KTtcblxuICBvcGVyYXRvci5zZXRTdGF0ZSh7XG4gICAgcm91dGU6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gsXG4gICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlXG4gIH0pO1xuXG4gICgwLCBfZGVsZWdhdGUyLmRlZmF1bHQpKGRvY3VtZW50LCAnYScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGFuY2hvciA9IGUuZGVsZWdhdGVUYXJnZXQ7XG4gICAgdmFyIGhyZWYgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nO1xuXG4gICAgdmFyIGludGVybmFsID0gX3VybC5saW5rLmlzU2FtZU9yaWdpbihocmVmKTtcbiAgICB2YXIgZXh0ZXJuYWwgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJztcbiAgICB2YXIgZGlzYWJsZWQgPSBhbmNob3IuY2xhc3NMaXN0LmNvbnRhaW5zKCduby1hamF4Jyk7XG4gICAgdmFyIGlnbm9yZWQgPSBvcGVyYXRvci5pZ25vcmVkKGUsIGhyZWYpO1xuICAgIHZhciBoYXNoID0gX3VybC5saW5rLmlzSGFzaChocmVmKTtcblxuICAgIGlmICghaW50ZXJuYWwgfHwgZXh0ZXJuYWwgfHwgZGlzYWJsZWQgfHwgaWdub3JlZCB8fCBoYXNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKF91cmwubGluay5pc1NhbWVVUkwoaHJlZikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcGVyYXRvci5nbyhocmVmKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBocmVmID0gZS50YXJnZXQubG9jYXRpb24uaHJlZjtcblxuICAgIGlmIChvcGVyYXRvci5pZ25vcmVkKGUsIGhyZWYpKSB7XG4gICAgICBpZiAoX3VybC5saW5rLmlzSGFzaChocmVmKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxuXG4gICAgb3BlcmF0b3IuZ28oaHJlZiwgbnVsbCwgdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIG9wZXJhdG9yO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgYWN0aXZlTGlua3MgPSBbXTtcblxudmFyIHRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZShib29sKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aXZlTGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICBhY3RpdmVMaW5rc1tpXS5jbGFzc0xpc3RbYm9vbCA/ICdhZGQnIDogJ3JlbW92ZSddKCdpcy1hY3RpdmUnKTtcbiAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHJvdXRlKSB7XG4gIHRvZ2dsZShmYWxzZSk7XG5cbiAgYWN0aXZlTGlua3Muc3BsaWNlKDAsIGFjdGl2ZUxpbmtzLmxlbmd0aCk7XG4gIGFjdGl2ZUxpbmtzLnB1c2guYXBwbHkoYWN0aXZlTGlua3MsIF90b0NvbnN1bWFibGVBcnJheShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZiQ9XCInICsgcm91dGUgKyAnXCJdJykpKSk7XG5cbiAgdG9nZ2xlKHRydWUpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfbmFub2FqYXggPSByZXF1aXJlKCduYW5vYWpheCcpO1xuXG52YXIgX25hbm9hamF4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hbm9hamF4KTtcblxudmFyIF9uYXZpZ28gPSByZXF1aXJlKCduYXZpZ28nKTtcblxudmFyIF9uYXZpZ28yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmF2aWdvKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbiA9IHJlcXVpcmUoJ3Njcm9sbC1yZXN0b3JhdGlvbicpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Njcm9sbFJlc3RvcmF0aW9uKTtcblxudmFyIF9sb29wID0gcmVxdWlyZSgnbG9vcC5qcycpO1xuXG52YXIgX2xvb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9vcCk7XG5cbnZhciBfdXJsID0gcmVxdWlyZSgnLi91cmwnKTtcblxudmFyIF9saW5rcyA9IHJlcXVpcmUoJy4vbGlua3MnKTtcblxudmFyIF9saW5rczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saW5rcyk7XG5cbnZhciBfcmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcblxudmFyIF9yZW5kZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVuZGVyKTtcblxudmFyIF9zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcblxudmFyIF9zdGF0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGF0ZSk7XG5cbnZhciBfY2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5cbnZhciBfY2FjaGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FjaGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgcm91dGVyID0gbmV3IF9uYXZpZ28yLmRlZmF1bHQoX3VybC5vcmlnaW4pO1xuXG52YXIgT3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE9wZXJhdG9yKGNvbmZpZykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPcGVyYXRvcik7XG5cbiAgICB2YXIgZXZlbnRzID0gKDAsIF9sb29wMi5kZWZhdWx0KSgpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLnJlbmRlciA9ICgwLCBfcmVuZGVyMi5kZWZhdWx0KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KSwgY29uZmlnLCBldmVudHMuZW1pdCk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGV2ZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoT3BlcmF0b3IsIFt7XG4gICAga2V5OiAnc3RvcCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICBfc3RhdGUyLmRlZmF1bHQucGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzdGFydCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldFN0YXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgICByZXR1cm4gX3N0YXRlMi5kZWZhdWx0Ll9zdGF0ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRTdGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFN0YXRlKF9yZWYpIHtcbiAgICAgIHZhciByb3V0ZSA9IF9yZWYucm91dGUsXG4gICAgICAgICAgdGl0bGUgPSBfcmVmLnRpdGxlO1xuXG4gICAgICBfc3RhdGUyLmRlZmF1bHQucm91dGUgPSByb3V0ZSA9PT0gJycgPyAnLycgOiByb3V0ZTtcbiAgICAgIHRpdGxlID8gX3N0YXRlMi5kZWZhdWx0LnRpdGxlID0gdGl0bGUgOiBudWxsO1xuXG4gICAgICAoMCwgX2xpbmtzMi5kZWZhdWx0KShfc3RhdGUyLmRlZmF1bHQucm91dGUpO1xuXG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dvJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ28oaHJlZikge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICAgICAgdmFyIHJlc29sdmUgPSBhcmd1bWVudHNbMl07XG5cbiAgICAgIGlmIChfc3RhdGUyLmRlZmF1bHQucGF1c2VkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2sodGl0bGUpIHtcbiAgICAgICAgdmFyIHJlcyA9IHtcbiAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzb2x2ZSA/IHJvdXRlci5yZXNvbHZlKHJvdXRlKSA6IHJvdXRlci5uYXZpZ2F0ZShyb3V0ZSk7XG5cbiAgICAgICAgX3RoaXMuc2V0U3RhdGUocmVzKTtcblxuICAgICAgICBfdGhpcy5lbWl0KCdyb3V0ZTphZnRlcicsIHJlcyk7XG5cbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IocmVzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHJvdXRlID0gKDAsIF91cmwuc2FuaXRpemUpKGhyZWYpO1xuXG4gICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICBfc2Nyb2xsUmVzdG9yYXRpb24yLmRlZmF1bHQuc2F2ZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FjaGVkID0gX2NhY2hlMi5kZWZhdWx0LmdldChyb3V0ZSk7XG5cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKHJvdXRlLCBjYWNoZWQsIGNhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KCdyb3V0ZTpiZWZvcmUnLCB7IHJvdXRlOiByb3V0ZSB9KTtcblxuICAgICAgdGhpcy5nZXQocm91dGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQocm91dGUsIGNiKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgcmV0dXJuIF9uYW5vYWpheDIuZGVmYXVsdC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiBfdXJsLm9yaWdpbiArICcvJyArIHJvdXRlXG4gICAgICB9LCBmdW5jdGlvbiAoc3RhdHVzLCByZXMsIHJlcSkge1xuICAgICAgICBpZiAocmVxLnN0YXR1cyA8IDIwMCB8fCByZXEuc3RhdHVzID4gMzAwICYmIHJlcS5zdGF0dXMgIT09IDMwNCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IF91cmwub3JpZ2luICsgJy8nICsgX3N0YXRlMi5kZWZhdWx0LnByZXYucm91dGU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NhY2hlMi5kZWZhdWx0LnNldChyb3V0ZSwgcmVxLnJlc3BvbnNlKTtcblxuICAgICAgICBfdGhpczIucmVuZGVyKHJvdXRlLCByZXEucmVzcG9uc2UsIGNiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3B1c2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXNoKCkge1xuICAgICAgdmFyIHJvdXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgICAgdmFyIHRpdGxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfc3RhdGUyLmRlZmF1bHQudGl0bGU7XG5cbiAgICAgIGlmICghcm91dGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcm91dGU6IHJvdXRlLCB0aXRsZTogdGl0bGUgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaWdub3JlZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlnbm9yZWQoZXZlbnQsIGhyZWYpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICB2YXIgcm91dGUgPSAoMCwgX3VybC5zYW5pdGl6ZSkoaHJlZik7XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5pZ25vcmUuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHQpKSB7XG4gICAgICAgICAgdmFyIHJlcyA9IHRbMV0ocm91dGUpO1xuXG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgX3RoaXMzLmVtaXQodFswXSwge1xuICAgICAgICAgICAgICByb3V0ZTogcm91dGUsXG4gICAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHQocm91dGUpO1xuICAgICAgICB9XG4gICAgICB9KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBPcGVyYXRvcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gT3BlcmF0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3RhcnJ5ID0gcmVxdWlyZSgndGFycnkuanMnKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbiA9IHJlcXVpcmUoJ3Njcm9sbC1yZXN0b3JhdGlvbicpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Njcm9sbFJlc3RvcmF0aW9uKTtcblxudmFyIF9ldmFsID0gcmVxdWlyZSgnLi9ldmFsLmpzJyk7XG5cbnZhciBfZXZhbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ldmFsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHBhcnNlciA9IG5ldyB3aW5kb3cuRE9NUGFyc2VyKCk7XG5cbnZhciBwYXJzZVJlc3BvbnNlID0gZnVuY3Rpb24gcGFyc2VSZXNwb25zZShodG1sKSB7XG4gIHJldHVybiBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChwYWdlLCBfcmVmLCBlbWl0KSB7XG4gIHZhciBkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICByb290ID0gX3JlZi5yb290O1xuICByZXR1cm4gZnVuY3Rpb24gKHJvdXRlLCBtYXJrdXAsIGNiKSB7XG4gICAgdmFyIHJlcyA9IHBhcnNlUmVzcG9uc2UobWFya3VwKTtcbiAgICB2YXIgdGl0bGUgPSByZXMudGl0bGU7XG5cbiAgICB2YXIgc3RhcnQgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBlbWl0KCd0cmFuc2l0aW9uOmJlZm9yZScsIHsgcm91dGU6IHJvdXRlIH0pO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgIHBhZ2Uuc3R5bGUuaGVpZ2h0ID0gcGFnZS5jbGllbnRIZWlnaHQgKyAncHgnO1xuICAgIH0pO1xuXG4gICAgdmFyIHJlbmRlciA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2UuaW5uZXJIVE1MID0gcmVzLnF1ZXJ5U2VsZWN0b3Iocm9vdCkuaW5uZXJIVE1MO1xuICAgICAgKDAsIF9ldmFsMi5kZWZhdWx0KShyZXMsIGRvY3VtZW50KTtcbiAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZW5kID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgY2IodGl0bGUpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy10cmFuc2l0aW9uaW5nJyk7XG4gICAgICBlbWl0KCd0cmFuc2l0aW9uOmFmdGVyJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgfSk7XG5cbiAgICAoMCwgX3RhcnJ5LnF1ZXVlKShzdGFydCgwKSwgcmVuZGVyKGR1cmF0aW9uKSwgZW5kKDApKSgpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHBhdXNlZDogZmFsc2UsXG4gIF9zdGF0ZToge1xuICAgIHJvdXRlOiAnJyxcbiAgICB0aXRsZTogJycsXG4gICAgcHJldjoge1xuICAgICAgcm91dGU6ICcvJyxcbiAgICAgIHRpdGxlOiAnJ1xuICAgIH1cbiAgfSxcbiAgZ2V0IHJvdXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5yb3V0ZTtcbiAgfSxcbiAgc2V0IHJvdXRlKGxvYykge1xuICAgIHRoaXMuX3N0YXRlLnByZXYucm91dGUgPSB0aGlzLnJvdXRlO1xuICAgIHRoaXMuX3N0YXRlLnJvdXRlID0gbG9jO1xuICB9LFxuICBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnRpdGxlO1xuICB9LFxuICBzZXQgdGl0bGUodmFsKSB7XG4gICAgdGhpcy5fc3RhdGUucHJldi50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgdGhpcy5fc3RhdGUudGl0bGUgPSB2YWw7XG4gIH0sXG4gIGdldCBwcmV2KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5wcmV2O1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBnZXRPcmlnaW4gPSBmdW5jdGlvbiBnZXRPcmlnaW4obG9jYXRpb24pIHtcbiAgdmFyIHByb3RvY29sID0gbG9jYXRpb24ucHJvdG9jb2wsXG4gICAgICBob3N0ID0gbG9jYXRpb24uaG9zdDtcblxuICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgaG9zdDtcbn07XG5cbnZhciBwYXJzZVVSTCA9IGZ1bmN0aW9uIHBhcnNlVVJMKHVybCkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgYS5ocmVmID0gdXJsO1xuICByZXR1cm4gYTtcbn07XG5cbnZhciBvcmlnaW4gPSBleHBvcnRzLm9yaWdpbiA9IGdldE9yaWdpbih3aW5kb3cubG9jYXRpb24pO1xuXG52YXIgb3JpZ2luUmVnRXggPSBuZXcgUmVnRXhwKG9yaWdpbik7XG5cbnZhciBzYW5pdGl6ZSA9IGV4cG9ydHMuc2FuaXRpemUgPSBmdW5jdGlvbiBzYW5pdGl6ZSh1cmwpIHtcbiAgdmFyIHJvdXRlID0gdXJsLnJlcGxhY2Uob3JpZ2luUmVnRXgsICcnKTtcbiAgcmV0dXJuIHJvdXRlLm1hdGNoKC9eXFwvLykgPyByb3V0ZS5yZXBsYWNlKC9cXC97MX0vLCAnJykgOiByb3V0ZTtcbn07XG5cbnZhciBsaW5rID0gZXhwb3J0cy5saW5rID0ge1xuICBpc1NhbWVPcmlnaW46IGZ1bmN0aW9uIGlzU2FtZU9yaWdpbihocmVmKSB7XG4gICAgcmV0dXJuIG9yaWdpbiA9PT0gZ2V0T3JpZ2luKHBhcnNlVVJMKGhyZWYpKTtcbiAgfSxcbiAgaXNIYXNoOiBmdW5jdGlvbiBpc0hhc2goaHJlZikge1xuICAgIHJldHVybiAoLyMvLnRlc3QoaHJlZilcbiAgICApO1xuICB9LFxuICBpc1NhbWVVUkw6IGZ1bmN0aW9uIGlzU2FtZVVSTChocmVmKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09IHBhcnNlVVJMKGhyZWYpLnNlYXJjaCAmJiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IHBhcnNlVVJMKGhyZWYpLnBhdGhuYW1lO1xuICB9XG59OyIsInZhciBtYXRjaGVzID0gcmVxdWlyZSgnbWF0Y2hlcy1zZWxlY3RvcicpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtZW50LCBzZWxlY3RvciwgY2hlY2tZb1NlbGYpIHtcclxuICB2YXIgcGFyZW50ID0gY2hlY2tZb1NlbGYgPyBlbGVtZW50IDogZWxlbWVudC5wYXJlbnROb2RlXHJcblxyXG4gIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50ICE9PSBkb2N1bWVudCkge1xyXG4gICAgaWYgKG1hdGNoZXMocGFyZW50LCBzZWxlY3RvcikpIHJldHVybiBwYXJlbnQ7XHJcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgY2xvc2VzdCA9IHJlcXVpcmUoJ2Nsb3Nlc3QnKTtcblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gZGVsZWdhdGUoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gICAgdmFyIGxpc3RlbmVyRm4gPSBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yLCB0cnVlKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiIsIlwidXNlIHN0cmljdFwiO3ZhciBfZXh0ZW5kcz1PYmplY3QuYXNzaWdufHxmdW5jdGlvbihhKXtmb3IodmFyIGMsYj0xO2I8YXJndW1lbnRzLmxlbmd0aDtiKyspZm9yKHZhciBkIGluIGM9YXJndW1lbnRzW2JdLGMpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGMsZCkmJihhW2RdPWNbZF0pO3JldHVybiBhfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtleHBvcnRzLmRlZmF1bHQ9ZnVuY3Rpb24oKXt2YXIgYT0wPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1swXSE9PXZvaWQgMD9hcmd1bWVudHNbMF06e30sYj17fTtyZXR1cm4gX2V4dGVuZHMoe30sYSx7ZW1pdDpmdW5jdGlvbiBkKGYpe3ZhciBnPTE8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzFdIT09dm9pZCAwP2FyZ3VtZW50c1sxXTpudWxsLGg9ISFiW2ZdJiZiW2ZdLnF1ZXVlO2gmJmguZm9yRWFjaChmdW5jdGlvbihqKXtyZXR1cm4gaihnKX0pfSxvbjpmdW5jdGlvbiBjKGYpe3ZhciBnPTE8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzFdIT09dm9pZCAwP2FyZ3VtZW50c1sxXTpudWxsO2cmJihiW2ZdPWJbZl18fHtxdWV1ZTpbXX0sYltmXS5xdWV1ZS5wdXNoKGcpKX19KX07IiwiXHJcbi8qKlxyXG4gKiBFbGVtZW50IHByb3RvdHlwZS5cclxuICovXHJcblxyXG52YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcclxuXHJcbi8qKlxyXG4gKiBWZW5kb3IgZnVuY3Rpb24uXHJcbiAqL1xyXG5cclxudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbi8qKlxyXG4gKiBFeHBvc2UgYG1hdGNoKClgLlxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XHJcblxyXG4vKipcclxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xyXG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xyXG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59IiwiLy8gQmVzdCBwbGFjZSB0byBmaW5kIGluZm9ybWF0aW9uIG9uIFhIUiBmZWF0dXJlcyBpczpcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9YTUxIdHRwUmVxdWVzdFxuXG52YXIgcmVxZmllbGRzID0gW1xuICAncmVzcG9uc2VUeXBlJywgJ3dpdGhDcmVkZW50aWFscycsICd0aW1lb3V0JywgJ29ucHJvZ3Jlc3MnXG5dXG5cbi8vIFNpbXBsZSBhbmQgc21hbGwgYWpheCBmdW5jdGlvblxuLy8gVGFrZXMgYSBwYXJhbWV0ZXJzIG9iamVjdCBhbmQgYSBjYWxsYmFjayBmdW5jdGlvblxuLy8gUGFyYW1ldGVyczpcbi8vICAtIHVybDogc3RyaW5nLCByZXF1aXJlZFxuLy8gIC0gaGVhZGVyczogb2JqZWN0IG9mIGB7aGVhZGVyX25hbWU6IGhlYWRlcl92YWx1ZSwgLi4ufWBcbi8vICAtIGJvZHk6XG4vLyAgICAgICsgc3RyaW5nIChzZXRzIGNvbnRlbnQgdHlwZSB0byAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyBpZiBub3Qgc2V0IGluIGhlYWRlcnMpXG4vLyAgICAgICsgRm9ybURhdGEgKGRvZXNuJ3Qgc2V0IGNvbnRlbnQgdHlwZSBzbyB0aGF0IGJyb3dzZXIgd2lsbCBzZXQgYXMgYXBwcm9wcmlhdGUpXG4vLyAgLSBtZXRob2Q6ICdHRVQnLCAnUE9TVCcsIGV0Yy4gRGVmYXVsdHMgdG8gJ0dFVCcgb3IgJ1BPU1QnIGJhc2VkIG9uIGJvZHlcbi8vICAtIGNvcnM6IElmIHlvdXIgdXNpbmcgY3Jvc3Mtb3JpZ2luLCB5b3Ugd2lsbCBuZWVkIHRoaXMgdHJ1ZSBmb3IgSUU4LTlcbi8vXG4vLyBUaGUgZm9sbG93aW5nIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCBvbnRvIHRoZSB4aHIgb2JqZWN0LlxuLy8gSU1QT1JUQU5UIE5PVEU6IFRoZSBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGNvbXBhdGliaWxpdHkgY2hlY2tpbmcuXG4vLyAgLSByZXNwb25zZVR5cGU6IHN0cmluZywgdmFyaW91cyBjb21wYXRhYmlsaXR5LCBzZWUgeGhyIGRvY3MgZm9yIGVudW0gb3B0aW9uc1xuLy8gIC0gd2l0aENyZWRlbnRpYWxzOiBib29sZWFuLCBJRTEwKywgQ09SUyBvbmx5XG4vLyAgLSB0aW1lb3V0OiBsb25nLCBtcyB0aW1lb3V0LCBJRTgrXG4vLyAgLSBvbnByb2dyZXNzOiBjYWxsYmFjaywgSUUxMCtcbi8vXG4vLyBDYWxsYmFjayBmdW5jdGlvbiBwcm90b3R5cGU6XG4vLyAgLSBzdGF0dXNDb2RlIGZyb20gcmVxdWVzdFxuLy8gIC0gcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVzcG9uc2VUeXBlIHNldCBhbmQgc3VwcG9ydGVkIGJ5IGJyb3dzZXIsIHRoaXMgaXMgYW4gb2JqZWN0IG9mIHNvbWUgdHlwZSAoc2VlIGRvY3MpXG4vLyAgICArIG90aGVyd2lzZSBpZiByZXF1ZXN0IGNvbXBsZXRlZCwgdGhpcyBpcyB0aGUgc3RyaW5nIHRleHQgb2YgdGhlIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlcXVlc3QgaXMgYWJvcnRlZCwgdGhpcyBpcyBcIkFib3J0XCJcbi8vICAgICsgaWYgcmVxdWVzdCB0aW1lcyBvdXQsIHRoaXMgaXMgXCJUaW1lb3V0XCJcbi8vICAgICsgaWYgcmVxdWVzdCBlcnJvcnMgYmVmb3JlIGNvbXBsZXRpbmcgKHByb2JhYmx5IGEgQ09SUyBpc3N1ZSksIHRoaXMgaXMgXCJFcnJvclwiXG4vLyAgLSByZXF1ZXN0IG9iamVjdFxuLy9cbi8vIFJldHVybnMgdGhlIHJlcXVlc3Qgb2JqZWN0LiBTbyB5b3UgY2FuIGNhbGwgLmFib3J0KCkgb3Igb3RoZXIgbWV0aG9kc1xuLy9cbi8vIERFUFJFQ0FUSU9OUzpcbi8vICAtIFBhc3NpbmcgYSBzdHJpbmcgaW5zdGVhZCBvZiB0aGUgcGFyYW1zIG9iamVjdCBoYXMgYmVlbiByZW1vdmVkIVxuLy9cbmV4cG9ydHMuYWpheCA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIC8vIEFueSB2YXJpYWJsZSB1c2VkIG1vcmUgdGhhbiBvbmNlIGlzIHZhcidkIGhlcmUgYmVjYXVzZVxuICAvLyBtaW5pZmljYXRpb24gd2lsbCBtdW5nZSB0aGUgdmFyaWFibGVzIHdoZXJlYXMgaXQgY2FuJ3QgbXVuZ2VcbiAgLy8gdGhlIG9iamVjdCBhY2Nlc3MuXG4gIHZhciBoZWFkZXJzID0gcGFyYW1zLmhlYWRlcnMgfHwge31cbiAgICAsIGJvZHkgPSBwYXJhbXMuYm9keVxuICAgICwgbWV0aG9kID0gcGFyYW1zLm1ldGhvZCB8fCAoYm9keSA/ICdQT1NUJyA6ICdHRVQnKVxuICAgICwgY2FsbGVkID0gZmFsc2VcblxuICB2YXIgcmVxID0gZ2V0UmVxdWVzdChwYXJhbXMuY29ycylcblxuICBmdW5jdGlvbiBjYihzdGF0dXNDb2RlLCByZXNwb25zZVRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgY2FsbGJhY2socmVxLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gc3RhdHVzQ29kZSA6IHJlcS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgIHJlcS5zdGF0dXMgPT09IDAgPyBcIkVycm9yXCIgOiAocmVxLnJlc3BvbnNlIHx8IHJlcS5yZXNwb25zZVRleHQgfHwgcmVzcG9uc2VUZXh0KSxcbiAgICAgICAgICAgICAgICAgcmVxKVxuICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVxLm9wZW4obWV0aG9kLCBwYXJhbXMudXJsLCB0cnVlKVxuXG4gIHZhciBzdWNjZXNzID0gcmVxLm9ubG9hZCA9IGNiKDIwMClcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHN1Y2Nlc3MoKVxuICB9XG4gIHJlcS5vbmVycm9yID0gY2IobnVsbCwgJ0Vycm9yJylcbiAgcmVxLm9udGltZW91dCA9IGNiKG51bGwsICdUaW1lb3V0JylcbiAgcmVxLm9uYWJvcnQgPSBjYihudWxsLCAnQWJvcnQnKVxuXG4gIGlmIChib2R5KSB7XG4gICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpXG5cbiAgICBpZiAoIWdsb2JhbC5Gb3JtRGF0YSB8fCAhKGJvZHkgaW5zdGFuY2VvZiBnbG9iYWwuRm9ybURhdGEpKSB7XG4gICAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVxZmllbGRzLmxlbmd0aCwgZmllbGQ7IGkgPCBsZW47IGkrKykge1xuICAgIGZpZWxkID0gcmVxZmllbGRzW2ldXG4gICAgaWYgKHBhcmFtc1tmaWVsZF0gIT09IHVuZGVmaW5lZClcbiAgICAgIHJlcVtmaWVsZF0gPSBwYXJhbXNbZmllbGRdXG4gIH1cblxuICBmb3IgKHZhciBmaWVsZCBpbiBoZWFkZXJzKVxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCBoZWFkZXJzW2ZpZWxkXSlcblxuICByZXEuc2VuZChib2R5KVxuXG4gIHJldHVybiByZXFcbn1cblxuZnVuY3Rpb24gZ2V0UmVxdWVzdChjb3JzKSB7XG4gIC8vIFhEb21haW5SZXF1ZXN0IGlzIG9ubHkgd2F5IHRvIGRvIENPUlMgaW4gSUUgOCBhbmQgOVxuICAvLyBCdXQgWERvbWFpblJlcXVlc3QgaXNuJ3Qgc3RhbmRhcmRzLWNvbXBhdGlibGVcbiAgLy8gTm90YWJseSwgaXQgZG9lc24ndCBhbGxvdyBjb29raWVzIHRvIGJlIHNlbnQgb3Igc2V0IGJ5IHNlcnZlcnNcbiAgLy8gSUUgMTArIGlzIHN0YW5kYXJkcy1jb21wYXRpYmxlIGluIGl0cyBYTUxIdHRwUmVxdWVzdFxuICAvLyBidXQgSUUgMTAgY2FuIHN0aWxsIGhhdmUgYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0LCBzbyB3ZSBkb24ndCB3YW50IHRvIHVzZSBpdFxuICBpZiAoY29ycyAmJiBnbG9iYWwuWERvbWFpblJlcXVlc3QgJiYgIS9NU0lFIDEvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpXG4gICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdFxuICBpZiAoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KVxuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Rcbn1cblxuZnVuY3Rpb24gc2V0RGVmYXVsdChvYmosIGtleSwgdmFsdWUpIHtcbiAgb2JqW2tleV0gPSBvYmpba2V5XSB8fCB2YWx1ZVxufVxuIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJOYXZpZ29cIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXHRcblx0dmFyIFBBUkFNRVRFUl9SRUdFWFAgPSAvKFs6Kl0pKFxcdyspL2c7XG5cdHZhciBXSUxEQ0FSRF9SRUdFWFAgPSAvXFwqL2c7XG5cdHZhciBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUCA9ICcoW15cXC9dKyknO1xuXHR2YXIgUkVQTEFDRV9XSUxEQ0FSRCA9ICcoPzouKiknO1xuXHR2YXIgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQID0gJyg/OlxcL3wkKSc7XG5cdFxuXHRmdW5jdGlvbiBjbGVhbihzKSB7XG5cdCAgaWYgKHMgaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiBzO1xuXHQgIHJldHVybiBzLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL15cXC8rLywgJy8nKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIG5hbWVzKSB7XG5cdCAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdCAgaWYgKCFtYXRjaCkgcmV0dXJuIG51bGw7XG5cdCAgcmV0dXJuIG1hdGNoLnNsaWNlKDEsIG1hdGNoLmxlbmd0aCkucmVkdWNlKGZ1bmN0aW9uIChwYXJhbXMsIHZhbHVlLCBpbmRleCkge1xuXHQgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgcGFyYW1zID0ge307XG5cdCAgICBwYXJhbXNbbmFtZXNbaW5kZXhdXSA9IHZhbHVlO1xuXHQgICAgcmV0dXJuIHBhcmFtcztcblx0ICB9LCBudWxsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZSkge1xuXHQgIHZhciBwYXJhbU5hbWVzID0gW10sXG5cdCAgICAgIHJlZ2V4cDtcblx0XG5cdCAgaWYgKHJvdXRlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICByZWdleHAgPSByb3V0ZTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChjbGVhbihyb3V0ZSkucmVwbGFjZShQQVJBTUVURVJfUkVHRVhQLCBmdW5jdGlvbiAoZnVsbCwgZG90cywgbmFtZSkge1xuXHQgICAgICBwYXJhbU5hbWVzLnB1c2gobmFtZSk7XG5cdCAgICAgIHJldHVybiBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUDtcblx0ICAgIH0pLnJlcGxhY2UoV0lMRENBUkRfUkVHRVhQLCBSRVBMQUNFX1dJTERDQVJEKSArIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCk7XG5cdCAgfVxuXHQgIHJldHVybiB7IHJlZ2V4cDogcmVnZXhwLCBwYXJhbU5hbWVzOiBwYXJhbU5hbWVzIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZpbmRNYXRjaGVkUm91dGVzKHVybCkge1xuXHQgIHZhciByb3V0ZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgcmV0dXJuIHJvdXRlcy5tYXAoZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICB2YXIgX3JlcGxhY2VEeW5hbWljVVJMUGFyID0gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgdmFyIHJlZ2V4cCA9IF9yZXBsYWNlRHluYW1pY1VSTFBhci5yZWdleHA7XG5cdCAgICB2YXIgcGFyYW1OYW1lcyA9IF9yZXBsYWNlRHluYW1pY1VSTFBhci5wYXJhbU5hbWVzO1xuXHRcblx0ICAgIHZhciBtYXRjaCA9IHVybC5tYXRjaChyZWdleHApO1xuXHQgICAgdmFyIHBhcmFtcyA9IHJlZ0V4cFJlc3VsdFRvUGFyYW1zKG1hdGNoLCBwYXJhbU5hbWVzKTtcblx0XG5cdCAgICByZXR1cm4gbWF0Y2ggPyB7IG1hdGNoOiBtYXRjaCwgcm91dGU6IHJvdXRlLCBwYXJhbXM6IHBhcmFtcyB9IDogZmFsc2U7XG5cdCAgfSkuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG5cdCAgICByZXR1cm4gbTtcblx0ICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gbWF0Y2godXJsLCByb3V0ZXMpIHtcblx0ICByZXR1cm4gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMpWzBdIHx8IGZhbHNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByb290KHVybCwgcm91dGVzKSB7XG5cdCAgdmFyIG1hdGNoZWQgPSBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICB2YXIgdSA9IGNsZWFuKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICByZXR1cm4gdSAhPT0gJycgJiYgdSAhPT0gJyonO1xuXHQgIH0pKTtcblx0ICB2YXIgZmFsbGJhY2tVUkwgPSBjbGVhbih1cmwpO1xuXHRcblx0ICBpZiAobWF0Y2hlZC5sZW5ndGggPiAwKSB7XG5cdCAgICByZXR1cm4gbWF0Y2hlZC5tYXAoZnVuY3Rpb24gKG0pIHtcblx0ICAgICAgcmV0dXJuIGNsZWFuKHVybC5zdWJzdHIoMCwgbS5tYXRjaC5pbmRleCkpO1xuXHQgICAgfSkucmVkdWNlKGZ1bmN0aW9uIChyb290LCBjdXJyZW50KSB7XG5cdCAgICAgIHJldHVybiBjdXJyZW50Lmxlbmd0aCA8IHJvb3QubGVuZ3RoID8gY3VycmVudCA6IHJvb3Q7XG5cdCAgICB9LCBmYWxsYmFja1VSTCk7XG5cdCAgfVxuXHQgIHJldHVybiBmYWxsYmFja1VSTDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gaXNQdXNoU3RhdGVBdmFpbGFibGUoKSB7XG5cdCAgcmV0dXJuICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIE5hdmlnbyhyLCB1c2VIYXNoKSB7XG5cdCAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgdGhpcy5yb290ID0gdXNlSGFzaCAmJiByID8gci5yZXBsYWNlKC9cXC8kLywgJy8jJykgOiByIHx8IG51bGw7XG5cdCAgdGhpcy5fdXNlSGFzaCA9IHVzZUhhc2g7XG5cdCAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG5cdCAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG5cdCAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSBudWxsO1xuXHQgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX29rID0gIXVzZUhhc2ggJiYgaXNQdXNoU3RhdGVBdmFpbGFibGUoKTtcblx0ICB0aGlzLl9saXN0ZW4oKTtcblx0ICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXHR9XG5cdFxuXHROYXZpZ28ucHJvdG90eXBlID0ge1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIG1hdGNoOiBtYXRjaCxcblx0ICAgIHJvb3Q6IHJvb3QsXG5cdCAgICBjbGVhbjogY2xlYW5cblx0ICB9LFxuXHQgIG5hdmlnYXRlOiBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoLCBhYnNvbHV0ZSkge1xuXHQgICAgdmFyIHRvO1xuXHRcblx0ICAgIHBhdGggPSBwYXRoIHx8ICcnO1xuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHRvID0gKCFhYnNvbHV0ZSA/IHRoaXMuX2dldFJvb3QoKSArICcvJyA6ICcnKSArIGNsZWFuKHBhdGgpO1xuXHQgICAgICB0byA9IHRvLnJlcGxhY2UoLyhbXjpdKShcXC97Mix9KS9nLCAnJDEvJyk7XG5cdCAgICAgIGhpc3RvcnlbdGhpcy5fcGF1c2VkID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sICcnLCB0byk7XG5cdCAgICAgIHRoaXMucmVzb2x2ZSgpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyMoLiopJC8sICcnKSArICcjJyArIHBhdGg7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG9uOiBmdW5jdGlvbiBvbigpIHtcblx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcblx0ICAgICAgdGhpcy5fYWRkKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSwgYXJndW1lbnRzLmxlbmd0aCA8PSAxID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzFdKTtcblx0ICAgIH0gZWxzZSBpZiAoX3R5cGVvZihhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID09PSAnb2JqZWN0Jykge1xuXHQgICAgICBmb3IgKHZhciByb3V0ZSBpbiBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIHtcblx0ICAgICAgICB0aGlzLl9hZGQocm91dGUsIChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pW3JvdXRlXSk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBub3RGb3VuZDogZnVuY3Rpb24gbm90Rm91bmQoaGFuZGxlcikge1xuXHQgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gaGFuZGxlcjtcblx0ICB9LFxuXHQgIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoY3VycmVudCkge1xuXHQgICAgdmFyIGhhbmRsZXIsIG07XG5cdCAgICB2YXIgdXJsID0gKGN1cnJlbnQgfHwgdGhpcy5fY0xvYygpKS5yZXBsYWNlKHRoaXMuX2dldFJvb3QoKSwgJycpO1xuXHRcblx0ICAgIGlmICh0aGlzLl9wYXVzZWQgfHwgdXJsID09PSB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCkgcmV0dXJuIGZhbHNlO1xuXHQgICAgaWYgKHRoaXMuX3VzZUhhc2gpIHtcblx0ICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8jLywgJy8nKTtcblx0ICAgIH1cblx0ICAgIG0gPSBtYXRjaCh1cmwsIHRoaXMuX3JvdXRlcyk7XG5cdFxuXHQgICAgaWYgKG0pIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIGhhbmRsZXIgPSBtLnJvdXRlLmhhbmRsZXI7XG5cdCAgICAgIG0ucm91dGUucm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgPyBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KG0ubWF0Y2guc2xpY2UoMSwgbS5tYXRjaC5sZW5ndGgpKSkgOiBoYW5kbGVyKG0ucGFyYW1zKTtcblx0ICAgICAgcmV0dXJuIG07XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX2RlZmF1bHRIYW5kbGVyICYmICh1cmwgPT09ICcnIHx8IHVybCA9PT0gJy8nKSkge1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlcigpO1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fbm90Rm91bmRIYW5kbGVyKSB7XG5cdCAgICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlcigpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH0sXG5cdCAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0ICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcblx0ICAgIGNsZWFyVGltZW91dCh0aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwpO1xuXHQgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cub25wb3BzdGF0ZSA9IG51bGwgOiBudWxsO1xuXHQgIH0sXG5cdCAgdXBkYXRlUGFnZUxpbmtzOiBmdW5jdGlvbiB1cGRhdGVQYWdlTGlua3MoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHQgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcblx0XG5cdCAgICB0aGlzLl9maW5kTGlua3MoKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdCAgICAgIGlmICghbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkKSB7XG5cdCAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdCAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXHRcblx0ICAgICAgICAgIGlmICghc2VsZi5fZGVzdHJveWVkKSB7XG5cdCAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgc2VsZi5uYXZpZ2F0ZShjbGVhbihsb2NhdGlvbikpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIGxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH0sXG5cdCAgZ2VuZXJhdGU6IGZ1bmN0aW9uIGdlbmVyYXRlKG5hbWUpIHtcblx0ICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgcmV0dXJuIHRoaXMuX3JvdXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcm91dGUpIHtcblx0ICAgICAgdmFyIGtleTtcblx0XG5cdCAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBuYW1lKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gcm91dGUucm91dGU7XG5cdCAgICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJzonICsga2V5LCBkYXRhW2tleV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSwgJycpO1xuXHQgIH0sXG5cdCAgbGluazogZnVuY3Rpb24gbGluayhwYXRoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0Um9vdCgpICsgcGF0aDtcblx0ICB9LFxuXHQgIHBhdXNlOiBmdW5jdGlvbiBwYXVzZShzdGF0dXMpIHtcblx0ICAgIHRoaXMuX3BhdXNlZCA9IHN0YXR1cztcblx0ICB9LFxuXHQgIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZTogZnVuY3Rpb24gZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlKCkge1xuXHQgICAgaWYgKCFpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpKSB7XG5cdCAgICAgIHRoaXMuZGVzdHJveSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2FkZDogZnVuY3Rpb24gX2FkZChyb3V0ZSkge1xuXHQgICAgdmFyIGhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIGlmICgodHlwZW9mIGhhbmRsZXIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGhhbmRsZXIpKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIudXNlcywgbmFtZTogaGFuZGxlci5hcyB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyIH0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXMuX2FkZDtcblx0ICB9LFxuXHQgIF9nZXRSb290OiBmdW5jdGlvbiBfZ2V0Um9vdCgpIHtcblx0ICAgIGlmICh0aGlzLnJvb3QgIT09IG51bGwpIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgICB0aGlzLnJvb3QgPSByb290KHRoaXMuX2NMb2MoKSwgdGhpcy5fcm91dGVzKTtcblx0ICAgIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgfSxcblx0ICBfbGlzdGVuOiBmdW5jdGlvbiBfbGlzdGVuKCkge1xuXHQgICAgdmFyIF90aGlzID0gdGhpcztcblx0XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgX3RoaXMucmVzb2x2ZSgpO1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgY2FjaGVkID0gX3RoaXMuX2NMb2MoKSxcblx0ICAgICAgICAgICAgY3VycmVudCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICAgICAgX2NoZWNrID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgICBfY2hlY2sgPSBmdW5jdGlvbiBjaGVjaygpIHtcblx0ICAgICAgICAgIGN1cnJlbnQgPSBfdGhpcy5fY0xvYygpO1xuXHQgICAgICAgICAgaWYgKGNhY2hlZCAhPT0gY3VycmVudCkge1xuXHQgICAgICAgICAgICBjYWNoZWQgPSBjdXJyZW50O1xuXHQgICAgICAgICAgICBfdGhpcy5yZXNvbHZlKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBfdGhpcy5fbGlzdGVubmluZ0ludGVydmFsID0gc2V0VGltZW91dChfY2hlY2ssIDIwMCk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgICBfY2hlY2soKTtcblx0ICAgICAgfSkoKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9jTG9jOiBmdW5jdGlvbiBfY0xvYygpIHtcblx0ICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gJyc7XG5cdCAgfSxcblx0ICBfZmluZExpbmtzOiBmdW5jdGlvbiBfZmluZExpbmtzKCkge1xuXHQgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmF2aWdvXScpKTtcblx0ICB9XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBOYXZpZ287XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uYXZpZ28uanMubWFwIiwiJ3VzZSBzdHJpY3QnO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCdfX2VzTW9kdWxlJyx7dmFsdWU6ITB9KTt2YXIgc2Nyb2xsPWZ1bmN0aW9uKGEpe3JldHVybiB3aW5kb3cuc2Nyb2xsVG8oMCxhKX0sc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gaGlzdG9yeS5zdGF0ZT9oaXN0b3J5LnN0YXRlLnNjcm9sbFBvc2l0aW9uOjB9LHNhdmU9ZnVuY3Rpb24oKXt3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe3Njcm9sbFBvc2l0aW9uOndpbmRvdy5wYWdlWU9mZnNldHx8d2luZG93LnNjcm9sbFl9LCcnKX0scmVzdG9yZT1mdW5jdGlvbigpe3ZhciBhPTA8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzBdIT09dm9pZCAwP2FyZ3VtZW50c1swXTpudWxsLGI9c3RhdGUoKTtiP2E/YShiKTpzY3JvbGwoYik6c2Nyb2xsKDApfSxpbnN0YW5jZT17Z2V0IGV4cG9ydCgpe3JldHVybid1bmRlZmluZWQnPT10eXBlb2Ygd2luZG93P3t9Oignc2Nyb2xsUmVzdG9yYXRpb24naW4gaGlzdG9yeSYmKGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb249J21hbnVhbCcsc2Nyb2xsKHN0YXRlKCkpLHdpbmRvdy5vbmJlZm9yZXVubG9hZD1zYXZlKSx7c2F2ZTpzYXZlLHJlc3RvcmU6cmVzdG9yZSxzdGF0ZTpzdGF0ZX0pfX07ZXhwb3J0cy5kZWZhdWx0PWluc3RhbmNlLmV4cG9ydDsiLCJjb25zdCBydW4gPSAoY2IsIGFyZ3MpID0+IHtcbiAgY2IoKVxuICBhcmdzLmxlbmd0aCA+IDAgJiYgYXJncy5zaGlmdCgpKC4uLmFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCB0YXJyeSA9IChjYiwgZGVsYXkgPSBudWxsKSA9PiAoLi4uYXJncykgPT4ge1xuICBsZXQgb3ZlcnJpZGUgPSAnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0gPyBhcmdzWzBdIDogbnVsbCBcbiAgcmV0dXJuICdudW1iZXInID09PSB0eXBlb2Ygb3ZlcnJpZGUgJiYgb3ZlcnJpZGUgPiAtMSBcbiAgICA/IHRhcnJ5KGNiLCBvdmVycmlkZSkgXG4gICAgOiAnbnVtYmVyJyA9PT0gdHlwZW9mIGRlbGF5ICYmIGRlbGF5ID4gLTEgXG4gICAgICA/IHNldFRpbWVvdXQoKCkgPT4gcnVuKGNiLCBhcmdzKSwgZGVsYXkpIFxuICAgICAgOiBydW4oY2IsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBxdWV1ZSA9ICguLi5hcmdzKSA9PiAoKSA9PiBhcmdzLnNoaWZ0KCkoLi4uYXJncylcbiJdfQ==
