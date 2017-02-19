(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *  Client script config:
 */
var $appSettings = {};

$appSettings.appName = 'Clinic Finder';

// If the URL entered doesn't match any of the defined routes:
$appSettings.defaultController = 'basicQuestions';

// Manage app API:
$appSettings.api = {};
$appSettings.api.protocol = 'http';
$appSettings.api.domain = 'findaclinic.org';
$appSettings.api.version = 'v1';

$appSettings.api.endpoints = {};
$appSettings.api.endpoints.clinicOptions = 'clinic';

// Elements:
$appSettings.elemIds = {};
$appSettings.elemIds.root = 'app-root';

// Universal CSS clsses
$appSettings.cssClasses = {};
$appSettings.cssClasses.hidden = 'hidden';

// Google maps creds:
$appSettings.maps = {};
$appSettings.maps.key = 'AIzaSyDzwNXXahZJee-P6VzqwUlQ_ILOOkqDOsw';
$appSettings.maps.api = {};
$appSettings.maps.api.search = 'https://maps.googleapis.com/maps/api/js';
$appSettings.maps.api.directions = 'https://www.google.com/maps/embed/v1/directions';

exports.default = $appSettings;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _wake = require('./wake');

var _wake2 = _interopRequireDefault(_wake);

var _sleep = require('./sleep');

var _sleep2 = _interopRequireDefault(_sleep);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var controllerInit = function controllerInit(globalSettings, state, controllers, globalUtilities) {
    var controller = {};
    controller.elems = null; // Will be populated by the init step.
    controller.settings = _settings2.default;
    controller.init = (0, _init2.default)(globalSettings, state, controllers, globalUtilities);
    controller.wake = (0, _wake2.default)(globalSettings, state, controllers, globalUtilities);
    controller.sleep = (0, _sleep2.default)(globalSettings, state, controllers, globalUtilities);
    controller.utilities = _utilities2.default.call(controller, globalSettings, state, controllers, globalUtilities);

    controller.default = _settings2.default.isDefault || false;

    controller.state = {};
    controller.state.awake = false;
    controller.state.initted = false;

    return controller;
};

exports.default = controllerInit;

},{"./init":3,"./settings":4,"./sleep":5,"./utilities":7,"./wake":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getInit = function getInit(globalSettings, state, controllers, globalUtilities) {

    /** Enter Init Code Here */
    var appInit = /**
                  this // The controller
                  globalSettings // Application Settings
                  globalState // Access to the state of other controllers
                  controllers // Access to other controllers
                  globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                  */

    function appInit() /* Your args here */{
        var _this = this;

        this.elems.submitButton.addEventListener('click', function () {
            var trimester = _this.elems.trimester.value;
            var age = _this.elems.age.value;
            var zip = _this.elems.zip.value;
            if (!trimester || !age || !zip) {
                alert('Please make sure to complete the form.');
                return;
            } else if (isNaN(age)) {
                alert('Please enter a valid age.');
                return;
            } else if (isNaN(zip) || zip.length !== 5) {
                alert('Please enter a valid zip code.');
                return;
            }
            var userStatus = {
                trimester: trimester,
                age: age,
                zip: zip
            };
            state.userStatus = userStatus;
            var url = globalUtilities.getApiEndpoint('clinicOptions');
            globalUtilities.ajax({ url: url, userStatus: userStatus }).then(function (response) {
                return controllers.clinicSelection.wake(response);
            }).then(function () {
                _this.sleep();
            });
        });
    };

    var init = initDecorator(globalSettings, state, controllers, globalUtilities, appInit);
    return init;
};

/**
 * In the function returned by initDecorator, we place anything that will be universal to the init step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appInit
 * @returns {function()}
 */

var initDecorator = function initDecorator(globalSettings, state, controllers, globalUtilities, appInit) {
    var init = function init() {
        // Gather elements for this controller
        this.elems = globalUtilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call.apply(appInit, [this].concat(Array.prototype.slice.call(arguments))));
    };
    return init;
};

exports.default = getInit;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var settings = {};

settings.key = 'basicQuestions';
settings.title = 'Basic Questions';

settings.isDefault = true;
settings.route = 'questions';

settings.elementIds = {};
settings.elementIds.body = 'body-basic-questions';
settings.elementIds.trimester = 'trimester';
settings.elementIds.age = 'age';
settings.elementIds.zip = 'zip';
settings.elementIds.submitButton = 'submit-button';

exports.default = settings;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getSleep = function getSleep(globalSettings, state, controllers, globalUtilities) {
    var appSleep = /**
                   this // The controller
                   globalSettings // Application Settings
                   globalState // Access to the state of other controllers
                   controllers // Access to other controllers
                   globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                   */

    function appSleep() /* Your args here */{

        controllers.itinerary.wake();
    };

    var sleep = sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep);
    return sleep;
};

var sleepDecorator = function sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep) {
    var sleep = function sleep() {
        if (this.state.awake === false) {
            return false;
        }
        this.state.awake = false;
        if (this.elems.body) {
            this.elems.body.classList.add(globalSettings.cssClasses.hidden);
        }
        return appSleep.apply(undefined, arguments);
    };
    return sleep;
};

