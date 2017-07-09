(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _index = require('../../../package/dist/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _index2.default)({
  root: '#root',
  duration: 200,
  ignore: function ignore(path) {
    return (/page/.test(path)
    );
  },
  handlers: [['redirect', function (path) {
    return (/redirect/.test(path)
    );
  }]]
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

app.on('redirect', function (_ref3) {
  var event = _ref3.event;

  event && event.preventDefault();

  app.go('/');
});

app.handlers();

},{"../../../package/dist/index.js":4}],2:[function(require,module,exports){
"use strict";var _extends=Object.assign||function(a){for(var c,b=1;b<arguments.length;b++)for(var d in c=arguments[b],c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d]);return a};Object.defineProperty(exports,"__esModule",{value:!0});function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var cache={};exports.default={set:function set(a,b){cache=_extends({},cache,_defineProperty({},a,b))},get:function get(a){return cache[a]},getCache:function getCache(){return cache}};
},{}],3:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var isDupe=function(a,b){for(var c=[],d=0;d<b.length;d++)a.isEqualNode(b[d])&&c.push(d);return 0<c.length};exports.default=function(a,b){for(var c=b.getElementsByTagName('script'),d=a.getElementsByTagName('script'),e=0;e<d.length;e++)if(!isDupe(d[e],c)){var f=document.createElement('script'),g=d[e].attributes.getNamedItem('src');g?f.src=g.value:f.innerHTML=d[e].innerHTML,document.body.appendChild(f)}};
},{}],4:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _delegate=require('delegate'),_delegate2=_interopRequireDefault(_delegate),_operator=require('./operator'),_operator2=_interopRequireDefault(_operator),_url=require('./url');function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}exports.default=function(a){var b=a.root,c=void 0===b?document.body:b,d=a.duration,f=void 0===d?0:d,g=a.handlers,h=void 0===g?[]:g,i=new _operator2.default({root:c,duration:f,handlers:h});return i.setState({route:window.location.pathname+window.location.search,title:document.title}),(0,_delegate2.default)(document,'a','click',function(j){var k=j.delegateTarget,l=k.getAttribute('href')||'/',m=_url.link.isSameOrigin(l),n='external'===k.getAttribute('rel'),o=k.classList.contains('no-ajax'),p=i.validate(j,l),q=_url.link.isHash(l);if(!(!m||n||o||p||q))return(j.preventDefault(),!_url.link.isSameURL(l))?(i.go(l),!1):void 0}),window.onpopstate=function(j){var k=j.target.location.href;return i.validate(j,k)?_url.link.isHash(k)?void 0:window.location.reload():void i.go(k,null,!0)},i};
},{"./operator":6,"./url":9,"delegate":11}],5:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}var activeLinks=[],toggle=function(a){for(var b=0;b<activeLinks.length;b++)activeLinks[b].classList[a?'add':'remove']('is-active')};exports.default=function(a){toggle(!1),activeLinks.splice(0,activeLinks.length),activeLinks.push.apply(activeLinks,_toConsumableArray(Array.prototype.slice.call(document.querySelectorAll('[href$="'+a+'"]')))),toggle(!0)};
},{}],6:[function(require,module,exports){
'use strict';var _createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_nanoajax=require('nanoajax'),_nanoajax2=_interopRequireDefault(_nanoajax),_navigo=require('navigo'),_navigo2=_interopRequireDefault(_navigo),_scrollRestoration=require('scroll-restoration'),_scrollRestoration2=_interopRequireDefault(_scrollRestoration),_loop=require('loop.js'),_loop2=_interopRequireDefault(_loop),_url=require('./url'),_links=require('./links'),_links2=_interopRequireDefault(_links),_render=require('./render'),_render2=_interopRequireDefault(_render),_state=require('./state'),_state2=_interopRequireDefault(_state),_cache=require('./cache'),_cache2=_interopRequireDefault(_cache);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var router=new _navigo2.default(_url.origin),Operator=function(){function a(b){_classCallCheck(this,a);var c=(0,_loop2.default)();this.config=b,this.render=(0,_render2.default)(document.querySelector(b.root),b,c.emit),Object.assign(this,c)}return _createClass(a,[{key:'stop',value:function stop(){_state2.default.paused=!0}},{key:'start',value:function start(){_state2.default.paused=!1}},{key:'getState',value:function getState(){return _state2.default._state}},{key:'setState',value:function setState(_ref){var b=_ref.route,c=_ref.title;_state2.default.route=''===b?'/':b,c?_state2.default.title=c:null,(0,_links2.default)(_state2.default.route),document.title=c}},{key:'go',value:function go(b){var f=this,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,d=arguments[2];if(!_state2.default.paused){var e=function(j){var k={title:j,route:g};d?router.resolve(g):router.navigate(g),f.setState(k),f.emit('route:after',k),c&&c(k)},g=(0,_url.sanitize)(b);d&&_scrollRestoration2.default.save();var h=_cache2.default.get(g);return h?this.render(g,h,e):void(this.emit('route:before',{route:g}),this.get(g,e))}}},{key:'get',value:function get(b,c){var d=this;return _nanoajax2.default.ajax({method:'GET',url:_url.origin+'/'+b},function(e,f,g){return 200>g.status||300<g.status&&304!==g.status?void(window.location=_url.origin+'/'+_state2.default.prev.route):void(_cache2.default.set(b,g.response),d.render(b,g.response,c))})}},{key:'push',value:function push(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:_state2.default.title;b&&(this.router.navigate(b),this.setState({route:b,title:c}))}},{key:'validate',value:function validate(){var e=this,b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:_state2.default.route,d=(0,_url.sanitize)(c);return 0<this.config.handlers.filter(function(f){if(Array.isArray(f)){var g=f[1](d);return g&&e.emit(f[0],{route:d,event:b}),g}return f(d)}).length}}]),a}();exports.default=Operator;
},{"./cache":2,"./links":5,"./render":7,"./state":8,"./url":9,"loop.js":12,"nanoajax":14,"navigo":15,"scroll-restoration":16}],7:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _tarry=require('tarry.js'),_scrollRestoration=require('scroll-restoration'),_scrollRestoration2=_interopRequireDefault(_scrollRestoration),_eval=require('./eval.js'),_eval2=_interopRequireDefault(_eval);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var parser=new window.DOMParser,parseResponse=function(a){return parser.parseFromString(a,'text/html')};exports.default=function(a,b,c){var d=b.duration,e=b.root;return function(f,g,h){var i=parseResponse(g),j=i.title,k=(0,_tarry.tarry)(function(){c('transition:before',{route:f}),document.documentElement.classList.add('is-transitioning'),a.style.height=a.clientHeight+'px'}),l=(0,_tarry.tarry)(function(){a.innerHTML=i.querySelector(e).innerHTML,(0,_eval2.default)(i,document),_scrollRestoration2.default.restore()}),m=(0,_tarry.tarry)(function(){c('transition:after',{route:f}),h(j),a.style.height='',document.documentElement.classList.remove('is-transitioning')});(0,_tarry.queue)(k(0),l(d),m(0))()}};
},{"./eval.js":3,"scroll-restoration":16,"tarry.js":17}],8:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.default={paused:!1,_state:{route:'',title:'',prev:{route:'/',title:''}},get route(){return this._state.route},set route(a){this._state.prev.route=this.route,this._state.route=a},get title(){return this._state.title},set title(a){this._state.prev.title=this.title,this._state.title=a},get prev(){return this._state.prev}};
},{}],9:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var getOrigin=function(b){var c=b.protocol,d=b.host;return c+'//'+d},parseURL=function(b){var c=document.createElement('a');return c.href=b,c},origin=exports.origin=getOrigin(window.location),originRegEx=new RegExp(origin),sanitize=exports.sanitize=function(b){var c=b.replace(originRegEx,'');return c.match(/^\//)?c.replace(/\/{1}/,''):c},link=exports.link={isSameOrigin:function isSameOrigin(b){return origin===getOrigin(parseURL(b))},isHash:function isHash(b){return /#/.test(b)},isSameURL:function isSameURL(b){return window.location.search===parseURL(b).search&&window.location.pathname===parseURL(b).pathname}};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsIi4uL3BhY2thZ2UvZGlzdC9jYWNoZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9kaXN0L2xpbmtzLmpzIiwiLi4vcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vcGFja2FnZS9kaXN0L3JlbmRlci5qcyIsIi4uL3BhY2thZ2UvZGlzdC9zdGF0ZS5qcyIsIi4uL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9jbG9zZXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbG9vcC5qcy9kaXN0L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL25hbm9hamF4L2luZGV4LmpzIiwiLi4vcGFja2FnZS9ub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL3RhcnJ5LmpzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFTO0FBQ25CLFFBQU0sT0FEYTtBQUVuQixZQUFVLEdBRlM7QUFHbkIsVUFBUTtBQUFBLFdBQVEsUUFBTyxJQUFQLENBQVksSUFBWjtBQUFSO0FBQUEsR0FIVztBQUluQixZQUFVLENBQ1IsQ0FBQyxVQUFELEVBQWE7QUFBQSxXQUFRLFlBQVcsSUFBWCxDQUFnQixJQUFoQjtB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTs7Ozs7Ozs7OztBQ0FBLElBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxFQUFELEVBQUssSUFBTCxFQUFjO0FBQ3hCO0FBQ0EsT0FBSyxNQUFMLEdBQWMsQ0FBZCxJQUFtQixLQUFLLEtBQUwsdUNBQWdCLElBQWhCLEVBQW5CO0FBQ0QsQ0FIRDs7QUFLTyxJQUFNLHdCQUFRLFNBQVIsS0FBUSxDQUFDLEVBQUQ7QUFBQSxNQUFLLEtBQUwsdUVBQWEsSUFBYjtBQUFBLFNBQXNCLFlBQWE7QUFBQSxzQ0FBVCxJQUFTO0FBQVQsVUFBUztBQUFBOztBQUN0RCxRQUFJLFdBQVcsYUFBYSxPQUFPLEtBQUssQ0FBTCxDQUFwQixHQUE4QixLQUFLLENBQUwsQ0FBOUIsR0FBd0MsSUFBdkQ7QUFDQSxXQUFPLGFBQWEsT0FBTyxRQUFwQixJQUFnQyxXQUFXLENBQUMsQ0FBNUMsR0FDSCxNQUFNLEVBQU4sRUFBVSxRQUFWLENBREcsR0FFSCxhQUFhLE9BQU8sS0FBcEIsSUFBNkIsUUFBUSxDQUFDLENBQXRDLEdBQ0UsV0FBVztBQUFBLGFBQU0sSUFBSSxFQUFKLEVBQVEsSUFBUixDQUFOO0FBQUEsS0FBWCxFQUFnQyxLQUFoQyxDQURGLEdBRUUsSUFBSSxFQUFKLEVBQVEsSUFBUixDQUpOO0FBS0QsR0FQb0I7QUFBQSxDQUFkOztBQVNBLElBQU0sd0JBQVEsU0FBUixLQUFRO0FBQUEscUNBQUksSUFBSjtBQUFJLFFBQUo7QUFBQTs7QUFBQSxTQUFhO0FBQUEsV0FBTSxLQUFLLEtBQUwsb0JBQWdCLElBQWhCLENBQU47QUFBQSxHQUFiO0FBQUEsQ0FBZCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgb3BlcmF0b3IgZnJvbSAnLi4vLi4vLi4vcGFja2FnZS9kaXN0L2luZGV4LmpzJ1xuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCcsXG4gIGR1cmF0aW9uOiAyMDAsXG4gIGlnbm9yZTogcGF0aCA9PiAvcGFnZS8udGVzdChwYXRoKSxcbiAgaGFuZGxlcnM6IFtcbiAgICBbJ3JlZGlyZWN0JywgcGF0aCA9PiAvcmVkaXJlY3QvLnRlc3QocGF0aCldXG4gIF1cbn0pXG5cbndpbmRvdy5hcHAgPSBhcHBcblxuYXBwLm9uKCdyb3V0ZTpiZWZvcmUnLCAocHJvcHMpID0+IGNvbnNvbGUubG9nKCdyb3V0ZTpiZWZvcmUnLCBwcm9wcykpXG5hcHAub24oJ3JvdXRlOmFmdGVyJywgKHByb3BzKSA9PiBjb25zb2xlLmxvZygncm91dGU6YWZ0ZXInLCBwcm9wcykpXG5hcHAub24oJ3RyYW5zaXRpb246YmVmb3JlJywgKHByb3BzKSA9PiBjb25zb2xlLmxvZygndHJhbnNpdGlvbjpiZWZvcmUnLCBwcm9wcykpXG5hcHAub24oJ3RyYW5zaXRpb246YWZ0ZXInLCAocHJvcHMpID0+IGNvbnNvbGUubG9nKCd0cmFuc2l0aW9uOmFmdGVyJywgcHJvcHMpKVxuXG5hcHAub24oJ3RyYW5zaXRpb246YmVmb3JlJywgKHsgcm91dGUgfSkgPT4ge1xuICBpZiAoL3BhZ2UvLnRlc3Qocm91dGUpKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXBhZ2UnKVxuICB9XG59KVxuYXBwLm9uKCd0cmFuc2l0aW9uOmFmdGVyJywgKHsgcm91dGUgfSkgPT4ge1xuICBpZiAoL3BhZ2UvLnRlc3Qocm91dGUpKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBhZ2UnKVxuICB9XG59KVxuXG5hcHAub24oJ3JlZGlyZWN0JywgKHsgZXZlbnQgfSkgPT4ge1xuICBldmVudCAmJiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgYXBwLmdvKCcvJylcbn0pXG5cbmFwcC5oYW5kbGVycygpXG4iLCJcInVzZSBzdHJpY3RcIjt2YXIgX2V4dGVuZHM9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKWZvcih2YXIgZCBpbiBjPWFyZ3VtZW50c1tiXSxjKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjLGQpJiYoYVtkXT1jW2RdKTtyZXR1cm4gYX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7ZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KGEsYixjKXtyZXR1cm4gYiBpbiBhP09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLGIse3ZhbHVlOmMsZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTphW2JdPWMsYX12YXIgY2FjaGU9e307ZXhwb3J0cy5kZWZhdWx0PXtzZXQ6ZnVuY3Rpb24gc2V0KGEsYil7Y2FjaGU9X2V4dGVuZHMoe30sY2FjaGUsX2RlZmluZVByb3BlcnR5KHt9LGEsYikpfSxnZXQ6ZnVuY3Rpb24gZ2V0KGEpe3JldHVybiBjYWNoZVthXX0sZ2V0Q2FjaGU6ZnVuY3Rpb24gZ2V0Q2FjaGUoKXtyZXR1cm4gY2FjaGV9fTsiLCIndXNlIHN0cmljdCc7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO3ZhciBpc0R1cGU9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9W10sZD0wO2Q8Yi5sZW5ndGg7ZCsrKWEuaXNFcXVhbE5vZGUoYltkXSkmJmMucHVzaChkKTtyZXR1cm4gMDxjLmxlbmd0aH07ZXhwb3J0cy5kZWZhdWx0PWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpLGQ9YS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JyksZT0wO2U8ZC5sZW5ndGg7ZSsrKWlmKCFpc0R1cGUoZFtlXSxjKSl7dmFyIGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksZz1kW2VdLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdzcmMnKTtnP2Yuc3JjPWcudmFsdWU6Zi5pbm5lckhUTUw9ZFtlXS5pbm5lckhUTUwsZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmKX19OyIsIid1c2Ugc3RyaWN0JztPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywnX19lc01vZHVsZScse3ZhbHVlOiEwfSk7dmFyIF9kZWxlZ2F0ZT1yZXF1aXJlKCdkZWxlZ2F0ZScpLF9kZWxlZ2F0ZTI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVsZWdhdGUpLF9vcGVyYXRvcj1yZXF1aXJlKCcuL29wZXJhdG9yJyksX29wZXJhdG9yMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vcGVyYXRvciksX3VybD1yZXF1aXJlKCcuL3VybCcpO2Z1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoYSl7cmV0dXJuIGEmJmEuX19lc01vZHVsZT9hOntkZWZhdWx0OmF9fWV4cG9ydHMuZGVmYXVsdD1mdW5jdGlvbihhKXt2YXIgYj1hLnJvb3QsYz12b2lkIDA9PT1iP2RvY3VtZW50LmJvZHk6YixkPWEuZHVyYXRpb24sZj12b2lkIDA9PT1kPzA6ZCxnPWEuaGFuZGxlcnMsaD12b2lkIDA9PT1nP1tdOmcsaT1uZXcgX29wZXJhdG9yMi5kZWZhdWx0KHtyb290OmMsZHVyYXRpb246ZixoYW5kbGVyczpofSk7cmV0dXJuIGkuc2V0U3RhdGUoe3JvdXRlOndpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSt3aW5kb3cubG9jYXRpb24uc2VhcmNoLHRpdGxlOmRvY3VtZW50LnRpdGxlfSksKDAsX2RlbGVnYXRlMi5kZWZhdWx0KShkb2N1bWVudCwnYScsJ2NsaWNrJyxmdW5jdGlvbihqKXt2YXIgaz1qLmRlbGVnYXRlVGFyZ2V0LGw9ay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKXx8Jy8nLG09X3VybC5saW5rLmlzU2FtZU9yaWdpbihsKSxuPSdleHRlcm5hbCc9PT1rLmdldEF0dHJpYnV0ZSgncmVsJyksbz1rLmNsYXNzTGlzdC5jb250YWlucygnbm8tYWpheCcpLHA9aS52YWxpZGF0ZShqLGwpLHE9X3VybC5saW5rLmlzSGFzaChsKTtpZighKCFtfHxufHxvfHxwfHxxKSlyZXR1cm4oai5wcmV2ZW50RGVmYXVsdCgpLCFfdXJsLmxpbmsuaXNTYW1lVVJMKGwpKT8oaS5nbyhsKSwhMSk6dm9pZCAwfSksd2luZG93Lm9ucG9wc3RhdGU9ZnVuY3Rpb24oail7dmFyIGs9ai50YXJnZXQubG9jYXRpb24uaHJlZjtyZXR1cm4gaS52YWxpZGF0ZShqLGspP191cmwubGluay5pc0hhc2goayk/dm9pZCAwOndpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTp2b2lkIGkuZ28oayxudWxsLCEwKX0saX07IiwiJ3VzZSBzdHJpY3QnO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCdfX2VzTW9kdWxlJyx7dmFsdWU6ITB9KTtmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYSl7aWYoQXJyYXkuaXNBcnJheShhKSl7Zm9yKHZhciBiPTAsYz1BcnJheShhLmxlbmd0aCk7YjxhLmxlbmd0aDtiKyspY1tiXT1hW2JdO3JldHVybiBjfXJldHVybiBBcnJheS5mcm9tKGEpfXZhciBhY3RpdmVMaW5rcz1bXSx0b2dnbGU9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTA7YjxhY3RpdmVMaW5rcy5sZW5ndGg7YisrKWFjdGl2ZUxpbmtzW2JdLmNsYXNzTGlzdFthPydhZGQnOidyZW1vdmUnXSgnaXMtYWN0aXZlJyl9O2V4cG9ydHMuZGVmYXVsdD1mdW5jdGlvbihhKXt0b2dnbGUoITEpLGFjdGl2ZUxpbmtzLnNwbGljZSgwLGFjdGl2ZUxpbmtzLmxlbmd0aCksYWN0aXZlTGlua3MucHVzaC5hcHBseShhY3RpdmVMaW5rcyxfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWYkPVwiJythKydcIl0nKSkpKSx0b2dnbGUoITApfTsiLCIndXNlIHN0cmljdCc7dmFyIF9jcmVhdGVDbGFzcz1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoYixjKXtmb3IodmFyIGUsZD0wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlLmVudW1lcmFibGU9ZS5lbnVtZXJhYmxlfHwhMSxlLmNvbmZpZ3VyYWJsZT0hMCwndmFsdWUnaW4gZSYmKGUud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLGUua2V5LGUpfXJldHVybiBmdW5jdGlvbihiLGMsZCl7cmV0dXJuIGMmJmEoYi5wcm90b3R5cGUsYyksZCYmYShiLGQpLGJ9fSgpLF9uYW5vYWpheD1yZXF1aXJlKCduYW5vYWpheCcpLF9uYW5vYWpheDI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmFub2FqYXgpLF9uYXZpZ289cmVxdWlyZSgnbmF2aWdvJyksX25hdmlnbzI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmF2aWdvKSxfc2Nyb2xsUmVzdG9yYXRpb249cmVxdWlyZSgnc2Nyb2xsLXJlc3RvcmF0aW9uJyksX3Njcm9sbFJlc3RvcmF0aW9uMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxSZXN0b3JhdGlvbiksX2xvb3A9cmVxdWlyZSgnbG9vcC5qcycpLF9sb29wMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb29wKSxfdXJsPXJlcXVpcmUoJy4vdXJsJyksX2xpbmtzPXJlcXVpcmUoJy4vbGlua3MnKSxfbGlua3MyPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpbmtzKSxfcmVuZGVyPXJlcXVpcmUoJy4vcmVuZGVyJyksX3JlbmRlcjI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVuZGVyKSxfc3RhdGU9cmVxdWlyZSgnLi9zdGF0ZScpLF9zdGF0ZTI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RhdGUpLF9jYWNoZT1yZXF1aXJlKCcuL2NhY2hlJyksX2NhY2hlMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWNoZSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO2Z1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoYSl7cmV0dXJuIGEmJmEuX19lc01vZHVsZT9hOntkZWZhdWx0OmF9fWZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhhLGIpe2lmKCEoYSBpbnN0YW5jZW9mIGIpKXRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpfXZhciByb3V0ZXI9bmV3IF9uYXZpZ28yLmRlZmF1bHQoX3VybC5vcmlnaW4pLE9wZXJhdG9yPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShiKXtfY2xhc3NDYWxsQ2hlY2sodGhpcyxhKTt2YXIgYz0oMCxfbG9vcDIuZGVmYXVsdCkoKTt0aGlzLmNvbmZpZz1iLHRoaXMucmVuZGVyPSgwLF9yZW5kZXIyLmRlZmF1bHQpKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYi5yb290KSxiLGMuZW1pdCksT2JqZWN0LmFzc2lnbih0aGlzLGMpfXJldHVybiBfY3JlYXRlQ2xhc3MoYSxbe2tleTonc3RvcCcsdmFsdWU6ZnVuY3Rpb24gc3RvcCgpe19zdGF0ZTIuZGVmYXVsdC5wYXVzZWQ9ITB9fSx7a2V5OidzdGFydCcsdmFsdWU6ZnVuY3Rpb24gc3RhcnQoKXtfc3RhdGUyLmRlZmF1bHQucGF1c2VkPSExfX0se2tleTonZ2V0U3RhdGUnLHZhbHVlOmZ1bmN0aW9uIGdldFN0YXRlKCl7cmV0dXJuIF9zdGF0ZTIuZGVmYXVsdC5fc3RhdGV9fSx7a2V5OidzZXRTdGF0ZScsdmFsdWU6ZnVuY3Rpb24gc2V0U3RhdGUoX3JlZil7dmFyIGI9X3JlZi5yb3V0ZSxjPV9yZWYudGl0bGU7X3N0YXRlMi5kZWZhdWx0LnJvdXRlPScnPT09Yj8nLyc6YixjP19zdGF0ZTIuZGVmYXVsdC50aXRsZT1jOm51bGwsKDAsX2xpbmtzMi5kZWZhdWx0KShfc3RhdGUyLmRlZmF1bHQucm91dGUpLGRvY3VtZW50LnRpdGxlPWN9fSx7a2V5OidnbycsdmFsdWU6ZnVuY3Rpb24gZ28oYil7dmFyIGY9dGhpcyxjPTE8YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTpudWxsLGQ9YXJndW1lbnRzWzJdO2lmKCFfc3RhdGUyLmRlZmF1bHQucGF1c2VkKXt2YXIgZT1mdW5jdGlvbihqKXt2YXIgaz17dGl0bGU6aixyb3V0ZTpnfTtkP3JvdXRlci5yZXNvbHZlKGcpOnJvdXRlci5uYXZpZ2F0ZShnKSxmLnNldFN0YXRlKGspLGYuZW1pdCgncm91dGU6YWZ0ZXInLGspLGMmJmMoayl9LGc9KDAsX3VybC5zYW5pdGl6ZSkoYik7ZCYmX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnNhdmUoKTt2YXIgaD1fY2FjaGUyLmRlZmF1bHQuZ2V0KGcpO3JldHVybiBoP3RoaXMucmVuZGVyKGcsaCxlKTp2b2lkKHRoaXMuZW1pdCgncm91dGU6YmVmb3JlJyx7cm91dGU6Z30pLHRoaXMuZ2V0KGcsZSkpfX19LHtrZXk6J2dldCcsdmFsdWU6ZnVuY3Rpb24gZ2V0KGIsYyl7dmFyIGQ9dGhpcztyZXR1cm4gX25hbm9hamF4Mi5kZWZhdWx0LmFqYXgoe21ldGhvZDonR0VUJyx1cmw6X3VybC5vcmlnaW4rJy8nK2J9LGZ1bmN0aW9uKGUsZixnKXtyZXR1cm4gMjAwPmcuc3RhdHVzfHwzMDA8Zy5zdGF0dXMmJjMwNCE9PWcuc3RhdHVzP3ZvaWQod2luZG93LmxvY2F0aW9uPV91cmwub3JpZ2luKycvJytfc3RhdGUyLmRlZmF1bHQucHJldi5yb3V0ZSk6dm9pZChfY2FjaGUyLmRlZmF1bHQuc2V0KGIsZy5yZXNwb25zZSksZC5yZW5kZXIoYixnLnJlc3BvbnNlLGMpKX0pfX0se2tleToncHVzaCcsdmFsdWU6ZnVuY3Rpb24gcHVzaCgpe3ZhciBiPTA8YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpudWxsLGM9MTxhcmd1bWVudHMubGVuZ3RoJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOl9zdGF0ZTIuZGVmYXVsdC50aXRsZTtiJiYodGhpcy5yb3V0ZXIubmF2aWdhdGUoYiksdGhpcy5zZXRTdGF0ZSh7cm91dGU6Yix0aXRsZTpjfSkpfX0se2tleTondmFsaWRhdGUnLHZhbHVlOmZ1bmN0aW9uIHZhbGlkYXRlKCl7dmFyIGU9dGhpcyxiPTA8YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpudWxsLGM9MTxhcmd1bWVudHMubGVuZ3RoJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOl9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSxkPSgwLF91cmwuc2FuaXRpemUpKGMpO3JldHVybiAwPHRoaXMuY29uZmlnLmhhbmRsZXJzLmZpbHRlcihmdW5jdGlvbihmKXtpZihBcnJheS5pc0FycmF5KGYpKXt2YXIgZz1mWzFdKGQpO3JldHVybiBnJiZlLmVtaXQoZlswXSx7cm91dGU6ZCxldmVudDpifSksZ31yZXR1cm4gZihkKX0pLmxlbmd0aH19XSksYX0oKTtleHBvcnRzLmRlZmF1bHQ9T3BlcmF0b3I7IiwiJ3VzZSBzdHJpY3QnO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCdfX2VzTW9kdWxlJyx7dmFsdWU6ITB9KTt2YXIgX3RhcnJ5PXJlcXVpcmUoJ3RhcnJ5LmpzJyksX3Njcm9sbFJlc3RvcmF0aW9uPXJlcXVpcmUoJ3Njcm9sbC1yZXN0b3JhdGlvbicpLF9zY3JvbGxSZXN0b3JhdGlvbjI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsUmVzdG9yYXRpb24pLF9ldmFsPXJlcXVpcmUoJy4vZXZhbC5qcycpLF9ldmFsMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ldmFsKTtmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KGEpe3JldHVybiBhJiZhLl9fZXNNb2R1bGU/YTp7ZGVmYXVsdDphfX12YXIgcGFyc2VyPW5ldyB3aW5kb3cuRE9NUGFyc2VyLHBhcnNlUmVzcG9uc2U9ZnVuY3Rpb24oYSl7cmV0dXJuIHBhcnNlci5wYXJzZUZyb21TdHJpbmcoYSwndGV4dC9odG1sJyl9O2V4cG9ydHMuZGVmYXVsdD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9Yi5kdXJhdGlvbixlPWIucm9vdDtyZXR1cm4gZnVuY3Rpb24oZixnLGgpe3ZhciBpPXBhcnNlUmVzcG9uc2UoZyksaj1pLnRpdGxlLGs9KDAsX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbigpe2MoJ3RyYW5zaXRpb246YmVmb3JlJyx7cm91dGU6Zn0pLGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy10cmFuc2l0aW9uaW5nJyksYS5zdHlsZS5oZWlnaHQ9YS5jbGllbnRIZWlnaHQrJ3B4J30pLGw9KDAsX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbigpe2EuaW5uZXJIVE1MPWkucXVlcnlTZWxlY3RvcihlKS5pbm5lckhUTUwsKDAsX2V2YWwyLmRlZmF1bHQpKGksZG9jdW1lbnQpLF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5yZXN0b3JlKCl9KSxtPSgwLF90YXJyeS50YXJyeSkoZnVuY3Rpb24oKXtjKCd0cmFuc2l0aW9uOmFmdGVyJyx7cm91dGU6Zn0pLGgoaiksYS5zdHlsZS5oZWlnaHQ9JycsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXRyYW5zaXRpb25pbmcnKX0pOygwLF90YXJyeS5xdWV1ZSkoaygwKSxsKGQpLG0oMCkpKCl9fTsiLCIndXNlIHN0cmljdCc7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pLGV4cG9ydHMuZGVmYXVsdD17cGF1c2VkOiExLF9zdGF0ZTp7cm91dGU6JycsdGl0bGU6JycscHJldjp7cm91dGU6Jy8nLHRpdGxlOicnfX0sZ2V0IHJvdXRlKCl7cmV0dXJuIHRoaXMuX3N0YXRlLnJvdXRlfSxzZXQgcm91dGUoYSl7dGhpcy5fc3RhdGUucHJldi5yb3V0ZT10aGlzLnJvdXRlLHRoaXMuX3N0YXRlLnJvdXRlPWF9LGdldCB0aXRsZSgpe3JldHVybiB0aGlzLl9zdGF0ZS50aXRsZX0sc2V0IHRpdGxlKGEpe3RoaXMuX3N0YXRlLnByZXYudGl0bGU9dGhpcy50aXRsZSx0aGlzLl9zdGF0ZS50aXRsZT1hfSxnZXQgcHJldigpe3JldHVybiB0aGlzLl9zdGF0ZS5wcmV2fX07IiwiJ3VzZSBzdHJpY3QnO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCdfX2VzTW9kdWxlJyx7dmFsdWU6ITB9KTt2YXIgZ2V0T3JpZ2luPWZ1bmN0aW9uKGIpe3ZhciBjPWIucHJvdG9jb2wsZD1iLmhvc3Q7cmV0dXJuIGMrJy8vJytkfSxwYXJzZVVSTD1mdW5jdGlvbihiKXt2YXIgYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7cmV0dXJuIGMuaHJlZj1iLGN9LG9yaWdpbj1leHBvcnRzLm9yaWdpbj1nZXRPcmlnaW4od2luZG93LmxvY2F0aW9uKSxvcmlnaW5SZWdFeD1uZXcgUmVnRXhwKG9yaWdpbiksc2FuaXRpemU9ZXhwb3J0cy5zYW5pdGl6ZT1mdW5jdGlvbihiKXt2YXIgYz1iLnJlcGxhY2Uob3JpZ2luUmVnRXgsJycpO3JldHVybiBjLm1hdGNoKC9eXFwvLyk/Yy5yZXBsYWNlKC9cXC97MX0vLCcnKTpjfSxsaW5rPWV4cG9ydHMubGluaz17aXNTYW1lT3JpZ2luOmZ1bmN0aW9uIGlzU2FtZU9yaWdpbihiKXtyZXR1cm4gb3JpZ2luPT09Z2V0T3JpZ2luKHBhcnNlVVJMKGIpKX0saXNIYXNoOmZ1bmN0aW9uIGlzSGFzaChiKXtyZXR1cm4gLyMvLnRlc3QoYil9LGlzU2FtZVVSTDpmdW5jdGlvbiBpc1NhbWVVUkwoYil7cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g9PT1wYXJzZVVSTChiKS5zZWFyY2gmJndpbmRvdy5sb2NhdGlvbi5wYXRobmFtZT09PXBhcnNlVVJMKGIpLnBhdGhuYW1lfX07IiwidmFyIG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdG9yLCBjaGVja1lvU2VsZikge1xyXG4gIHZhciBwYXJlbnQgPSBjaGVja1lvU2VsZiA/IGVsZW1lbnQgOiBlbGVtZW50LnBhcmVudE5vZGVcclxuXHJcbiAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAobWF0Y2hlcyhwYXJlbnQsIHNlbGVjdG9yKSkgcmV0dXJuIHBhcmVudDtcclxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlXHJcbiAgfVxyXG59XHJcbiIsInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnY2xvc2VzdCcpO1xuXG4vKipcbiAqIERlbGVnYXRlcyBldmVudCB0byBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBkZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBjbG9zZXN0IG1hdGNoIGFuZCBpbnZva2VzIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBsaXN0ZW5lcihlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IsIHRydWUpO1xuXG4gICAgICAgIGlmIChlLmRlbGVnYXRlVGFyZ2V0KSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsZW1lbnQsIGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9leHRlbmRzPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxiPTE7Yjxhcmd1bWVudHMubGVuZ3RoO2IrKylmb3IodmFyIGQgaW4gYz1hcmd1bWVudHNbYl0sYylPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYyxkKSYmKGFbZF09Y1tkXSk7cmV0dXJuIGF9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2V4cG9ydHMuZGVmYXVsdD1mdW5jdGlvbigpe3ZhciBhPTA8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzBdIT09dm9pZCAwP2FyZ3VtZW50c1swXTp7fSxiPXt9O3JldHVybiBfZXh0ZW5kcyh7fSxhLHtlbWl0OmZ1bmN0aW9uIGQoZil7dmFyIGc9MTxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMV0hPT12b2lkIDA/YXJndW1lbnRzWzFdOm51bGwsaD0hIWJbZl0mJmJbZl0ucXVldWU7aCYmaC5mb3JFYWNoKGZ1bmN0aW9uKGope3JldHVybiBqKGcpfSl9LG9uOmZ1bmN0aW9uIGMoZil7dmFyIGc9MTxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMV0hPT12b2lkIDA/YXJndW1lbnRzWzFdOm51bGw7ZyYmKGJbZl09YltmXXx8e3F1ZXVlOltdfSxiW2ZdLnF1ZXVlLnB1c2goZykpfX0pfTsiLCJcclxuLyoqXHJcbiAqIEVsZW1lbnQgcHJvdG90eXBlLlxyXG4gKi9cclxuXHJcbnZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiAqIFZlbmRvciBmdW5jdGlvbi5cclxuICovXHJcblxyXG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuLyoqXHJcbiAqIEV4cG9zZSBgbWF0Y2goKWAuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcclxuXHJcbi8qKlxyXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcclxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XHJcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XHJcbiAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn0iLCIvLyBCZXN0IHBsYWNlIHRvIGZpbmQgaW5mb3JtYXRpb24gb24gWEhSIGZlYXR1cmVzIGlzOlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XG5cbnZhciByZXFmaWVsZHMgPSBbXG4gICdyZXNwb25zZVR5cGUnLCAnd2l0aENyZWRlbnRpYWxzJywgJ3RpbWVvdXQnLCAnb25wcm9ncmVzcydcbl1cblxuLy8gU2ltcGxlIGFuZCBzbWFsbCBhamF4IGZ1bmN0aW9uXG4vLyBUYWtlcyBhIHBhcmFtZXRlcnMgb2JqZWN0IGFuZCBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4vLyBQYXJhbWV0ZXJzOlxuLy8gIC0gdXJsOiBzdHJpbmcsIHJlcXVpcmVkXG4vLyAgLSBoZWFkZXJzOiBvYmplY3Qgb2YgYHtoZWFkZXJfbmFtZTogaGVhZGVyX3ZhbHVlLCAuLi59YFxuLy8gIC0gYm9keTpcbi8vICAgICAgKyBzdHJpbmcgKHNldHMgY29udGVudCB0eXBlIHRvICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIGlmIG5vdCBzZXQgaW4gaGVhZGVycylcbi8vICAgICAgKyBGb3JtRGF0YSAoZG9lc24ndCBzZXQgY29udGVudCB0eXBlIHNvIHRoYXQgYnJvd3NlciB3aWxsIHNldCBhcyBhcHByb3ByaWF0ZSlcbi8vICAtIG1ldGhvZDogJ0dFVCcsICdQT1NUJywgZXRjLiBEZWZhdWx0cyB0byAnR0VUJyBvciAnUE9TVCcgYmFzZWQgb24gYm9keVxuLy8gIC0gY29yczogSWYgeW91ciB1c2luZyBjcm9zcy1vcmlnaW4sIHlvdSB3aWxsIG5lZWQgdGhpcyB0cnVlIGZvciBJRTgtOVxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgcGFyYW1ldGVycyBhcmUgcGFzc2VkIG9udG8gdGhlIHhociBvYmplY3QuXG4vLyBJTVBPUlRBTlQgTk9URTogVGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgY29tcGF0aWJpbGl0eSBjaGVja2luZy5cbi8vICAtIHJlc3BvbnNlVHlwZTogc3RyaW5nLCB2YXJpb3VzIGNvbXBhdGFiaWxpdHksIHNlZSB4aHIgZG9jcyBmb3IgZW51bSBvcHRpb25zXG4vLyAgLSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4sIElFMTArLCBDT1JTIG9ubHlcbi8vICAtIHRpbWVvdXQ6IGxvbmcsIG1zIHRpbWVvdXQsIElFOCtcbi8vICAtIG9ucHJvZ3Jlc3M6IGNhbGxiYWNrLCBJRTEwK1xuLy9cbi8vIENhbGxiYWNrIGZ1bmN0aW9uIHByb3RvdHlwZTpcbi8vICAtIHN0YXR1c0NvZGUgZnJvbSByZXF1ZXN0XG4vLyAgLSByZXNwb25zZVxuLy8gICAgKyBpZiByZXNwb25zZVR5cGUgc2V0IGFuZCBzdXBwb3J0ZWQgYnkgYnJvd3NlciwgdGhpcyBpcyBhbiBvYmplY3Qgb2Ygc29tZSB0eXBlIChzZWUgZG9jcylcbi8vICAgICsgb3RoZXJ3aXNlIGlmIHJlcXVlc3QgY29tcGxldGVkLCB0aGlzIGlzIHRoZSBzdHJpbmcgdGV4dCBvZiB0aGUgcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVxdWVzdCBpcyBhYm9ydGVkLCB0aGlzIGlzIFwiQWJvcnRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IHRpbWVzIG91dCwgdGhpcyBpcyBcIlRpbWVvdXRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IGVycm9ycyBiZWZvcmUgY29tcGxldGluZyAocHJvYmFibHkgYSBDT1JTIGlzc3VlKSwgdGhpcyBpcyBcIkVycm9yXCJcbi8vICAtIHJlcXVlc3Qgb2JqZWN0XG4vL1xuLy8gUmV0dXJucyB0aGUgcmVxdWVzdCBvYmplY3QuIFNvIHlvdSBjYW4gY2FsbCAuYWJvcnQoKSBvciBvdGhlciBtZXRob2RzXG4vL1xuLy8gREVQUkVDQVRJT05TOlxuLy8gIC0gUGFzc2luZyBhIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBwYXJhbXMgb2JqZWN0IGhhcyBiZWVuIHJlbW92ZWQhXG4vL1xuZXhwb3J0cy5hamF4ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgLy8gQW55IHZhcmlhYmxlIHVzZWQgbW9yZSB0aGFuIG9uY2UgaXMgdmFyJ2QgaGVyZSBiZWNhdXNlXG4gIC8vIG1pbmlmaWNhdGlvbiB3aWxsIG11bmdlIHRoZSB2YXJpYWJsZXMgd2hlcmVhcyBpdCBjYW4ndCBtdW5nZVxuICAvLyB0aGUgb2JqZWN0IGFjY2Vzcy5cbiAgdmFyIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyB8fCB7fVxuICAgICwgYm9keSA9IHBhcmFtcy5ib2R5XG4gICAgLCBtZXRob2QgPSBwYXJhbXMubWV0aG9kIHx8IChib2R5ID8gJ1BPU1QnIDogJ0dFVCcpXG4gICAgLCBjYWxsZWQgPSBmYWxzZVxuXG4gIHZhciByZXEgPSBnZXRSZXF1ZXN0KHBhcmFtcy5jb3JzKVxuXG4gIGZ1bmN0aW9uIGNiKHN0YXR1c0NvZGUsIHJlc3BvbnNlVGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzID09PSB1bmRlZmluZWQgPyBzdGF0dXNDb2RlIDogcmVxLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgcmVxLnN0YXR1cyA9PT0gMCA/IFwiRXJyb3JcIiA6IChyZXEucmVzcG9uc2UgfHwgcmVxLnJlc3BvbnNlVGV4dCB8fCByZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgICAgICByZXEpXG4gICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXEub3BlbihtZXRob2QsIHBhcmFtcy51cmwsIHRydWUpXG5cbiAgdmFyIHN1Y2Nlc3MgPSByZXEub25sb2FkID0gY2IoMjAwKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkgc3VjY2VzcygpXG4gIH1cbiAgcmVxLm9uZXJyb3IgPSBjYihudWxsLCAnRXJyb3InKVxuICByZXEub250aW1lb3V0ID0gY2IobnVsbCwgJ1RpbWVvdXQnKVxuICByZXEub25hYm9ydCA9IGNiKG51bGwsICdBYm9ydCcpXG5cbiAgaWYgKGJvZHkpIHtcbiAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0JylcblxuICAgIGlmICghZ2xvYmFsLkZvcm1EYXRhIHx8ICEoYm9keSBpbnN0YW5jZW9mIGdsb2JhbC5Gb3JtRGF0YSkpIHtcbiAgICAgIHNldERlZmF1bHQoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXFmaWVsZHMubGVuZ3RoLCBmaWVsZDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZmllbGQgPSByZXFmaWVsZHNbaV1cbiAgICBpZiAocGFyYW1zW2ZpZWxkXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmVxW2ZpZWxkXSA9IHBhcmFtc1tmaWVsZF1cbiAgfVxuXG4gIGZvciAodmFyIGZpZWxkIGluIGhlYWRlcnMpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIGhlYWRlcnNbZmllbGRdKVxuXG4gIHJlcS5zZW5kKGJvZHkpXG5cbiAgcmV0dXJuIHJlcVxufVxuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KGNvcnMpIHtcbiAgLy8gWERvbWFpblJlcXVlc3QgaXMgb25seSB3YXkgdG8gZG8gQ09SUyBpbiBJRSA4IGFuZCA5XG4gIC8vIEJ1dCBYRG9tYWluUmVxdWVzdCBpc24ndCBzdGFuZGFyZHMtY29tcGF0aWJsZVxuICAvLyBOb3RhYmx5LCBpdCBkb2Vzbid0IGFsbG93IGNvb2tpZXMgdG8gYmUgc2VudCBvciBzZXQgYnkgc2VydmVyc1xuICAvLyBJRSAxMCsgaXMgc3RhbmRhcmRzLWNvbXBhdGlibGUgaW4gaXRzIFhNTEh0dHBSZXF1ZXN0XG4gIC8vIGJ1dCBJRSAxMCBjYW4gc3RpbGwgaGF2ZSBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3QsIHNvIHdlIGRvbid0IHdhbnQgdG8gdXNlIGl0XG4gIGlmIChjb3JzICYmIGdsb2JhbC5YRG9tYWluUmVxdWVzdCAmJiAhL01TSUUgMS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0XG4gIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpXG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdFxufVxuXG5mdW5jdGlvbiBzZXREZWZhdWx0KG9iaiwga2V5LCB2YWx1ZSkge1xuICBvYmpba2V5XSA9IG9ialtrZXldIHx8IHZhbHVlXG59XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIk5hdmlnb1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHR2YXIgUEFSQU1FVEVSX1JFR0VYUCA9IC8oWzoqXSkoXFx3KykvZztcblx0dmFyIFdJTERDQVJEX1JFR0VYUCA9IC9cXCovZztcblx0dmFyIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQID0gJyhbXlxcL10rKSc7XG5cdHZhciBSRVBMQUNFX1dJTERDQVJEID0gJyg/Oi4qKSc7XG5cdHZhciBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFAgPSAnKD86XFwvfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmluZE1hdGNoZWRSb3V0ZXModXJsKSB7XG5cdCAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICByZXR1cm4gcm91dGVzLm1hcChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciBfcmVwbGFjZUR5bmFtaWNVUkxQYXIgPSByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICB2YXIgcmVnZXhwID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnJlZ2V4cDtcblx0ICAgIHZhciBwYXJhbU5hbWVzID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnBhcmFtTmFtZXM7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gdXJsLm1hdGNoKHJlZ2V4cCk7XG5cdCAgICB2YXIgcGFyYW1zID0gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIHBhcmFtTmFtZXMpO1xuXHRcblx0ICAgIHJldHVybiBtYXRjaCA/IHsgbWF0Y2g6IG1hdGNoLCByb3V0ZTogcm91dGUsIHBhcmFtczogcGFyYW1zIH0gOiBmYWxzZTtcblx0ICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcblx0ICAgIHJldHVybiBtO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBtYXRjaCh1cmwsIHJvdXRlcykge1xuXHQgIHJldHVybiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcylbMF0gfHwgZmFsc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJvb3QodXJsLCByb3V0ZXMpIHtcblx0ICB2YXIgbWF0Y2hlZCA9IGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciB1ID0gY2xlYW4ocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHJldHVybiB1ICE9PSAnJyAmJiB1ICE9PSAnKic7XG5cdCAgfSkpO1xuXHQgIHZhciBmYWxsYmFja1VSTCA9IGNsZWFuKHVybCk7XG5cdFxuXHQgIGlmIChtYXRjaGVkLmxlbmd0aCA+IDApIHtcblx0ICAgIHJldHVybiBtYXRjaGVkLm1hcChmdW5jdGlvbiAobSkge1xuXHQgICAgICByZXR1cm4gY2xlYW4odXJsLnN1YnN0cigwLCBtLm1hdGNoLmluZGV4KSk7XG5cdCAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJvb3QsIGN1cnJlbnQpIHtcblx0ICAgICAgcmV0dXJuIGN1cnJlbnQubGVuZ3RoIDwgcm9vdC5sZW5ndGggPyBjdXJyZW50IDogcm9vdDtcblx0ICAgIH0sIGZhbGxiYWNrVVJMKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZhbGxiYWNrVVJMO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpIHtcblx0ICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gTmF2aWdvKHIsIHVzZUhhc2gpIHtcblx0ICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICB0aGlzLnJvb3QgPSB1c2VIYXNoICYmIHIgPyByLnJlcGxhY2UoL1xcLyQvLCAnLyMnKSA6IHIgfHwgbnVsbDtcblx0ICB0aGlzLl91c2VIYXNoID0gdXNlSGFzaDtcblx0ICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IG51bGw7XG5cdCAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fb2sgPSAhdXNlSGFzaCAmJiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpO1xuXHQgIHRoaXMuX2xpc3RlbigpO1xuXHQgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG5cdH1cblx0XG5cdE5hdmlnby5wcm90b3R5cGUgPSB7XG5cdCAgaGVscGVyczoge1xuXHQgICAgbWF0Y2g6IG1hdGNoLFxuXHQgICAgcm9vdDogcm9vdCxcblx0ICAgIGNsZWFuOiBjbGVhblxuXHQgIH0sXG5cdCAgbmF2aWdhdGU6IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGgsIGFic29sdXRlKSB7XG5cdCAgICB2YXIgdG87XG5cdFxuXHQgICAgcGF0aCA9IHBhdGggfHwgJyc7XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgdG8gPSAoIWFic29sdXRlID8gdGhpcy5fZ2V0Um9vdCgpICsgJy8nIDogJycpICsgY2xlYW4ocGF0aCk7XG5cdCAgICAgIHRvID0gdG8ucmVwbGFjZSgvKFteOl0pKFxcL3syLH0pL2csICckMS8nKTtcblx0ICAgICAgaGlzdG9yeVt0aGlzLl9wYXVzZWQgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7fSwgJycsIHRvKTtcblx0ICAgICAgdGhpcy5yZXNvbHZlKCk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvIyguKikkLywgJycpICsgJyMnICsgcGF0aDtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgb246IGZ1bmN0aW9uIG9uKCkge1xuXHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdLCBhcmd1bWVudHMubGVuZ3RoIDw9IDEgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMV0pO1xuXHQgICAgfSBlbHNlIGlmIChfdHlwZW9mKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIGZvciAodmFyIHJvdXRlIGluIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkge1xuXHQgICAgICAgIHRoaXMuX2FkZChyb3V0ZSwgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSlbcm91dGVdKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG5vdEZvdW5kOiBmdW5jdGlvbiBub3RGb3VuZChoYW5kbGVyKSB7XG5cdCAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBoYW5kbGVyO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZShjdXJyZW50KSB7XG5cdCAgICB2YXIgaGFuZGxlciwgbTtcblx0ICAgIHZhciB1cmwgPSAoY3VycmVudCB8fCB0aGlzLl9jTG9jKCkpLnJlcGxhY2UodGhpcy5fZ2V0Um9vdCgpLCAnJyk7XG5cdFxuXHQgICAgaWYgKHRoaXMuX3BhdXNlZCB8fCB1cmwgPT09IHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5fdXNlSGFzaCkge1xuXHQgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLyMvLCAnLycpO1xuXHQgICAgfVxuXHQgICAgbSA9IG1hdGNoKHVybCwgdGhpcy5fcm91dGVzKTtcblx0XG5cdCAgICBpZiAobSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgaGFuZGxlciA9IG0ucm91dGUuaGFuZGxlcjtcblx0ICAgICAgbS5yb3V0ZS5yb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IGhhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBfdG9Db25zdW1hYmxlQXJyYXkobS5tYXRjaC5zbGljZSgxLCBtLm1hdGNoLmxlbmd0aCkpKSA6IGhhbmRsZXIobS5wYXJhbXMpO1xuXHQgICAgICByZXR1cm4gbTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmYXVsdEhhbmRsZXIgJiYgKHVybCA9PT0gJycgfHwgdXJsID09PSAnLycpKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyKCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZEhhbmRsZXIpIHtcblx0ICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSxcblx0ICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXHQgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCk7XG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbCA6IG51bGw7XG5cdCAgfSxcblx0ICB1cGRhdGVQYWdlTGlua3M6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VMaW5rcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0XG5cdCAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXHRcblx0ICAgIHRoaXMuX2ZpbmRMaW5rcygpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0ICAgICAgaWYgKCFsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQpIHtcblx0ICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0ICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFxuXHQgICAgICAgICAgaWYgKCFzZWxmLl9kZXN0cm95ZWQpIHtcblx0ICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBzZWxmLm5hdmlnYXRlKGNsZWFuKGxvY2F0aW9uKSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSkge1xuXHQgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICByZXR1cm4gdGhpcy5fcm91dGVzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3V0ZSkge1xuXHQgICAgICB2YXIga2V5O1xuXHRcblx0ICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IG5hbWUpIHtcblx0ICAgICAgICByZXN1bHQgPSByb3V0ZS5yb3V0ZTtcblx0ICAgICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnOicgKyBrZXksIGRhdGFba2V5XSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LCAnJyk7XG5cdCAgfSxcblx0ICBsaW5rOiBmdW5jdGlvbiBsaW5rKHBhdGgpIHtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRSb290KCkgKyBwYXRoO1xuXHQgIH0sXG5cdCAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHN0YXR1cykge1xuXHQgICAgdGhpcy5fcGF1c2VkID0gc3RhdHVzO1xuXHQgIH0sXG5cdCAgZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlOiBmdW5jdGlvbiBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGUoKSB7XG5cdCAgICBpZiAoIWlzUHVzaFN0YXRlQXZhaWxhYmxlKCkpIHtcblx0ICAgICAgdGhpcy5kZXN0cm95KCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfYWRkOiBmdW5jdGlvbiBfYWRkKHJvdXRlKSB7XG5cdCAgICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgaWYgKCh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaGFuZGxlcikpID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlci51c2VzLCBuYW1lOiBoYW5kbGVyLmFzIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fYWRkO1xuXHQgIH0sXG5cdCAgX2dldFJvb3Q6IGZ1bmN0aW9uIF9nZXRSb290KCkge1xuXHQgICAgaWYgKHRoaXMucm9vdCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMucm9vdDtcblx0ICAgIHRoaXMucm9vdCA9IHJvb3QodGhpcy5fY0xvYygpLCB0aGlzLl9yb3V0ZXMpO1xuXHQgICAgcmV0dXJuIHRoaXMucm9vdDtcblx0ICB9LFxuXHQgIF9saXN0ZW46IGZ1bmN0aW9uIF9saXN0ZW4oKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpcy5yZXNvbHZlKCk7XG5cdCAgICAgIH07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciBjYWNoZWQgPSBfdGhpcy5fY0xvYygpLFxuXHQgICAgICAgICAgICBjdXJyZW50ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgICAgICBfY2hlY2sgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICAgIF9jaGVjayA9IGZ1bmN0aW9uIGNoZWNrKCkge1xuXHQgICAgICAgICAgY3VycmVudCA9IF90aGlzLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzLnJlc29sdmUoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIF90aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwgPSBzZXRUaW1lb3V0KF9jaGVjaywgMjAwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICAgIF9jaGVjaygpO1xuXHQgICAgICB9KSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2NMb2M6IGZ1bmN0aW9uIF9jTG9jKCkge1xuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0ICB9LFxuXHQgIF9maW5kTGlua3M6IGZ1bmN0aW9uIF9maW5kTGlua3MoKSB7XG5cdCAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uYXZpZ29dJykpO1xuXHQgIH1cblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE5hdmlnbztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdmlnby5qcy5tYXAiLCIndXNlIHN0cmljdCc7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO3ZhciBzY3JvbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIHdpbmRvdy5zY3JvbGxUbygwLGEpfSxzdGF0ZT1mdW5jdGlvbigpe3JldHVybiBoaXN0b3J5LnN0YXRlP2hpc3Rvcnkuc3RhdGUuc2Nyb2xsUG9zaXRpb246MH0sc2F2ZT1mdW5jdGlvbigpe3dpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7c2Nyb2xsUG9zaXRpb246d2luZG93LnBhZ2VZT2Zmc2V0fHx3aW5kb3cuc2Nyb2xsWX0sJycpfSxyZXN0b3JlPWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOm51bGwsYj1zdGF0ZSgpO2I/YT9hKGIpOnNjcm9sbChiKTpzY3JvbGwoMCl9LGluc3RhbmNlPXtnZXQgZXhwb3J0KCl7cmV0dXJuJ3VuZGVmaW5lZCc9PXR5cGVvZiB3aW5kb3c/e306KCdzY3JvbGxSZXN0b3JhdGlvbidpbiBoaXN0b3J5JiYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbj0nbWFudWFsJyxzY3JvbGwoc3RhdGUoKSksd2luZG93Lm9uYmVmb3JldW5sb2FkPXNhdmUpLHtzYXZlOnNhdmUscmVzdG9yZTpyZXN0b3JlLHN0YXRlOnN0YXRlfSl9fTtleHBvcnRzLmRlZmF1bHQ9aW5zdGFuY2UuZXhwb3J0OyIsImNvbnN0IHJ1biA9IChjYiwgYXJncykgPT4ge1xuICBjYigpXG4gIGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzLnNoaWZ0KCkoLi4uYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHRhcnJ5ID0gKGNiLCBkZWxheSA9IG51bGwpID0+ICguLi5hcmdzKSA9PiB7XG4gIGxldCBvdmVycmlkZSA9ICdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSA/IGFyZ3NbMF0gOiBudWxsIFxuICByZXR1cm4gJ251bWJlcicgPT09IHR5cGVvZiBvdmVycmlkZSAmJiBvdmVycmlkZSA+IC0xIFxuICAgID8gdGFycnkoY2IsIG92ZXJyaWRlKSBcbiAgICA6ICdudW1iZXInID09PSB0eXBlb2YgZGVsYXkgJiYgZGVsYXkgPiAtMSBcbiAgICAgID8gc2V0VGltZW91dCgoKSA9PiBydW4oY2IsIGFyZ3MpLCBkZWxheSkgXG4gICAgICA6IHJ1bihjYiwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHF1ZXVlID0gKC4uLmFyZ3MpID0+ICgpID0+IGFyZ3Muc2hpZnQoKSguLi5hcmdzKVxuIl19
