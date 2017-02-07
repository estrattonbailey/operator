'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _loop = require('loop.js');

var _loop2 = _interopRequireDefault(_loop);

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _nanoajax = require('nanoajax');

var _nanoajax2 = _interopRequireDefault(_nanoajax);

var _navigo = require('navigo');

var _navigo2 = _interopRequireDefault(_navigo);

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = window.history;

var router = new _navigo2.default(_util.origin);

var state = {
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
    (0, _util.setActiveLinks)(loc);
  },
  get title() {
    return this._state.title;
  },
  set title(val) {
    this._state.prev.title = this.title;
    this._state.title = val;
    document.title = val;
  }
};

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var root = options.root || document.body;
  var duration = options.duration || 0;
  var ignore = options.ignore || [];

  var events = (0, _loop2.default)();
  var render = (0, _dom2.default)(root, duration, events);

  var instance = Object.create(_extends({}, events, {
    stop: function stop() {
      state.paused = true;
    },
    start: function start() {
      state.paused = false;
    },

    go: go,
    push: push
  }), {
    getState: {
      value: function value() {
        return state._state;
      }
    }
  });

  state.route = window.location.pathname + window.location.search;
  state.title = document.title;

  (0, _delegate2.default)(document, 'a', 'click', function (e) {
    var a = e.delegateTarget;
    var href = a.getAttribute('href') || '/';
    var route = (0, _util.sanitize)(href);

    if (!_util.link.isSameOrigin(href) || a.getAttribute('rel') === 'external' || a.classList.contains('no-ajax') || matches(e, route) || _util.link.isHash(href)) {
      return;
    }

    e.preventDefault();

    if (_util.link.isSameURL(href)) {
      return;
    }

    go(_util.origin + '/' + route);

    return false;
  });

  window.onpopstate = function (e) {
    var to = e.target.location.href;

    if (matches(e, to)) {
      if (_util.link.isHash(to)) {
        return;
      }
      window.location.reload();
      return;
    }

    /**
     * Popstate bypasses router, so we
     * need to tell it where we went to
     * without pushing state
     */
    go(to, null, true);
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';

    if (history.state && history.state.scrollTop !== undefined) {
      window.scrollTo(0, history.state.scrollTop);
    }

    window.onbeforeunload = _util.saveScrollPosition;
  }

  /**
   * @param {string} route
   * @param {function} cb
   * @param {boolean} resolve Use Navigo.resolve(), bypass Navigo.navigate()
   *
   * Popstate changes the URL for us, so if we were to
   * router.navigate() to the previous location, it would push
   * a duplicate route to history and we would create a loop.
   *
   * router.resolve() let's Navigo know we've moved, without
   * altering history.
   */
  function go(route) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var resolve = arguments[2];

    var to = (0, _util.sanitize)(route);

    resolve ? null : (0, _util.saveScrollPosition)();

    events.emit('before:route', { route: to });

    if (state.paused) {
      return;
    }

    get(_util.origin + '/' + to, function (title) {
      resolve ? router.resolve(to) : router.navigate(to);

      // Update state
      pushRoute(to, title);

      events.emit('after:route', {
        route: to,
        title: title
      });

      cb ? cb(to, title) : null;
    });
  }

  function push() {
    var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.route;
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    router.navigate(loc);
    state.route = loc;
    title ? state.title = title : null;
  }

  function get(route, cb) {
    return _nanoajax2.default.ajax({
      method: 'GET',
      url: route
    }, function (status, res, req) {
      if (req.status < 200 || req.status > 300 && req.status !== 304) {
        window.location = _util.origin + '/' + state._state.prev.route;
        return;
      }
      render(req.response, cb);
    });
  }

  function pushRoute(loc) {
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    state.route = loc;
    title ? state.title = title : null;
  }

  function matches(event, route) {
    return ignore.filter(function (t) {
      if (Array.isArray(t)) {
        var res = t[1](route);
        if (res) {
          events.emit(t[0], {
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

  return instance;
};