exports.default = getSleep;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getUtilities = function getUtilities(globalSettings, state, controllers, globalUtilities) {
    var appUtility = function appUtility() {
        console.log('At your disposal:', {
            globalSettings: globalSettings, state: state, controllers: controllers, globalUtilities: globalUtilities, this: this
        });
    };
    var scopedUtility = appUtility.bind(this);
    return scopedUtility;
};

exports.default = getUtilities;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _example = require('./example.js');

var _example2 = _interopRequireDefault(_example);

function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
}

var utilityInits = {};

var utilitiesInit = function utilitiesInit(appSettings, state, controllers, routes) {
      var _this = this;

      return Object.keys(utilityInits).reduce(function (utilities, utilityName) {
            utilities[utilityName] = utilityInits[utilityName].call(_this, appSettings, state, controllers, routes);
            return utilities;
      }, {});
};

utilityInits.example = _example2.default;

exports.default = utilitiesInit;

},{"./example.js":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getWake = function getWake(globalSettings, state, controllers, globalUtilities) {
    var appWake = /**
                  this // The controller
                  globalSettings // Application Settings
                  globalState // Access to the state of other controllers
                  controllers // Access to other controllers
                  globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                  */

    function appWake() /* Your args here */{

        globalUtilities.sleepAllExcept(this.settings.key);
        this.utilities.example();
    };

    var wake = wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake);
    return wake;
};

/**
 * In the function returned by wakeDecorator, we place anything that will be universal to the wake step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appWake
 * @return Promise resolving with the result of the appWake function
 */
var wakeDecorator = function wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake) {
    var wake = function wake() {
        var _this = this,
            _arguments = arguments;

        var coreFn = function coreFn() {
            if (_this.elems.body) {
                _this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
            }
            if (_this.settings.title && _this.settings.route) {
                console.warn("TODO: Turn on page history");
                // history.pushState(state, `${globalSettings.appName} - ${this.settings.title}`, this.settings.route);
            }
            return appWake.call.apply(appWake, [_this].concat(Array.prototype.slice.call(_arguments)));
        };
        // Init the first time wake is run:
        if (this.state.initted !== true) {
            this.state.initted = true;
            return this.init().then(function () {
                return coreFn.apply(undefined, _arguments);
            });
        } else {
            // Since init always returns a promise, wake will always return a promise
            // Show body of controller, if exists
            return Promise.resolve(coreFn.apply(undefined, arguments));
        }
    };
    return wake;
};

exports.default = getWake;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _wake = require('./wake');

var _wake2 = _interopRequireDefault(_wake);

var _sleep = require('./sleep');

var _sleep2 = _interopRequireDefault(_sleep);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var controllerInit = function controllerInit(globalSettings, state, controllers, globalUtilities) {
    var controller = {};
    controller.elems = null; // Will be populated by the init step.
    controller.settings = _settings2.default;
    controller.init = (0, _init2.default)(globalSettings, state, controllers, globalUtilities);
    controller.wake = (0, _wake2.default)(globalSettings, state, controllers, globalUtilities);
    controller.sleep = (0, _sleep2.default)(globalSettings, state, controllers, globalUtilities);
    controller.utilities = _utilities2.default.call(controller, globalSettings, state, controllers, globalUtilities);

    controller.default = _settings2.default.isDefault || false;

    controller.state = {};
    controller.state.awake = false;
    controller.state.initted = false;

    return controller;
};

exports.default = controllerInit;

},{"./init":10,"./settings":11,"./sleep":12,"./utilities":14,"./wake":16}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getInit = function getInit(globalSettings, state, controllers, globalUtilities) {

    /** Enter Init Code Here */
    var appInit = /**
                  this // The controller
                  globalSettings // Application Settings
                  globalState // Access to the state of other controllers
                  controllers // Access to other controllers
                  globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                  */

    function appInit() /* Your args here */{

        // Attach click listener for nav toggle:
        this.elems.collapseButton.addEventListener('click', this.utilities.collapse());

        // Create map for clinic search results:
        state.map = new google.maps.Map(localState.elems.mapContainer, {
            zoom: 4
        });
    };

    var init = initDecorator(globalSettings, state, controllers, globalUtilities, appInit);
    return init;
};

/**
 * In the function returned by initDecorator, we place anything that will be universal to the init step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appInit
 * @returns {function()}
 */

var initDecorator = function initDecorator(globalSettings, state, controllers, globalUtilities, appInit) {
    var init = function init() {
        // Gather elements for this controller
        this.elems = globalUtilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call.apply(appInit, [this].concat(Array.prototype.slice.call(arguments))));
    };
    return init;
};

exports.default = getInit;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var settings = {};

settings.key = 'clinicSelection';
settings.title = 'Clinic Selection';

settings.isDefault = false;
settings.route = 'chooseclinic';

settings.elementIds = {};
settings.elementIds.body = 'body-clinic-select';
settings.elementIds.leftTray = 'left-tray';
settings.elementIds.collapseButton = 'collapse-button';
settings.elementIds.bottomTray = 'bottom-tray';

exports.default = settings;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getSleep = function getSleep(globalSettings, state, controllers, globalUtilities) {
    var appSleep = /**
                   this // The controller
                   globalSettings // Application Settings
                   globalState // Access to the state of other controllers
                   controllers // Access to other controllers
                   globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                   */

    function appSleep() /* Your args here */{};

    var sleep = sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep);
    return sleep;
};

