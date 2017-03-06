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
      break;
    }

    var src = scripts[i].attributes.getNamedItem('src');

    if (src) {
      var s = document.createElement('script');
      s.src = src.value;
      document.body.appendChild(s);
    } else {
      try {
        eval(scripts[i].innerHTML);
      } catch (e) {
        console.warn(e);
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsIi4uL3BhY2thZ2UvZGlzdC9jYWNoZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9kaXN0L2xpbmtzLmpzIiwiLi4vcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vcGFja2FnZS9kaXN0L3JlbmRlci5qcyIsIi4uL3BhY2thZ2UvZGlzdC9zdGF0ZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9jbG9zZXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbG9vcC5qcy9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL25hbm9hamF4L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL3RhcnJ5LmpzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFTO0FBQ25CLFFBQU0sT0FEYTtBQUVuQixZQUFVO0FBRlMsQ0FBVCxDQUFaOztBQUtBLElBQUksRUFBSixDQUFPLG1CQUFQLEVBQTRCLGdCQUFlO0FBQUEsTUFBWixLQUFZLFFBQVosS0FBWTs7QUFDekMsTUFBSSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQUosRUFBd0I7QUFDdEIsYUFBUyxlQUFULENBQXlCLFNBQXpCLENBQW1DLEdBQW5DLENBQXVDLFNBQXZDO0FBQ0Q7QUFDRixDQUpEO0FBS0EsSUFBSSxFQUFKLENBQU8sa0JBQVAsRUFBMkIsaUJBQWU7QUFBQSxNQUFaLEtBQVksU0FBWixLQUFZOztBQUN4QyxNQUFJLE9BQU8sSUFBUCxDQUFZLEtBQVosQ0FBSixFQUF3QjtBQUN0QixhQUFTLGVBQVQsQ0FBeUIsU0FBekIsQ0FBbUMsTUFBbkMsQ0FBMEMsU0FBMUM7QUFDRDtBQUNGLENBSkQ7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQSxhQUFhLEdBQUksVUFBUyxPQUFPLE1BQVAsRUFBZSxTQUFTLENBQVQsQ0FBVyxDQUFDLElBQUksR0FBSSxFQUFKLENBQU0sRUFBRSxDQUFaLENBQWMsRUFBRSxVQUFVLE1BQTFCLENBQWlDLEdBQWpDLENBQXFDLElBQUksR0FBSSxFQUFSLEdBQWEsR0FBRSxVQUFVLENBQVYsQ0FBRixDQUFlLENBQTVCLENBQThCLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxDQUFyQyxDQUF1QyxDQUF2QyxJQUE0QyxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsQ0FBakQsRUFBdUQsTUFBTyxFQUFFLENBQTNLLENBQTRLLE9BQU8sY0FBUCxDQUFzQixPQUF0QixDQUE4QixZQUE5QixDQUEyQyxDQUFDLE1BQU0sQ0FBQyxDQUFSLENBQTNDLEMsQ0FBdUQsUUFBUSxPQUFSLENBQWdCLFVBQVUsQ0FBQyxHQUFJLEdBQUUsRUFBRSxVQUFVLE1BQVosRUFBbUMsSUFBSyxFQUFwQixhQUFVLENBQVYsQ0FBcEIsQ0FBMEMsVUFBVSxDQUFWLENBQTFDLEdBQU4sQ0FBZ0UsSUFBaEUsQ0FBcUUsTUFBTyxhQUFZLENBQVosQ0FBYyxDQUFDLEtBQUssU0FBVyxDQUFYLENBQWEsQ0FBQyxHQUFJLEdBQUUsRUFBRSxVQUFVLE1BQVosRUFBbUMsSUFBSyxFQUFwQixhQUFVLENBQVYsQ0FBcEIsQ0FBMEMsVUFBVSxDQUFWLENBQTFDLENBQXVELElBQTdELENBQWtFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRixDQUFGLEVBQVEsRUFBRSxDQUFGLEVBQUssS0FBakYsQ0FBdUYsR0FBRyxFQUFFLE9BQUYsQ0FBVSxTQUFTLENBQVQsQ0FBVyxDQUFDLE1BQU8sR0FBRSxDQUFGLENBQUssQ0FBbEMsQ0FBb0MsQ0FBbEosQ0FBbUosR0FBRyxTQUFXLENBQVgsQ0FBYSxDQUFDLEdBQUksR0FBRSxFQUFFLFVBQVUsTUFBWixFQUFtQyxJQUFLLEVBQXBCLGFBQVUsQ0FBVixDQUFwQixDQUEwQyxVQUFVLENBQVYsQ0FBMUMsQ0FBdUQsSUFBN0QsQ0FBa0UsSUFBSSxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsR0FBTSxDQUFDLFFBQUQsQ0FBWCxDQUFzQixFQUFFLENBQUYsRUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFoQixDQUExQixDQUE4QyxDQUFwUixDQUFkLENBQXFTLEM7OztBQ0E1bkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTs7Ozs7Ozs7OztBQ0FBLElBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxFQUFELEVBQUssSUFBTCxFQUFjO0FBQ3hCO0FBQ0EsT0FBSyxNQUFMLEdBQWMsQ0FBZCxJQUFtQixLQUFLLEtBQUwsdUNBQWdCLElBQWhCLEVBQW5CO0FBQ0QsQ0FIRDs7QUFLTyxJQUFNLHdCQUFRLFNBQVIsS0FBUSxDQUFDLEVBQUQ7QUFBQSxNQUFLLEtBQUwsdUVBQWEsSUFBYjtBQUFBLFNBQXNCLFlBQWE7QUFBQSxzQ0FBVCxJQUFTO0FBQVQsVUFBUztBQUFBOztBQUN0RCxRQUFJLFdBQVcsYUFBYSxPQUFPLEtBQUssQ0FBTCxDQUFwQixHQUE4QixLQUFLLENBQUwsQ0FBOUIsR0FBd0MsSUFBdkQ7QUFDQSxXQUFPLGFBQWEsT0FBTyxRQUFwQixJQUFnQyxXQUFXLENBQUMsQ0FBNUMsR0FDSCxNQUFNLEVBQU4sRUFBVSxRQUFWLENBREcsR0FFSCxhQUFhLE9BQU8sS0FBcEIsSUFBNkIsUUFBUSxDQUFDLENBQXRDLEdBQ0UsV0FBVztBQUFBLGFBQU0sSUFBSSxFQUFKLEVBQVEsSUFBUixDQUFOO0FBQUEsS0FBWCxFQUFnQyxLQUFoQyxDQURGLEdBRUUsSUFBSSxFQUFKLEVBQVEsSUFBUixDQUpOO0FBS0QsR0FQb0I7QUFBQSxDQUFkOztBQVNBLElBQU0sd0JBQVEsU0FBUixLQUFRO0FBQUEscUNBQUksSUFBSjtBQUFJLFFBQUo7QUFBQTs7QUFBQSxTQUFhO0FBQUEsV0FBTSxLQUFLLEtBQUwsb0JBQWdCLElBQWhCLENBQU47QUFBQSxHQUFiO0FBQUEsQ0FBZCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgb3BlcmF0b3IgZnJvbSAnLi4vLi4vLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzJ1xuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCcsXG4gIGR1cmF0aW9uOiAyMDBcbn0pXG5cbmFwcC5vbigndHJhbnNpdGlvbjpiZWZvcmUnLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmICgvcGFnZS8udGVzdChyb3V0ZSkpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtcGFnZScpXG4gIH1cbn0pXG5hcHAub24oJ3RyYW5zaXRpb246YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmICgvcGFnZS8udGVzdChyb3V0ZSkpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGFnZScpXG4gIH1cbn0pXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGNhY2hlID0ge307XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgc2V0OiBmdW5jdGlvbiBzZXQocm91dGUsIHJlcykge1xuICAgIGNhY2hlID0gX2V4dGVuZHMoe30sIGNhY2hlLCBfZGVmaW5lUHJvcGVydHkoe30sIHJvdXRlLCByZXMpKTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQocm91dGUpIHtcbiAgICByZXR1cm4gY2FjaGVbcm91dGVdO1xuICB9LFxuICBnZXRDYWNoZTogZnVuY3Rpb24gZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIGNhY2hlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBpc0R1cGUgPSBmdW5jdGlvbiBpc0R1cGUoc2NyaXB0LCBleGlzdGluZykge1xuICB2YXIgZHVwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGV4aXN0aW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgc2NyaXB0LmlzRXF1YWxOb2RlKGV4aXN0aW5nW2ldKSAmJiBkdXBlcy5wdXNoKGkpO1xuICB9XG5cbiAgcmV0dXJuIGR1cGVzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAobmV3RG9tLCBleGlzdGluZ0RvbSkge1xuICB2YXIgZXhpc3RpbmcgPSBleGlzdGluZ0RvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG4gIHZhciBzY3JpcHRzID0gbmV3RG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaXNEdXBlKHNjcmlwdHNbaV0sIGV4aXN0aW5nKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIHNyYyA9IHNjcmlwdHNbaV0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ3NyYycpO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHMuc3JjID0gc3JjLnZhbHVlO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZhbChzY3JpcHRzW2ldLmlubmVySFRNTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxudmFyIF9kZWxlZ2F0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWxlZ2F0ZSk7XG5cbnZhciBfb3BlcmF0b3IgPSByZXF1aXJlKCcuL29wZXJhdG9yJyk7XG5cbnZhciBfb3BlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3BlcmF0b3IpO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciBfcmVmJHJvb3QgPSBfcmVmLnJvb3QsXG4gICAgICByb290ID0gX3JlZiRyb290ID09PSB1bmRlZmluZWQgPyBkb2N1bWVudC5ib2R5IDogX3JlZiRyb290LFxuICAgICAgX3JlZiRkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICBkdXJhdGlvbiA9IF9yZWYkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IDAgOiBfcmVmJGR1cmF0aW9uLFxuICAgICAgX3JlZiRpZ25vcmUgPSBfcmVmLmlnbm9yZSxcbiAgICAgIGlnbm9yZSA9IF9yZWYkaWdub3JlID09PSB1bmRlZmluZWQgPyBbXSA6IF9yZWYkaWdub3JlO1xuXG4gIHZhciBvcGVyYXRvciA9IG5ldyBfb3BlcmF0b3IyLmRlZmF1bHQoe1xuICAgIHJvb3Q6IHJvb3QsXG4gICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgIGlnbm9yZTogaWdub3JlXG4gIH0pO1xuXG4gIG9wZXJhdG9yLnNldFN0YXRlKHtcbiAgICByb3V0ZTogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCxcbiAgICB0aXRsZTogZG9jdW1lbnQudGl0bGVcbiAgfSk7XG5cbiAgKDAsIF9kZWxlZ2F0ZTIuZGVmYXVsdCkoZG9jdW1lbnQsICdhJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgYW5jaG9yID0gZS5kZWxlZ2F0ZVRhcmdldDtcbiAgICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCAnLyc7XG5cbiAgICB2YXIgaW50ZXJuYWwgPSBfdXJsLmxpbmsuaXNTYW1lT3JpZ2luKGhyZWYpO1xuICAgIHZhciBleHRlcm5hbCA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnO1xuICAgIHZhciBkaXNhYmxlZCA9IGFuY2hvci5jbGFzc0xpc3QuY29udGFpbnMoJ25vLWFqYXgnKTtcbiAgICB2YXIgaWdub3JlZCA9IG9wZXJhdG9yLmlnbm9yZWQoZSwgaHJlZik7XG4gICAgdmFyIGhhc2ggPSBfdXJsLmxpbmsuaXNIYXNoKGhyZWYpO1xuXG4gICAgaWYgKCFpbnRlcm5hbCB8fCBleHRlcm5hbCB8fCBkaXNhYmxlZCB8fCBpZ25vcmVkIHx8IGhhc2gpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoX3VybC5saW5rLmlzU2FtZVVSTChocmVmKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wZXJhdG9yLmdvKGhyZWYpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGhyZWYgPSBlLnRhcmdldC5sb2NhdGlvbi5ocmVmO1xuXG4gICAgaWYgKG9wZXJhdG9yLmlnbm9yZWQoZSwgaHJlZikpIHtcbiAgICAgIGlmIChfdXJsLmxpbmsuaXNIYXNoKGhyZWYpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG5cbiAgICBvcGVyYXRvci5nbyhocmVmLCBudWxsLCB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4gb3BlcmF0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbnZhciBhY3RpdmVMaW5rcyA9IFtdO1xuXG52YXIgdG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlKGJvb2wpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3RpdmVMaW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGFjdGl2ZUxpbmtzW2ldLmNsYXNzTGlzdFtib29sID8gJ2FkZCcgOiAncmVtb3ZlJ10oJ2lzLWFjdGl2ZScpO1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAocm91dGUpIHtcbiAgdG9nZ2xlKGZhbHNlKTtcblxuICBhY3RpdmVMaW5rcy5zcGxpY2UoMCwgYWN0aXZlTGlua3MubGVuZ3RoKTtcbiAgYWN0aXZlTGlua3MucHVzaC5hcHBseShhY3RpdmVMaW5rcywgX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmJD1cIicgKyByb3V0ZSArICdcIl0nKSkpKTtcblxuICB0b2dnbGUodHJ1ZSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9uYW5vYWpheCA9IHJlcXVpcmUoJ25hbm9hamF4Jyk7XG5cbnZhciBfbmFub2FqYXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmFub2FqYXgpO1xuXG52YXIgX25hdmlnbyA9IHJlcXVpcmUoJ25hdmlnbycpO1xuXG52YXIgX25hdmlnbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9uYXZpZ28pO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uID0gcmVxdWlyZSgnc2Nyb2xsLXJlc3RvcmF0aW9uJyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsUmVzdG9yYXRpb24pO1xuXG52YXIgX2xvb3AgPSByZXF1aXJlKCdsb29wLmpzJyk7XG5cbnZhciBfbG9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb29wKTtcblxudmFyIF91cmwgPSByZXF1aXJlKCcuL3VybCcpO1xuXG52YXIgX2xpbmtzID0gcmVxdWlyZSgnLi9saW5rcycpO1xuXG52YXIgX2xpbmtzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpbmtzKTtcblxudmFyIF9yZW5kZXIgPSByZXF1aXJlKCcuL3JlbmRlcicpO1xuXG52YXIgX3JlbmRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZW5kZXIpO1xuXG52YXIgX3N0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xuXG52YXIgX3N0YXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0YXRlKTtcblxudmFyIF9jYWNoZSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcblxudmFyIF9jYWNoZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWNoZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciByb3V0ZXIgPSBuZXcgX25hdmlnbzIuZGVmYXVsdChfdXJsLm9yaWdpbik7XG5cbnZhciBPcGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gT3BlcmF0b3IoY29uZmlnKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE9wZXJhdG9yKTtcblxuICAgIHZhciBldmVudHMgPSAoMCwgX2xvb3AyLmRlZmF1bHQpKCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHRoaXMucmVuZGVyID0gKDAsIF9yZW5kZXIyLmRlZmF1bHQpKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpLCBjb25maWcsIGV2ZW50cy5lbWl0KTtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgZXZlbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhPcGVyYXRvciwgW3tcbiAgICBrZXk6ICdzdG9wJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0YXJ0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBfc3RhdGUyLmRlZmF1bHQucGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0U3RhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBfc3RhdGUyLmRlZmF1bHQuX3N0YXRlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NldFN0YXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3RhdGUoX3JlZikge1xuICAgICAgdmFyIHJvdXRlID0gX3JlZi5yb3V0ZSxcbiAgICAgICAgICB0aXRsZSA9IF9yZWYudGl0bGU7XG5cbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSA9IHJvdXRlID09PSAnJyA/ICcvJyA6IHJvdXRlO1xuICAgICAgdGl0bGUgPyBfc3RhdGUyLmRlZmF1bHQudGl0bGUgPSB0aXRsZSA6IG51bGw7XG5cbiAgICAgICgwLCBfbGlua3MyLmRlZmF1bHQpKF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSk7XG5cbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ28nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnbyhocmVmKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICB2YXIgcmVzb2x2ZSA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgaWYgKF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjayh0aXRsZSkge1xuICAgICAgICB2YXIgcmVzID0ge1xuICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfTtcblxuICAgICAgICByZXNvbHZlID8gcm91dGVyLnJlc29sdmUocm91dGUpIDogcm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcblxuICAgICAgICBfdGhpcy5zZXRTdGF0ZShyZXMpO1xuXG4gICAgICAgIF90aGlzLmVtaXQoJ3JvdXRlOmFmdGVyJywgcmVzKTtcblxuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjYihyZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgcm91dGUgPSAoMCwgX3VybC5zYW5pdGl6ZSkoaHJlZik7XG5cbiAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5zYXZlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWNoZWQgPSBfY2FjaGUyLmRlZmF1bHQuZ2V0KHJvdXRlKTtcblxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIocm91dGUsIGNhY2hlZCwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXQoJ3JvdXRlOmJlZm9yZScsIHsgcm91dGU6IHJvdXRlIH0pO1xuXG4gICAgICB0aGlzLmdldChyb3V0ZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldChyb3V0ZSwgY2IpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gX25hbm9hamF4Mi5kZWZhdWx0LmFqYXgoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6IF91cmwub3JpZ2luICsgJy8nICsgcm91dGVcbiAgICAgIH0sIGZ1bmN0aW9uIChzdGF0dXMsIHJlcywgcmVxKSB7XG4gICAgICAgIGlmIChyZXEuc3RhdHVzIDwgMjAwIHx8IHJlcS5zdGF0dXMgPiAzMDAgJiYgcmVxLnN0YXR1cyAhPT0gMzA0KSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gX3VybC5vcmlnaW4gKyAnLycgKyBfc3RhdGUyLmRlZmF1bHQucHJldi5yb3V0ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfY2FjaGUyLmRlZmF1bHQuc2V0KHJvdXRlLCByZXEucmVzcG9uc2UpO1xuXG4gICAgICAgIF90aGlzMi5yZW5kZXIocm91dGUsIHJlcS5yZXNwb25zZSwgY2IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncHVzaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1c2goKSB7XG4gICAgICB2YXIgcm91dGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9zdGF0ZTIuZGVmYXVsdC50aXRsZTtcblxuICAgICAgaWYgKCFyb3V0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3V0ZTogcm91dGUsIHRpdGxlOiB0aXRsZSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdpZ25vcmVkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaWdub3JlZChldmVudCwgaHJlZikge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfdXJsLnNhbml0aXplKShocmVmKTtcblxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmlnbm9yZS5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodCkpIHtcbiAgICAgICAgICB2YXIgcmVzID0gdFsxXShyb3V0ZSk7XG5cbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBfdGhpczMuZW1pdCh0WzBdLCB7XG4gICAgICAgICAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdChyb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE9wZXJhdG9yO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBPcGVyYXRvcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdGFycnkgPSByZXF1aXJlKCd0YXJyeS5qcycpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uID0gcmVxdWlyZSgnc2Nyb2xsLXJlc3RvcmF0aW9uJyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsUmVzdG9yYXRpb24pO1xuXG52YXIgX2V2YWwgPSByZXF1aXJlKCcuL2V2YWwuanMnKTtcblxudmFyIF9ldmFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V2YWwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKTtcblxudmFyIHBhcnNlUmVzcG9uc2UgPSBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKGh0bWwpIHtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ3RleHQvaHRtbCcpO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHBhZ2UsIF9yZWYsIGVtaXQpIHtcbiAgdmFyIGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbixcbiAgICAgIHJvb3QgPSBfcmVmLnJvb3Q7XG4gIHJldHVybiBmdW5jdGlvbiAocm91dGUsIG1hcmt1cCwgY2IpIHtcbiAgICB2YXIgcmVzID0gcGFyc2VSZXNwb25zZShtYXJrdXApO1xuICAgIHZhciB0aXRsZSA9IHJlcy50aXRsZTtcblxuICAgIHZhciBzdGFydCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YmVmb3JlJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSBwYWdlLmNsaWVudEhlaWdodCArICdweCc7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVuZGVyID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgcGFnZS5pbm5lckhUTUwgPSByZXMucXVlcnlTZWxlY3Rvcihyb290KS5pbm5lckhUTUw7XG4gICAgICAoMCwgX2V2YWwyLmRlZmF1bHQpKHJlcywgZG9jdW1lbnQpO1xuICAgICAgX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIHZhciBlbmQgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBjYih0aXRsZSk7XG4gICAgICBwYWdlLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YWZ0ZXInLCB7IHJvdXRlOiByb3V0ZSB9KTtcbiAgICB9KTtcblxuICAgICgwLCBfdGFycnkucXVldWUpKHN0YXJ0KDApLCByZW5kZXIoZHVyYXRpb24pLCBlbmQoMCkpKCk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgcGF1c2VkOiBmYWxzZSxcbiAgX3N0YXRlOiB7XG4gICAgcm91dGU6ICcnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBwcmV2OiB7XG4gICAgICByb3V0ZTogJy8nLFxuICAgICAgdGl0bGU6ICcnXG4gICAgfVxuICB9LFxuICBnZXQgcm91dGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnJvdXRlO1xuICB9LFxuICBzZXQgcm91dGUobG9jKSB7XG4gICAgdGhpcy5fc3RhdGUucHJldi5yb3V0ZSA9IHRoaXMucm91dGU7XG4gICAgdGhpcy5fc3RhdGUucm91dGUgPSBsb2M7XG4gIH0sXG4gIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUudGl0bGU7XG4gIH0sXG4gIHNldCB0aXRsZSh2YWwpIHtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB0aGlzLl9zdGF0ZS50aXRsZSA9IHZhbDtcbiAgfSxcbiAgZ2V0IHByZXYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnByZXY7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGdldE9yaWdpbiA9IGZ1bmN0aW9uIGdldE9yaWdpbihsb2NhdGlvbikge1xuICB2YXIgcHJvdG9jb2wgPSBsb2NhdGlvbi5wcm90b2NvbCxcbiAgICAgIGhvc3QgPSBsb2NhdGlvbi5ob3N0O1xuXG4gIHJldHVybiBwcm90b2NvbCArICcvLycgKyBob3N0O1xufTtcblxudmFyIHBhcnNlVVJMID0gZnVuY3Rpb24gcGFyc2VVUkwodXJsKSB7XG4gIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBhLmhyZWYgPSB1cmw7XG4gIHJldHVybiBhO1xufTtcblxudmFyIG9yaWdpbiA9IGV4cG9ydHMub3JpZ2luID0gZ2V0T3JpZ2luKHdpbmRvdy5sb2NhdGlvbik7XG5cbnZhciBvcmlnaW5SZWdFeCA9IG5ldyBSZWdFeHAob3JpZ2luKTtcblxudmFyIHNhbml0aXplID0gZXhwb3J0cy5zYW5pdGl6ZSA9IGZ1bmN0aW9uIHNhbml0aXplKHVybCkge1xuICB2YXIgcm91dGUgPSB1cmwucmVwbGFjZShvcmlnaW5SZWdFeCwgJycpO1xuICByZXR1cm4gcm91dGUubWF0Y2goL15cXC8vKSA/IHJvdXRlLnJlcGxhY2UoL1xcL3sxfS8sICcnKSA6IHJvdXRlO1xufTtcblxudmFyIGxpbmsgPSBleHBvcnRzLmxpbmsgPSB7XG4gIGlzU2FtZU9yaWdpbjogZnVuY3Rpb24gaXNTYW1lT3JpZ2luKGhyZWYpIHtcbiAgICByZXR1cm4gb3JpZ2luID09PSBnZXRPcmlnaW4ocGFyc2VVUkwoaHJlZikpO1xuICB9LFxuICBpc0hhc2g6IGZ1bmN0aW9uIGlzSGFzaChocmVmKSB7XG4gICAgcmV0dXJuICgvIy8udGVzdChocmVmKVxuICAgICk7XG4gIH0sXG4gIGlzU2FtZVVSTDogZnVuY3Rpb24gaXNTYW1lVVJMKGhyZWYpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gcGFyc2VVUkwoaHJlZikuc2VhcmNoICYmIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gcGFyc2VVUkwoaHJlZikucGF0aG5hbWU7XG4gIH1cbn07IiwidmFyIG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdG9yLCBjaGVja1lvU2VsZikge1xyXG4gIHZhciBwYXJlbnQgPSBjaGVja1lvU2VsZiA/IGVsZW1lbnQgOiBlbGVtZW50LnBhcmVudE5vZGVcclxuXHJcbiAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAobWF0Y2hlcyhwYXJlbnQsIHNlbGVjdG9yKSkgcmV0dXJuIHBhcmVudDtcclxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlXHJcbiAgfVxyXG59XHJcbiIsInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnY2xvc2VzdCcpO1xuXG4vKipcbiAqIERlbGVnYXRlcyBldmVudCB0byBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBkZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBjbG9zZXN0IG1hdGNoIGFuZCBpbnZva2VzIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBsaXN0ZW5lcihlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IsIHRydWUpO1xuXG4gICAgICAgIGlmIChlLmRlbGVnYXRlVGFyZ2V0KSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsZW1lbnQsIGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9leHRlbmRzPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxiPTE7Yjxhcmd1bWVudHMubGVuZ3RoO2IrKylmb3IodmFyIGQgaW4gYz1hcmd1bWVudHNbYl0sYylPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYyxkKSYmKGFbZF09Y1tkXSk7cmV0dXJuIGF9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2V4cG9ydHMuZGVmYXVsdD1mdW5jdGlvbigpe3ZhciBhPTA8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzBdIT09dm9pZCAwP2FyZ3VtZW50c1swXTp7fSxiPXt9O3JldHVybiBfZXh0ZW5kcyh7fSxhLHtlbWl0OmZ1bmN0aW9uIGQoZil7dmFyIGc9MTxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMV0hPT12b2lkIDA/YXJndW1lbnRzWzFdOm51bGwsaD0hIWJbZl0mJmJbZl0ucXVldWU7aCYmaC5mb3JFYWNoKGZ1bmN0aW9uKGope3JldHVybiBqKGcpfSl9LG9uOmZ1bmN0aW9uIGMoZil7dmFyIGc9MTxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMV0hPT12b2lkIDA/YXJndW1lbnRzWzFdOm51bGw7ZyYmKGJbZl09YltmXXx8e3F1ZXVlOltdfSxiW2ZdLnF1ZXVlLnB1c2goZykpfX0pfTsiLCJcclxuLyoqXHJcbiAqIEVsZW1lbnQgcHJvdG90eXBlLlxyXG4gKi9cclxuXHJcbnZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiAqIFZlbmRvciBmdW5jdGlvbi5cclxuICovXHJcblxyXG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuLyoqXHJcbiAqIEV4cG9zZSBgbWF0Y2goKWAuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcclxuXHJcbi8qKlxyXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcclxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XHJcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XHJcbiAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn0iLCIvLyBCZXN0IHBsYWNlIHRvIGZpbmQgaW5mb3JtYXRpb24gb24gWEhSIGZlYXR1cmVzIGlzOlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XG5cbnZhciByZXFmaWVsZHMgPSBbXG4gICdyZXNwb25zZVR5cGUnLCAnd2l0aENyZWRlbnRpYWxzJywgJ3RpbWVvdXQnLCAnb25wcm9ncmVzcydcbl1cblxuLy8gU2ltcGxlIGFuZCBzbWFsbCBhamF4IGZ1bmN0aW9uXG4vLyBUYWtlcyBhIHBhcmFtZXRlcnMgb2JqZWN0IGFuZCBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4vLyBQYXJhbWV0ZXJzOlxuLy8gIC0gdXJsOiBzdHJpbmcsIHJlcXVpcmVkXG4vLyAgLSBoZWFkZXJzOiBvYmplY3Qgb2YgYHtoZWFkZXJfbmFtZTogaGVhZGVyX3ZhbHVlLCAuLi59YFxuLy8gIC0gYm9keTpcbi8vICAgICAgKyBzdHJpbmcgKHNldHMgY29udGVudCB0eXBlIHRvICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIGlmIG5vdCBzZXQgaW4gaGVhZGVycylcbi8vICAgICAgKyBGb3JtRGF0YSAoZG9lc24ndCBzZXQgY29udGVudCB0eXBlIHNvIHRoYXQgYnJvd3NlciB3aWxsIHNldCBhcyBhcHByb3ByaWF0ZSlcbi8vICAtIG1ldGhvZDogJ0dFVCcsICdQT1NUJywgZXRjLiBEZWZhdWx0cyB0byAnR0VUJyBvciAnUE9TVCcgYmFzZWQgb24gYm9keVxuLy8gIC0gY29yczogSWYgeW91ciB1c2luZyBjcm9zcy1vcmlnaW4sIHlvdSB3aWxsIG5lZWQgdGhpcyB0cnVlIGZvciBJRTgtOVxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgcGFyYW1ldGVycyBhcmUgcGFzc2VkIG9udG8gdGhlIHhociBvYmplY3QuXG4vLyBJTVBPUlRBTlQgTk9URTogVGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgY29tcGF0aWJpbGl0eSBjaGVja2luZy5cbi8vICAtIHJlc3BvbnNlVHlwZTogc3RyaW5nLCB2YXJpb3VzIGNvbXBhdGFiaWxpdHksIHNlZSB4aHIgZG9jcyBmb3IgZW51bSBvcHRpb25zXG4vLyAgLSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4sIElFMTArLCBDT1JTIG9ubHlcbi8vICAtIHRpbWVvdXQ6IGxvbmcsIG1zIHRpbWVvdXQsIElFOCtcbi8vICAtIG9ucHJvZ3Jlc3M6IGNhbGxiYWNrLCBJRTEwK1xuLy9cbi8vIENhbGxiYWNrIGZ1bmN0aW9uIHByb3RvdHlwZTpcbi8vICAtIHN0YXR1c0NvZGUgZnJvbSByZXF1ZXN0XG4vLyAgLSByZXNwb25zZVxuLy8gICAgKyBpZiByZXNwb25zZVR5cGUgc2V0IGFuZCBzdXBwb3J0ZWQgYnkgYnJvd3NlciwgdGhpcyBpcyBhbiBvYmplY3Qgb2Ygc29tZSB0eXBlIChzZWUgZG9jcylcbi8vICAgICsgb3RoZXJ3aXNlIGlmIHJlcXVlc3QgY29tcGxldGVkLCB0aGlzIGlzIHRoZSBzdHJpbmcgdGV4dCBvZiB0aGUgcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVxdWVzdCBpcyBhYm9ydGVkLCB0aGlzIGlzIFwiQWJvcnRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IHRpbWVzIG91dCwgdGhpcyBpcyBcIlRpbWVvdXRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IGVycm9ycyBiZWZvcmUgY29tcGxldGluZyAocHJvYmFibHkgYSBDT1JTIGlzc3VlKSwgdGhpcyBpcyBcIkVycm9yXCJcbi8vICAtIHJlcXVlc3Qgb2JqZWN0XG4vL1xuLy8gUmV0dXJucyB0aGUgcmVxdWVzdCBvYmplY3QuIFNvIHlvdSBjYW4gY2FsbCAuYWJvcnQoKSBvciBvdGhlciBtZXRob2RzXG4vL1xuLy8gREVQUkVDQVRJT05TOlxuLy8gIC0gUGFzc2luZyBhIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBwYXJhbXMgb2JqZWN0IGhhcyBiZWVuIHJlbW92ZWQhXG4vL1xuZXhwb3J0cy5hamF4ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgLy8gQW55IHZhcmlhYmxlIHVzZWQgbW9yZSB0aGFuIG9uY2UgaXMgdmFyJ2QgaGVyZSBiZWNhdXNlXG4gIC8vIG1pbmlmaWNhdGlvbiB3aWxsIG11bmdlIHRoZSB2YXJpYWJsZXMgd2hlcmVhcyBpdCBjYW4ndCBtdW5nZVxuICAvLyB0aGUgb2JqZWN0IGFjY2Vzcy5cbiAgdmFyIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyB8fCB7fVxuICAgICwgYm9keSA9IHBhcmFtcy5ib2R5XG4gICAgLCBtZXRob2QgPSBwYXJhbXMubWV0aG9kIHx8IChib2R5ID8gJ1BPU1QnIDogJ0dFVCcpXG4gICAgLCBjYWxsZWQgPSBmYWxzZVxuXG4gIHZhciByZXEgPSBnZXRSZXF1ZXN0KHBhcmFtcy5jb3JzKVxuXG4gIGZ1bmN0aW9uIGNiKHN0YXR1c0NvZGUsIHJlc3BvbnNlVGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzID09PSB1bmRlZmluZWQgPyBzdGF0dXNDb2RlIDogcmVxLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgcmVxLnN0YXR1cyA9PT0gMCA/IFwiRXJyb3JcIiA6IChyZXEucmVzcG9uc2UgfHwgcmVxLnJlc3BvbnNlVGV4dCB8fCByZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgICAgICByZXEpXG4gICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXEub3BlbihtZXRob2QsIHBhcmFtcy51cmwsIHRydWUpXG5cbiAgdmFyIHN1Y2Nlc3MgPSByZXEub25sb2FkID0gY2IoMjAwKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkgc3VjY2VzcygpXG4gIH1cbiAgcmVxLm9uZXJyb3IgPSBjYihudWxsLCAnRXJyb3InKVxuICByZXEub250aW1lb3V0ID0gY2IobnVsbCwgJ1RpbWVvdXQnKVxuICByZXEub25hYm9ydCA9IGNiKG51bGwsICdBYm9ydCcpXG5cbiAgaWYgKGJvZHkpIHtcbiAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0JylcblxuICAgIGlmICghZ2xvYmFsLkZvcm1EYXRhIHx8ICEoYm9keSBpbnN0YW5jZW9mIGdsb2JhbC5Gb3JtRGF0YSkpIHtcbiAgICAgIHNldERlZmF1bHQoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXFmaWVsZHMubGVuZ3RoLCBmaWVsZDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZmllbGQgPSByZXFmaWVsZHNbaV1cbiAgICBpZiAocGFyYW1zW2ZpZWxkXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmVxW2ZpZWxkXSA9IHBhcmFtc1tmaWVsZF1cbiAgfVxuXG4gIGZvciAodmFyIGZpZWxkIGluIGhlYWRlcnMpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIGhlYWRlcnNbZmllbGRdKVxuXG4gIHJlcS5zZW5kKGJvZHkpXG5cbiAgcmV0dXJuIHJlcVxufVxuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KGNvcnMpIHtcbiAgLy8gWERvbWFpblJlcXVlc3QgaXMgb25seSB3YXkgdG8gZG8gQ09SUyBpbiBJRSA4IGFuZCA5XG4gIC8vIEJ1dCBYRG9tYWluUmVxdWVzdCBpc24ndCBzdGFuZGFyZHMtY29tcGF0aWJsZVxuICAvLyBOb3RhYmx5LCBpdCBkb2Vzbid0IGFsbG93IGNvb2tpZXMgdG8gYmUgc2VudCBvciBzZXQgYnkgc2VydmVyc1xuICAvLyBJRSAxMCsgaXMgc3RhbmRhcmRzLWNvbXBhdGlibGUgaW4gaXRzIFhNTEh0dHBSZXF1ZXN0XG4gIC8vIGJ1dCBJRSAxMCBjYW4gc3RpbGwgaGF2ZSBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3QsIHNvIHdlIGRvbid0IHdhbnQgdG8gdXNlIGl0XG4gIGlmIChjb3JzICYmIGdsb2JhbC5YRG9tYWluUmVxdWVzdCAmJiAhL01TSUUgMS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0XG4gIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpXG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdFxufVxuXG5mdW5jdGlvbiBzZXREZWZhdWx0KG9iaiwga2V5LCB2YWx1ZSkge1xuICBvYmpba2V5XSA9IG9ialtrZXldIHx8IHZhbHVlXG59XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIk5hdmlnb1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHR2YXIgUEFSQU1FVEVSX1JFR0VYUCA9IC8oWzoqXSkoXFx3KykvZztcblx0dmFyIFdJTERDQVJEX1JFR0VYUCA9IC9cXCovZztcblx0dmFyIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQID0gJyhbXlxcL10rKSc7XG5cdHZhciBSRVBMQUNFX1dJTERDQVJEID0gJyg/Oi4qKSc7XG5cdHZhciBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFAgPSAnKD86XFwvfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmluZE1hdGNoZWRSb3V0ZXModXJsKSB7XG5cdCAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICByZXR1cm4gcm91dGVzLm1hcChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciBfcmVwbGFjZUR5bmFtaWNVUkxQYXIgPSByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICB2YXIgcmVnZXhwID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnJlZ2V4cDtcblx0ICAgIHZhciBwYXJhbU5hbWVzID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnBhcmFtTmFtZXM7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gdXJsLm1hdGNoKHJlZ2V4cCk7XG5cdCAgICB2YXIgcGFyYW1zID0gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIHBhcmFtTmFtZXMpO1xuXHRcblx0ICAgIHJldHVybiBtYXRjaCA/IHsgbWF0Y2g6IG1hdGNoLCByb3V0ZTogcm91dGUsIHBhcmFtczogcGFyYW1zIH0gOiBmYWxzZTtcblx0ICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcblx0ICAgIHJldHVybiBtO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBtYXRjaCh1cmwsIHJvdXRlcykge1xuXHQgIHJldHVybiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcylbMF0gfHwgZmFsc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJvb3QodXJsLCByb3V0ZXMpIHtcblx0ICB2YXIgbWF0Y2hlZCA9IGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciB1ID0gY2xlYW4ocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHJldHVybiB1ICE9PSAnJyAmJiB1ICE9PSAnKic7XG5cdCAgfSkpO1xuXHQgIHZhciBmYWxsYmFja1VSTCA9IGNsZWFuKHVybCk7XG5cdFxuXHQgIGlmIChtYXRjaGVkLmxlbmd0aCA+IDApIHtcblx0ICAgIHJldHVybiBtYXRjaGVkLm1hcChmdW5jdGlvbiAobSkge1xuXHQgICAgICByZXR1cm4gY2xlYW4odXJsLnN1YnN0cigwLCBtLm1hdGNoLmluZGV4KSk7XG5cdCAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJvb3QsIGN1cnJlbnQpIHtcblx0ICAgICAgcmV0dXJuIGN1cnJlbnQubGVuZ3RoIDwgcm9vdC5sZW5ndGggPyBjdXJyZW50IDogcm9vdDtcblx0ICAgIH0sIGZhbGxiYWNrVVJMKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZhbGxiYWNrVVJMO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpIHtcblx0ICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gTmF2aWdvKHIsIHVzZUhhc2gpIHtcblx0ICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICB0aGlzLnJvb3QgPSB1c2VIYXNoICYmIHIgPyByLnJlcGxhY2UoL1xcLyQvLCAnLyMnKSA6IHIgfHwgbnVsbDtcblx0ICB0aGlzLl91c2VIYXNoID0gdXNlSGFzaDtcblx0ICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IG51bGw7XG5cdCAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fb2sgPSAhdXNlSGFzaCAmJiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpO1xuXHQgIHRoaXMuX2xpc3RlbigpO1xuXHQgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG5cdH1cblx0XG5cdE5hdmlnby5wcm90b3R5cGUgPSB7XG5cdCAgaGVscGVyczoge1xuXHQgICAgbWF0Y2g6IG1hdGNoLFxuXHQgICAgcm9vdDogcm9vdCxcblx0ICAgIGNsZWFuOiBjbGVhblxuXHQgIH0sXG5cdCAgbmF2aWdhdGU6IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGgsIGFic29sdXRlKSB7XG5cdCAgICB2YXIgdG87XG5cdFxuXHQgICAgcGF0aCA9IHBhdGggfHwgJyc7XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgdG8gPSAoIWFic29sdXRlID8gdGhpcy5fZ2V0Um9vdCgpICsgJy8nIDogJycpICsgY2xlYW4ocGF0aCk7XG5cdCAgICAgIHRvID0gdG8ucmVwbGFjZSgvKFteOl0pKFxcL3syLH0pL2csICckMS8nKTtcblx0ICAgICAgaGlzdG9yeVt0aGlzLl9wYXVzZWQgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7fSwgJycsIHRvKTtcblx0ICAgICAgdGhpcy5yZXNvbHZlKCk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvIyguKikkLywgJycpICsgJyMnICsgcGF0aDtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgb246IGZ1bmN0aW9uIG9uKCkge1xuXHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdLCBhcmd1bWVudHMubGVuZ3RoIDw9IDEgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMV0pO1xuXHQgICAgfSBlbHNlIGlmIChfdHlwZW9mKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIGZvciAodmFyIHJvdXRlIGluIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkge1xuXHQgICAgICAgIHRoaXMuX2FkZChyb3V0ZSwgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSlbcm91dGVdKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG5vdEZvdW5kOiBmdW5jdGlvbiBub3RGb3VuZChoYW5kbGVyKSB7XG5cdCAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBoYW5kbGVyO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZShjdXJyZW50KSB7XG5cdCAgICB2YXIgaGFuZGxlciwgbTtcblx0ICAgIHZhciB1cmwgPSAoY3VycmVudCB8fCB0aGlzLl9jTG9jKCkpLnJlcGxhY2UodGhpcy5fZ2V0Um9vdCgpLCAnJyk7XG5cdFxuXHQgICAgaWYgKHRoaXMuX3BhdXNlZCB8fCB1cmwgPT09IHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5fdXNlSGFzaCkge1xuXHQgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLyMvLCAnLycpO1xuXHQgICAgfVxuXHQgICAgbSA9IG1hdGNoKHVybCwgdGhpcy5fcm91dGVzKTtcblx0XG5cdCAgICBpZiAobSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgaGFuZGxlciA9IG0ucm91dGUuaGFuZGxlcjtcblx0ICAgICAgbS5yb3V0ZS5yb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IGhhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBfdG9Db25zdW1hYmxlQXJyYXkobS5tYXRjaC5zbGljZSgxLCBtLm1hdGNoLmxlbmd0aCkpKSA6IGhhbmRsZXIobS5wYXJhbXMpO1xuXHQgICAgICByZXR1cm4gbTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmYXVsdEhhbmRsZXIgJiYgKHVybCA9PT0gJycgfHwgdXJsID09PSAnLycpKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyKCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZEhhbmRsZXIpIHtcblx0ICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSxcblx0ICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXHQgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCk7XG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbCA6IG51bGw7XG5cdCAgfSxcblx0ICB1cGRhdGVQYWdlTGlua3M6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VMaW5rcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0XG5cdCAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXHRcblx0ICAgIHRoaXMuX2ZpbmRMaW5rcygpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0ICAgICAgaWYgKCFsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQpIHtcblx0ICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0ICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFxuXHQgICAgICAgICAgaWYgKCFzZWxmLl9kZXN0cm95ZWQpIHtcblx0ICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBzZWxmLm5hdmlnYXRlKGNsZWFuKGxvY2F0aW9uKSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSkge1xuXHQgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICByZXR1cm4gdGhpcy5fcm91dGVzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3V0ZSkge1xuXHQgICAgICB2YXIga2V5O1xuXHRcblx0ICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IG5hbWUpIHtcblx0ICAgICAgICByZXN1bHQgPSByb3V0ZS5yb3V0ZTtcblx0ICAgICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnOicgKyBrZXksIGRhdGFba2V5XSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LCAnJyk7XG5cdCAgfSxcblx0ICBsaW5rOiBmdW5jdGlvbiBsaW5rKHBhdGgpIHtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRSb290KCkgKyBwYXRoO1xuXHQgIH0sXG5cdCAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHN0YXR1cykge1xuXHQgICAgdGhpcy5fcGF1c2VkID0gc3RhdHVzO1xuXHQgIH0sXG5cdCAgZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlOiBmdW5jdGlvbiBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGUoKSB7XG5cdCAgICBpZiAoIWlzUHVzaFN0YXRlQXZhaWxhYmxlKCkpIHtcblx0ICAgICAgdGhpcy5kZXN0cm95KCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfYWRkOiBmdW5jdGlvbiBfYWRkKHJvdXRlKSB7XG5cdCAgICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgaWYgKCh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaGFuZGxlcikpID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlci51c2VzLCBuYW1lOiBoYW5kbGVyLmFzIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fYWRkO1xuXHQgIH0sXG5cdCAgX2dldFJvb3Q6IGZ1bmN0aW9uIF9nZXRSb290KCkge1xuXHQgICAgaWYgKHRoaXMucm9vdCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMucm9vdDtcblx0ICAgIHRoaXMucm9vdCA9IHJvb3QodGhpcy5fY0xvYygpLCB0aGlzLl9yb3V0ZXMpO1xuXHQgICAgcmV0dXJuIHRoaXMucm9vdDtcblx0ICB9LFxuXHQgIF9saXN0ZW46IGZ1bmN0aW9uIF9saXN0ZW4oKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpcy5yZXNvbHZlKCk7XG5cdCAgICAgIH07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciBjYWNoZWQgPSBfdGhpcy5fY0xvYygpLFxuXHQgICAgICAgICAgICBjdXJyZW50ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgICAgICBfY2hlY2sgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICAgIF9jaGVjayA9IGZ1bmN0aW9uIGNoZWNrKCkge1xuXHQgICAgICAgICAgY3VycmVudCA9IF90aGlzLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzLnJlc29sdmUoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIF90aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwgPSBzZXRUaW1lb3V0KF9jaGVjaywgMjAwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICAgIF9jaGVjaygpO1xuXHQgICAgICB9KSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2NMb2M6IGZ1bmN0aW9uIF9jTG9jKCkge1xuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0ICB9LFxuXHQgIF9maW5kTGlua3M6IGZ1bmN0aW9uIF9maW5kTGlua3MoKSB7XG5cdCAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uYXZpZ29dJykpO1xuXHQgIH1cblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE5hdmlnbztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdmlnby5qcy5tYXAiLCIndXNlIHN0cmljdCc7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO3ZhciBzY3JvbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIHdpbmRvdy5zY3JvbGxUbygwLGEpfSxzdGF0ZT1mdW5jdGlvbigpe3JldHVybiBoaXN0b3J5LnN0YXRlP2hpc3Rvcnkuc3RhdGUuc2Nyb2xsUG9zaXRpb246MH0sc2F2ZT1mdW5jdGlvbigpe3dpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7c2Nyb2xsUG9zaXRpb246d2luZG93LnBhZ2VZT2Zmc2V0fHx3aW5kb3cuc2Nyb2xsWX0sJycpfSxyZXN0b3JlPWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOm51bGwsYj1zdGF0ZSgpO2I/YT9hKGIpOnNjcm9sbChiKTpzY3JvbGwoMCl9LGluc3RhbmNlPXtnZXQgZXhwb3J0KCl7cmV0dXJuJ3VuZGVmaW5lZCc9PXR5cGVvZiB3aW5kb3c/e306KCdzY3JvbGxSZXN0b3JhdGlvbidpbiBoaXN0b3J5JiYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbj0nbWFudWFsJyxzY3JvbGwoc3RhdGUoKSksd2luZG93Lm9uYmVmb3JldW5sb2FkPXNhdmUpLHtzYXZlOnNhdmUscmVzdG9yZTpyZXN0b3JlLHN0YXRlOnN0YXRlfSl9fTtleHBvcnRzLmRlZmF1bHQ9aW5zdGFuY2UuZXhwb3J0OyIsImNvbnN0IHJ1biA9IChjYiwgYXJncykgPT4ge1xuICBjYigpXG4gIGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzLnNoaWZ0KCkoLi4uYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHRhcnJ5ID0gKGNiLCBkZWxheSA9IG51bGwpID0+ICguLi5hcmdzKSA9PiB7XG4gIGxldCBvdmVycmlkZSA9ICdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSA/IGFyZ3NbMF0gOiBudWxsIFxuICByZXR1cm4gJ251bWJlcicgPT09IHR5cGVvZiBvdmVycmlkZSAmJiBvdmVycmlkZSA+IC0xIFxuICAgID8gdGFycnkoY2IsIG92ZXJyaWRlKSBcbiAgICA6ICdudW1iZXInID09PSB0eXBlb2YgZGVsYXkgJiYgZGVsYXkgPiAtMSBcbiAgICAgID8gc2V0VGltZW91dCgoKSA9PiBydW4oY2IsIGFyZ3MpLCBkZWxheSkgXG4gICAgICA6IHJ1bihjYiwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHF1ZXVlID0gKC4uLmFyZ3MpID0+ICgpID0+IGFyZ3Muc2hpZnQoKSguLi5hcmdzKVxuIl19