var sleepDecorator = function sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep) {
    var sleep = function sleep() {
        if (this.state.awake === false) {
            return false;
        }
        this.state.awake = false;
        if (this.elems.body) {
            this.elems.body.classList.add(globalSettings.cssClasses.hidden);
        }
        return appSleep.apply(undefined, arguments);
    };
    return sleep;
};

exports.default = getSleep;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getUtilities = function getUtilities(globalSettings, state, controllers, globalUtilities) {
    var appUtility = function appUtility() {
        var _this = this;

        var buttonOffset = this.elems.collapseButton.offsetWidth * 1.5;
        var collapseAmount = this.elems.leftTray.offsetWidth - buttonOffset;
        var isCollapsed = false;
        return function () {
            if (isCollapsed === false) {
                isCollapsed = true;
                _this.elems.collapseButton.innerHTML = '>>';
                _this.elems.leftTray.style.left = -1 * collapseAmount + 'px';
                _this.elems.bottomTray.style.paddingLeft = buttonOffset + 30 + 'px';
            } else {
                isCollapsed = false;
                _this.elems.collapseButton.innerHTML = '<<';
                _this.elems.leftTray.style.left = 0;
                _this.elems.bottomTray.style.paddingLeft = collapseAmount + 90 + 'px';
            }
        };
    };
    var scopedUtility = appUtility.bind(this);
    return scopedUtility;
};

exports.default = getUtilities;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
                                value: true
});

var _collapse = require('./collapse.js');

var _collapse2 = _interopRequireDefault(_collapse);

var _populate_map = require('./populate_map.js');

var _populate_map2 = _interopRequireDefault(_populate_map);

function _interopRequireDefault(obj) {
                                return obj && obj.__esModule ? obj : { default: obj };
}

var utilityInits = {};

var utilitiesInit = function utilitiesInit(appSettings, state, controllers, routes) {
                                var _this = this;

                                return Object.keys(utilityInits).reduce(function (utilities, utilityName) {
                                                                utilities[utilityName] = utilityInits[utilityName].call(_this, appSettings, state, controllers, routes);
                                                                return utilities;
                                }, {});
};

utilityInits.collapse = _collapse2.default;

utilityInits.populateMap = _populate_map2.default;

exports.default = utilitiesInit;

},{"./collapse.js":13,"./populate_map.js":15}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getUtilities = function getUtilities(globalSettings, state, controllers, globalUtilities) {
    var appUtility = function appUtility(clinics) {
        var createMapMarkers = clinics.map(addMarkerWithTimeout);
        return Promise.all(createMapMarkers);
    };

    var addMarkerWithTimeout = function addMarkerWithTimeout() {
        var interval = 100;
        // Start it at one less interval than zero, so the first timeout is zero
        var timeout = 0 - interval;
        return function (clinic) {
            timeout = timeout + interval;
            return new Promise(function (resolve) {
                window.setTimeout(function () {
                    var marker = new winodw.google.maps.Marker({
                        title: clinic.name,
                        position: clinic.location,
                        animation: google.maps.Animation.DROP,
                        map: map
                    });
                    resolve(marker);
                }, timeout);
            });
        };
    };

    var scopedUtility = appUtility.bind(this);
    return scopedUtility;
};

exports.default = getUtilities;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getWake = function getWake(globalSettings, state, controllers, globalUtilities) {
    var appWake = /**
                  this // The controller
                  globalSettings // Application Settings
                  controllers // Access to other controllers
                  globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                  */

    function appWake(response) {
        if (response === undefined) {
            // If user has arrived here without a server response, it's probably because they pasted the URL into their address bar.
            // This being the case, push them back to the userStatus acquisition phase.
            controllers.basicQuestions.wake().then(this.sleep);
            return;
        }

        history.replaceState({}, this.settings.title, this.settings.route);

        this.utilities.populateMap(clinic);
    };

    var wake = wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake);
    return wake;
};

/**
 * In the function returned by wakeDecorator, we place anything that will be universal to the wake step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appWake
 * @return Promise resolving with the result of the appWake function
 */
var wakeDecorator = function wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake) {
    var wake = function wake() {
        var _this = this,
            _arguments = arguments;

        var coreFn = function coreFn() {
            if (_this.elems.body) {
                _this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
            }
            if (_this.settings.title && _this.settings.route) {
                console.warn("TODO: Turn on page history");
                // history.pushState(state, `${globalSettings.appName} - ${this.settings.title}`, this.settings.route);
            }
            return appWake.call.apply(appWake, [_this].concat(Array.prototype.slice.call(_arguments)));
        };
        // Init the first time wake is run:
        if (this.state.initted !== true) {
            this.state.initted = true;
            return this.init().then(function () {
                return coreFn.apply(undefined, _arguments);
            });
        } else {
            // Since init always returns a promise, wake will always return a promise
            // Show body of controller, if exists
            return Promise.resolve(coreFn.apply(undefined, arguments));
        }
    };
    return wake;
};

exports.default = getWake;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _wake = require('./wake');

var _wake2 = _interopRequireDefault(_wake);

var _sleep = require('./sleep');

var _sleep2 = _interopRequireDefault(_sleep);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var controllerInit = function controllerInit(globalSettings, state, controllers, globalUtilities) {
    var controller = {};
    controller.elems = null; // Will be populated by the init step.
    controller.settings = _settings2.default;
    controller.init = (0, _init2.default)(globalSettings, state, controllers, globalUtilities);
    controller.wake = (0, _wake2.default)(globalSettings, state, controllers, globalUtilities);
    controller.sleep = (0, _sleep2.default)(globalSettings, state, controllers, globalUtilities);
    controller.utilities = (0, _utilities2.default)(globalSettings, state, controllers, globalUtilities);

    controller.default = _settings2.default.isDefault || false;

    controller.state = {};
    controller.state.awake = false;
    controller.state.initted = false;

    return controller;
};

exports.default = controllerInit;

},{"./init":18,"./settings":19,"./sleep":20,"./utilities":21,"./wake":22}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getInit = function getInit(globalSettings, state, controllers, globalUtilities) {

    /** Enter Init Code Here */
    var appInit = /**
                  this // The controller
                  globalSettings // Application Settings
                  globalState // Access to the state of other controllers
                  controllers // Access to other controllers
                  globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                  */

    function appInit() /* Your args here */{};

    var init = initDecorator(globalSettings, state, controllers, globalUtilities, appInit);
    return init;
};

/**
 * In the function returned by initDecorator, we place anything that will be universal to the init step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appInit
 * @returns {function()}
 */

var initDecorator = function initDecorator(globalSettings, state, controllers, globalUtilities, appInit) {
    var init = function init() {
        // Gather elements for this controller
        this.elems = globalUtilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call.apply(appInit, [this].concat(Array.prototype.slice.call(arguments))));
    };
    return init;
};

exports.default = getInit;

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var settings = {};

settings.key = 'itinerary';

settings.isDefault = false;
settings.route = '';

settings.elementIds = {};
settings.elementIds.body = '';

exports.default = settings;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getSleep = function getSleep(globalSettings, state, controllers, globalUtilities) {
    var appSleep = /**
                   this // The controller
                   globalSettings // Application Settings
                   globalState // Access to the state of other controllers
                   controllers // Access to other controllers
                   globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                   */

    function appSleep() /* Your args here */{

        this.elems.body.classList.add(globalSettings.cssClasses.hidden);
    };

    var sleep = sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep);
    return sleep;
};

var sleepDecorator = function sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep) {
    var sleep = function sleep() {
        if (this.state.awake === false) {
            return false;
        }
        this.state.awake = false;
        if (this.elems.body) {
            this.elems.body.classList.add(globalSettings.cssClasses.hidden);
        }
        return appSleep.apply(undefined, arguments);
    };
    return sleep;
};

exports.default = getSleep;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var utilityInits = {};

var utilitiesInit = function utilitiesInit(appSettings, state, controllers, routes) {
      var _this = this;

      return Object.keys(utilityInits).reduce(function (utilities, utilityName) {
            utilities[utilityName] = utilityInits[utilityName].call(_this, appSettings, state, controllers, routes);
            return utilities;
      }, {});
};

exports.default = utilitiesInit;

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getWake = function getWake(globalSettings, state, controllers, globalUtilities) {
    var appWake = /**
                  this // The controller
                  globalSettings // Application Settings
                  controllers // Access to other controllers
                  globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
                  */

    function appWake() /* Your args here */{

        this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
        globalUtilities.sleepAllExcept(name);

        if (!this.state.zip || !this.state.destination) {
            // If the state does contaier the to and from, yet, attempt to grab them from the URL
            var qParts = utilities.g.getQStringObj();
            this.state.zip = qParts.zip;
            this.state.destination = qParts.destination;
        }

        if (!this.directionsIframe) {
            this.directionsIframe = createDirectionsIframe();
        }
    };

    var createDirectionsIframe = function createDirectionsIframe(origin, destination) {
        var escapedOrigin = utilities.g.escapeSpaces(origin);
        var escapedDestination = utilities.g.escapeSpaces(destination);
        var iframe = document.createElement('iframe');
        iframe.width = 600;
        iframe.height = 450;
        iframe.frameborder = 0;
        iframe.style.border = 0;
        iframe.allowfullscreen = true;
        iframe.src = $settings.maps.directionsEndpoint + "?key=" + $settings.maps.key + "&origin=" + escapedOrigin + "&destination=" + escapedDestination;
        return iframe;
    };

    var wake = wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake);
    return wake;
};

/**
 * In the function returned by wakeDecorator, we place anything that will be universal to the wake step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appWake
 * @return Promise resolving with the result of the appWake function
 */
var wakeDecorator = function wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake) {
    var wake = function wake() {
        var _this = this,
            _arguments = arguments;

        var coreFn = function coreFn() {
            if (_this.elems.body) {
                _this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
            }
            if (_this.settings.title && _this.settings.route) {
                console.warn("TODO: Turn on page history");
                // history.pushState(state, `${globalSettings.appName} - ${this.settings.title}`, this.settings.route);
            }
            return appWake.call.apply(appWake, [_this].concat(Array.prototype.slice.call(_arguments)));
        };
        // Init the first time wake is run:
        if (this.state.initted !== true) {
            this.state.initted = true;
            return this.init().then(function () {
                return coreFn.apply(undefined, _arguments);
            });
        } else {
            // Since init always returns a promise, wake will always return a promise
            // Show body of controller, if exists
            return Promise.resolve(coreFn.apply(undefined, arguments));
        }
    };
    return wake;
};

exports.default = getWake;

},{}],23:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./init":24,"./settings":25,"./sleep":26,"./utilities":27,"./wake":29,"dup":17}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getInit = function getInit(globalSettings, state, controllers, globalUtilities) {

    /** Enter Init Code Here */
    var appInit = /*
                  Within the following function, the app developer has access to the following objects:
                  # this
                  `this.elems` - An object literal map of each element created from the settings.elementIds object
                  `this.settings` - The controller's settings object
                  `this.init` - The controller's init method.  Can only be called once, and will automatically be called, if the wake method is called before the init method.
                  Turns this.state.initted to true.
                  `this.wake` - The method to turn on the controller.  Largely made up of the code the app developer has created.
                  If this.elems.body exists, will remove the .hidden class
                  If controller is not yet init, will run this.init()
                  Turns this.state.awake to true
                  Returns a resolved promise, unless the init or app developer's wake returns an unresolved promise
                  Value conveyed to the resolve is that which the app developer returns from their wake method
                  `this.sleep` - The method to turn off the controller.
                  If this.elems.body exists, will add the .hidden class
                  Turns this.state.awake to false
                  Returns false if already asleep
                  `this.utilities` - An object literal, containing the content's of the controller's /utilities/ directory.
                  `this.state` - The private state object of this controller
                  `this.state.awake` - Turns to true when controller is awake, and false when asleep
                  `this.state.initted` - Is false until controller is initted, then turns to true
                  # globalSettings
                  Contents of the ./app/app_settings.js JSON
                  # controllers
                  An object literal of all controllers.  Each key is a camel-cased version of your controller's directory name.
                  For instance, if you have created a controller at ./app/controllers/basic_questions, access its wake function from any controller with `controllers.basicQuestions.wake()`
                  # globalUtilities
                  Contents of the ./app/utilities file
                  */

    function appInit() /* Your args here */{};

    var init = initDecorator(globalSettings, state, controllers, globalUtilities, appInit);
    return init;
};

/**
 * In the function returned by initDecorator, we place anything that will be universal to the init step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appInit
 * @returns {function()}
 */

var initDecorator = function initDecorator(globalSettings, state, controllers, globalUtilities, appInit) {
    var init = function init() {
        // Gather elements for this controller
        this.elems = globalUtilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call.apply(appInit, [this].concat(Array.prototype.slice.call(arguments))));
    };
    return init;
};

exports.default = getInit;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var settings = {};

settings.key = ''; // How other controllers will refer to this controller in the `controllers` object.
settings.title = ''; // Will display as page title if this controller has a route.

settings.isDefault = false; // True for the controller which will wake if no route match occurs.
settings.route = ''; // If this string matches a segment of the URL, this controller will wake.

/**
    Each index of this object will automatically be added to the controller.elems object.
    The key of that object will be the key of the key of the `settings.elementIds` object,
    and the value will be the node with the ID matching the string value.
    Example:
        The object `settings.elementIds = { what: 'the-heck' }`
        will result in `this.elems.what.nodeName === 'DIV' && this.elems.what.id === 'the-heck'`
        after the controller inits.
        Be sure your HTML contains the element with the matching ID.
 */
settings.elementIds = {};
settings.elementIds.body = false; // If this controller has a top-level div that should be displayed upon wake, add it's ID here.

exports.default = settings;

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getSleep = function getSleep(globalSettings, state, controllers, globalUtilities) {
    var appSleep = /*
                   Within the following function, the app developer has access to the following objects:
                   # this
                   `this.elems` - An object literal map of each element created from the settings.elementIds object
                   `this.settings` - The controller's settings object
                   `this.init` - The controller's init method.  Can only be called once, and will automatically be called, if the wake method is called before the init method.
                   Turns this.state.initted to true.
                   `this.wake` - The method to turn on the controller.  Largely made up of the code the app developer has created.
                   If this.elems.body exists, will remove the .hidden class
                   If controller is not yet init, will run this.init()
                   Turns this.state.awake to true
                   Returns a resolved promise, unless the init or app developer's wake returns an unresolved promise
                   Value conveyed to the resolve is that which the app developer returns from their wake method
                   `this.sleep` - The method to turn off the controller.
                   If this.elems.body exists, will add the .hidden class
                   Turns this.state.awake to false
                   Returns false if already asleep
                   `this.utilities` - An object literal, containing the content's of the controller's /utilities/ directory.
                   `this.state` - The private state object of this controller
                   `this.state.awake` - Turns to true when controller is awake, and false when asleep
                   `this.state.initted` - Is false until controller is initted, then turns to true
                   # globalSettings
                   Contents of the ./app/app_settings.js JSON
                   # controllers
                   An object literal of all controllers.  Each key is a camel-cased version of your controller's directory name.
                   For instance, if you have created a controller at ./app/controllers/basic_questions, access its wake function from any controller with `controllers.basicQuestions.wake()`
                   # globalUtilities
                   Contents of the ./app/utilities file
                   */

    function appSleep() /* Your args here */{};

    var sleep = sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep);
    return sleep;
};

var sleepDecorator = function sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep) {
    var sleep = function sleep() {
        if (this.state.awake === false) {
            return false;
        }
        this.state.awake = false;
        if (this.elems.body) {
            this.elems.body.classList.add(globalSettings.cssClasses.hidden);
        }
        return appSleep.apply(undefined, arguments);
    };
    return sleep;
};

exports.default = getSleep;

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _proto_utility = require('./proto_utility.js');

var _proto_utility2 = _interopRequireDefault(_proto_utility);

function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
}

var utilityInits = {};

var utilitiesInit = function utilitiesInit(appSettings, state, controllers, routes) {
      var _this = this;

      return Object.keys(utilityInits).reduce(function (utilities, utilityName) {
            utilities[utilityName] = utilityInits[utilityName].call(_this, appSettings, state, controllers, routes);
            return utilities;
      }, {});
};

utilityInits.protoUtility = _proto_utility2.default;

exports.default = utilitiesInit;

},{"./proto_utility.js":28}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getUtilities = function getUtilities(globalSettings, state, controllers, globalUtilities) {
    var appUtility = /*
                     Within the following function, the app developer has access to the following objects:
                     # this
                     `this.elems` - An object literal map of each element created from the settings.elementIds object
                     `this.settings` - The controller's settings object
                     `this.init` - The controller's init method.  Can only be called once, and will automatically be called, if the wake method is called before the init method.
                     Turns this.state.initted to true.
                     `this.wake` - The method to turn on the controller.  Largely made up of the code the app developer has created.
                     If this.elems.body exists, will remove the .hidden class
                     If controller is not yet init, will run this.init()
                     Turns this.state.awake to true
                     Returns a resolved promise, unless the init or app developer's wake returns an unresolved promise
                     Value conveyed to the resolve is that which the app developer returns from their wake method
                     `this.sleep` - The method to turn off the controller.
                     If this.elems.body exists, will add the .hidden class
                     Turns this.state.awake to false
                     Returns false if already asleep
                     `this.utilities` - An object literal, containing the content's of the controller's /utilities/ directory.
                     `this.state` - The private state object of this controller
                     `this.state.awake` - Turns to true when controller is awake, and false when asleep
                     `this.state.initted` - Is false until controller is initted, then turns to true
                     # globalSettings
                     Contents of the ./app/app_settings.js JSON
                     # controllers
                     An object literal of all controllers.  Each key is a camel-cased version of your controller's directory name.
                     For instance, if you have created a controller at ./app/controllers/basic_questions, access its wake function from any controller with `controllers.basicQuestions.wake()`
                     # globalUtilities
                     Contents of the ./app/utilities file
                     */

    function appUtility() /* your args here */{};
    var scopedUtility = appUtility.bind(this);
    return scopedUtility;
};

exports.default = getUtilities;

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getWake = function getWake(globalSettings, state, controllers, globalUtilities) {
    var appWake = /*
                  Within the following function, the app developer has access to the following objects:
                  # this
                  `this.elems` - An object literal map of each element created from the settings.elementIds object
                  `this.settings` - The controller's settings object
                  `this.init` - The controller's init method.  Can only be called once, and will automatically be called, if the wake method is called before the init method.
                  Turns this.state.initted to true.
                  `this.wake` - The method to turn on the controller.  Largely made up of the code the app developer has created.
                  If this.elems.body exists, will remove the .hidden class
                  If controller is not yet init, will run this.init()
                  Turns this.state.awake to true
                  Returns a resolved promise, unless the init or app developer's wake returns an unresolved promise
                  Value conveyed to the resolve is that which the app developer returns from their wake method
                  `this.sleep` - The method to turn off the controller.
                  If this.elems.body exists, will add the .hidden class
                  Turns this.state.awake to false
                  Returns false if already asleep
                  `this.utilities` - An object literal, containing the content's of the controller's /utilities/ directory.
                  `this.state` - The private state object of this controller
                  `this.state.awake` - Turns to true when controller is awake, and false when asleep
                  `this.state.initted` - Is false until controller is initted, then turns to true
                  # globalSettings
                  Contents of the ./app/app_settings.js JSON
                  # controllers
                  An object literal of all controllers.  Each key is a camel-cased version of your controller's directory name.
                  For instance, if you have created a controller at ./app/controllers/basic_questions, access its wake function from any controller with `controllers.basicQuestions.wake()`
                  # globalUtilities
                  Contents of the ./app/utilities file
                  */

    function appWake() /* Your args here */{};

    var wake = wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake);
    return wake;
};

/**
 * In the function returned by wakeDecorator, we place anything that will be universal to the wake step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appWake
 * @return Promise resolving with the result of the appWake function
 */
var wakeDecorator = function wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake) {
    var wake = function wake() {
        var _this = this,
            _arguments = arguments;

        var coreFn = function coreFn() {
            if (_this.elems.body) {
                _this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
            }
            if (_this.settings.title && _this.settings.route) {
                console.warn("TODO: Turn on page history");
                // history.pushState(state, `${globalSettings.appName} - ${this.settings.title}`, this.settings.route);
            }
            return appWake.call.apply(appWake, [_this].concat(Array.prototype.slice.call(_arguments)));
        };
        // Init the first time wake is run:
        if (this.state.initted !== true) {
            this.state.initted = true;
            return this.init().then(function () {
                return coreFn.apply(undefined, _arguments);
            });
        } else {
            // Since init always returns a promise, wake will always return a promise
            // Show body of controller, if exists
            return Promise.resolve(coreFn.apply(undefined, arguments));
        }
    };
    return wake;
};

exports.default = getWake;

},{}],30:[function(require,module,exports){
'use strict';

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _app_settings = require('./app_settings');

var _app_settings2 = _interopRequireDefault(_app_settings);

var _basic_questions = require('./controllers/basic_questions');

var _basic_questions2 = _interopRequireDefault(_basic_questions);

var _clinic_selection = require('./controllers/clinic_selection');

var _clinic_selection2 = _interopRequireDefault(_clinic_selection);

var _itinerary = require('./controllers/itinerary');

var _itinerary2 = _interopRequireDefault(_itinerary);

var _john = require('./controllers/john');

var _john2 = _interopRequireDefault(_john);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
 * This file is automatically generated.  Do not edit it directly.
 * To create a new index.js, run `node assemble` in the root folder.
*/

var controllers = {};
var routes = {};
var state = {};
var globalUtilities = (0, _utilities2.default)(_app_settings2.default, state, controllers, routes);

var basicQuestions = (0, _basic_questions2.default)(_app_settings2.default, state, controllers, globalUtilities);
controllers.basicQuestions = basicQuestions;

var clinicSelection = (0, _clinic_selection2.default)(_app_settings2.default, state, controllers, globalUtilities);
controllers.clinicSelection = clinicSelection;

var itinerary = (0, _itinerary2.default)(_app_settings2.default, state, controllers, globalUtilities);
controllers.itinerary = itinerary;

var john = (0, _john2.default)(_app_settings2.default, state, controllers, globalUtilities);
controllers.john = john;

Object.assign(routes, globalUtilities.getRoutes(controllers));
controllers.default = globalUtilities.getDefaultController(controllers);
if (!controllers.default) {
  globalUtilities.makeError('assembly.js', 'getFileString', 'No default controller was indicated.');
}

// Start the machine:
globalUtilities.appInit(routes);
(routes[globalUtilities.getRoute()] || controllers.default).wake();

},{"./app_settings":1,"./controllers/basic_questions":2,"./controllers/clinic_selection":9,"./controllers/itinerary":17,"./controllers/john":23,"./utilities":32}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var responseModel = {
    results: [{
        name: 'Clinic 1',
        isPartner: true,
        hours: {
            monday: {
                start: 800,
                end: 2000
            },
            tuesday: {
                start: 800,
                end: 2000
            },
            wednesday: {
                start: 800,
                end: 2000
            },
            thursday: {
                start: 800,
                end: 2000
            },
            friday: {
                start: 800,
                end: 2000
            },
            saturday: false,
            sunday: false,
            confirmed: true
        },
        contact: {
            phone: '555.555.5555',
            lastConfirmed: 1484254654776,
            instructions: 'To call anonymously, do the following...',
            website: 'aclinic.com'
        },
        price: {
            resident: 185,
            nonresident: 210,
            student: 170,
            medicaid: 100
        },
        location: {
            lat: 39.086922,
            lng: -110.752961,
            street: '121 whatevs St.',
            city: 'Nextonover',
            state: 'WA',
            zip: 98502
        },
        rating: {
            score: 4.3,
            reviews: [{
                score: 5,
                review: 'They were great!'
            }, {
                score: 4,
                review: 'They were pretty good!'
            }, {
                score: 4,
                review: 'I also felt they were pretty good!'
            }]
        },
        laws: [{
            title: 'Law X',
            description: 'Law X is such and such.'
        }, {
            title: 'Law Y',
            description: 'Law Y is so and so.'
        }],
        instruction: ['Bring parent consent form', 'Bring two forms of ID', 'Two visits will be necessary, at least a week apart.', 'A prenatal exam will be necessary.']
    }, {
        name: 'Clinic 2',
        isPartner: false,
        hours: {
            monday: {
                start: 900,
                end: 1800
            },
            tuesday: {
                start: 900,
                end: 1800
            },
            wednesday: {
                start: 900,
                end: 1800
            },
            thursday: {
                start: 900,
                end: 1800
            },
            friday: {
                start: 900,
                end: 1800
            },
            saturday: {
                start: 1200,
                end: 1800
            },
            sunday: {
                start: 1200,
                end: 1800
            },
            confirmed: false
        },
        contact: {
            phone: '555.666.7777',
            lastConfirmed: false,
            instructions: '',
            website: 'anotherclinic.com'
        },
        price: {
            resident: 100,
            nonresident: 110,
            student: 90,
            medicaid: 70
        },
        location: {
            lat: 38,
            lng: -109.78,
            street: '341 whateva Lane',
            city: 'Nextonover',
            state: 'WA',
            zip: 98503
        },
        rating: {
            score: 4.6,
            reviews: [{
                score: 5,
                review: 'They were great!'
            }, {
                score: 5,
                review: 'They were awfully good!'
            }, {
                score: 4,
                review: 'I felt they were pretty good!'
            }]
        },
        laws: [{
            title: 'Law X',
            description: 'Law X is such and such.'
        }, {
            title: 'Law Y',
            description: 'Law Y is so and so.'
        }],
        instruction: ['Bring parent consent form', 'Bring two forms of ID', 'Two visits will be necessary, at least a week apart.']
    }]
};

exports.default = responseModel;

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _clinic_query_response = require('../models/clinic_query_response');

var _clinic_query_response2 = _interopRequireDefault(_clinic_query_response);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

var initted = false;
var globalUtilities = {};

var globalUtilitiesSingleton = function globalUtilitiesSingleton($settings, controllers) {
    if ($settings === undefined) {
        // If settings are undefined,
        throw new Error('file: ' + file + ' || function: constructor || message: Settings are required');
    } else if (initted === true) {
        return globalUtilities;
    } else {
        initted = true;
    }

    globalUtilities.escapeSpaces = function (url) {
        return url.replace(' ', '%20');
    };

    globalUtilities.getRandom = function () {
        return Math.random();
    };

    globalUtilities.injectMap = function (apiUrl, cb) {
        return new Promise(function (resolve, reject) {
            var randomName = 'callback_' + globalUtilities.getRandom();
            var script = document.createElement('script');
            window[randomName] = function () {
                cb();
                delete window[randomName];
            };
            script.async = true;
            script.defer = true;
            script.src = apiUrl + '?key=' + $settings.map.key + '&callback=' + randomName;
            script.addEventListener('load', function () {
                return resolve();
            });
            script.addEventListener('error', function () {
                return reject('Error loading script.');
            });
            script.addEventListener('abort', function () {
                return reject('Script loading aborted.');
            });
            document.body.appendChild(script);
        });
    };

    globalUtilities.getRoute = function () {
        var route = window.location.pathname.split('/')[1] || 'default';
        return route;
    };

    globalUtilities.sleepAllExcept = function (exception) {
        Object.keys(controllers).map(function (key) {
            if (controllers[key].name !== exception) {
                controllers[key].sleep();
            }
        });
    };

    globalUtilities.getElems = function (idsObj) {
        return Object.keys(idsObj).reduce(function (elemsObj, key) {
            var elem = document.getElementById(idsObj[key]);
            if (elem === null) {
                globalUtilities.makeError('globalUtilities', 'getElems', 'Required DOM node with ID ' + idsObj[key] + ' did not exist');
            } else {
                elemsObj[key] = elem;
            }
            return elemsObj;
        }, {});
    };

    globalUtilities.makeError = function () {
        var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var functionName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        throw new Error('file: ' + file + ' || function: ' + functionName + ' || message: ' + message);
    };

    globalUtilities.getApiEndpoint = function () {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'an endpoint to this function call and';

        var endpoint = $settings.api.endpoints[key];
        if (endpoint === undefined) {
            globalUtilities.makeError('globalUtilities', 'getRoutes', 'Endpoint not defined. Please add ' + key + ' to your app_settings.js file.');
        }
        return $settings.api.protocol + '://' + $settings.api.domain + '/' + $settings.api.version + '/' + endpoint + '/';
    };

    globalUtilities.ajax = function (options) {
        return new Promise(function (resolve, reject) {

            return resolve(_clinic_query_response2.default);

            var url = options.url,
                body = options.body,
                queryObj = options.queryObj;

            var queryString = function () {
                var qString = Object.keys(queryObj).reduce(function (string, key) {
                    string += key + '=' + queryObj[key] + '&';
                    return string;
                }, '?');
                return qString.substring(0, qString.length - 1);
            }();
            var req = new XMLHttpRequest();
            req.open('GET', '' + url + queryString);
            req.onload = function () {
                logger(req);
                if (req.status === 200) {
                    return resolve(JSON.parse(req.response));
                }
                return reject(Error(req.statusText));
            };
            req.onerror = function (e) {
                reject(Error('Network Error', e));
            };
            req.send(JSON.stringify(body));
        });
    };

    globalUtilities.getRoutes = function (controllers) {
        var routes = Object.keys(controllers).reduce(function (routes, key) {
            var controller = controllers[key];
            var controllerRoute = controller.settings.route;
            if (controllerRoute !== undefined) {
                routes[controllerRoute] = controller;
            }
            return routes;
        }, {});
        if (Object.keys(routes).length === 0) {
            globalUtilities.makeError('assembly.js', 'getFileString', 'No default controller was indicated.');
        }
        return routes;
    };

    globalUtilities.getDefaultController = function (controllers) {
        var keys = Object.keys(controllers);
        var defaultControllers = keys.reduce(function (defaults, key) {
            if (controllers[key].default === true) {
                defaults.push(controllers[key]);
            }
            return defaults;
        }, []);

        if (defaultControllers.length > 1) {
            (function () {
                // If execution has reached this point, the developer has included two default controllers.
                // Halt execution and ID the culprits:
                var connector = ' and ';
                var offendingControllersString = defaultControllers.reduce(function (evilDoerNames, evilDoerName) {
                    evilDoerNames += '' + evilDoerName + connector;
                    return evilDoerNames;
                }, '');
                var offendingControllersStringTrimmed = offendingControllersString.substr(0, connector.length);
                globalUtilities.makeError('root/index.js', 'getFileString', offendingControllersStringTrimmed + ' controllers have defaultController === true');
            })();
        }

        return defaultControllers[0];
    };

    globalUtilities.appInit = function (controllers) {
        var children = document.getElementById($settings.elemIds.root).getElementsByTagName("div");
        [].concat(_toConsumableArray(children)).map(function (node) {
            node.classList.add($settings.cssClasses.hidden);
        });
        return children;
    };

    return globalUtilities;
};

exports.default = globalUtilitiesSingleton;

},{"../models/clinic_query_response":31}]},{},[30]);
