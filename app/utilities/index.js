
let initted = false;
const globalUtilities = {};

const globalUtilitiesSingleton = (globals) => {
    if(globals.settings === undefined) {
        // If settings are undefined,
        throw new Error(`file: ${file} || function: constructor || message: Settings are required`);
    } else if(initted === true) {
        return globalUtilities;
    } else {
        initted = true;
    }

    globalUtilities.escapeSpaces = url => {
        return url.replace(' ','%20');
    };

    globalUtilities.getRandom = () => {
        return Math.random();
    };

    globalUtilities.getQueryObj = () => {
        const qString = window.location.search;
        const qArray = qString.slice(1,0).split('&');
        const qObject = qArray.reduce((qObj, pairString) => {
            const pairArray = pairString.split('=');
            qObj[pairArray[0]] = pairArray[1] || true;
            return qObj;
        }, {});
        return qObject;
    };

    globalUtilities.scriptInject = (url, hasCallback) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            let apiSrc = url;
            if(hasCallback) {
                const random = Math.round(globalUtilities.getRandom() * 1000);
                const randomName = `callback_${random}`;
                apiSrc += `&callback=${randomName}`;
                window[randomName] = function() {
                    resolve(arguments);
                    delete window[randomName];
                };
            } else {
                script.addEventListener('load', () => resolve());
            }
            script.async = true;
            script.defer = true;
            script.src = apiSrc;
            script.addEventListener('error', () => reject('Error loading script.'));
            script.addEventListener('abort', () => reject('Script loading aborted.'));
            document.body.appendChild(script);
        });
    };

    globalUtilities.getRoute = () => {
        const route = window.location.pathname.split('/')[1] || 'default';
        return route;
    };

    globalUtilities.sleepAllExcept = (exception) => {
        Object.keys(globals.controllers).map((key) => {
            if(globals.controllers[key].name !== exception) {
                globals.controllers[key].sleep();
            }
        });
    };

    globalUtilities.getElems = (idsObj) => {
        return Object.keys(idsObj).reduce((elemsObj, key) => {
            const id = idsObj[key];
            if(id) {
                const elem = document.getElementById(id);
                if(elem === null) {
                    globalUtilities.log({
                        file:'globalUtilities',
                        function: 'getElems',
                        message:`Required DOM node with the ID "${id}" did not exist`,
                        level: 'warn'
                    });
                } else {
                    elemsObj[key] = elem;
                }
            }
            return elemsObj;
        }, {});
    };

    /**
     *
     * @param {Object} logObj contains log spec
     * @param {String} logObj.level indicates severity of log. Acceptable values include `log`, `warn`, `error`.
     * @param {String} logObj.file name of file where log occurred
     * @param {String} logObj.function name of function where log occurred
     * @param {String} logObj.message text of log
     * @param {Error} logObj.error error object generated for log
     */
    globalUtilities.log = (logObj) => {
        const logString = `file: ${logObj.file} || function: ${logObj.function} || message: ${logObj.message}`;
        if(logObj.error || logObj.level === 'error') {
            throw new Error(`${logString}, ${logObj.error}`);
        } else {
            const level = logObj.level || 'log';
            window.console[level](logString);
        }
    };

    globalUtilities.getApiEndpoint= (key = 'an endpoint to this function call and') => {
        const endpoint = globals.settings.api.endpoints[key];
        if(endpoint === undefined) {
            const logObj = {
                file: 'globalUtilities',
                function: 'getRoutes',
                message: `Endpoint not defined. Please add ${key} to your app_settings.js file.`
            };
            globalUtilities.log(logObj);
        }
        const version = globals.settings.api.version ? `/${globals.settings.api.version}` : '';
        return `${globals.settings.api.protocol}://${globals.settings.api.domain}${version}${endpoint}/`;
    };

    globalUtilities.ajax = (options) => {
        return new Promise((resolve, reject) => {


            return resolve();


            const {url, body, queryObj} = options;
            let qString;
            if(queryObj) {
                qString = Object.keys(queryObj).reduce((string, key) => {
                    string += `${key}=${queryObj[key]}&`;
                    return string;
                }, '?');
                qString = qString.substring(0, qString.length - 1);
            } else {
                qString = '';
            }

            const req = new XMLHttpRequest();
            req.open('GET', `${url}${qString}`);
            req.onload = function () {
                logger(req);
                if (req.status === 200) {
                    return resolve(JSON.parse(req.response));
                }
                return reject(Error(req.statusText));
            };
            req.onerror = (e) => {
                reject(Error('Network Error', e));
            };
            req.send(JSON.stringify(body));
        });
    };

    globalUtilities.getRoutes = (controllers) => {
        const routes = Object.keys(controllers).reduce((routes, key) => {
            const controller = controllers[key];
            const controllerRoute = controller.settings.route;
            if(controllerRoute !== undefined) {
                routes[controllerRoute] = controller;
            }
            return routes;
        },{});
        if(Object.keys(routes).length === 0) {
            const logObj = {
                file: 'assembly.js',
                function: 'getFileString',
                message: 'No default controller was indicated.'
            };
            globalUtilities.log(logObj);
        }
        return routes;
    };

    globalUtilities.getDefaultController = (controllers) => {
        const keys = Object.keys(controllers);
        const defaultControllers = keys.reduce((defaults, key) => {
            if(controllers[key].default === true) {
                defaults.push(controllers[key]);
            }
            return defaults;
        },[]);

        if(defaultControllers.length > 1) {
            // If execution has reached this point, the developer has included two default controllers.
            // Halt execution and ID the culprits:
            const connector = ' and ';
            const offendingControllersString = defaultControllers.reduce((evilDoerNames, evilDoerName) => {
                evilDoerNames += `${evilDoerName}${connector}`;
                return evilDoerNames;
            },'');
            const offendingControllersStringTrimmed = offendingControllersString.substr(0, connector.length);
            const logObj = {
                file: 'root/index.js',
                fundtion: 'getFileString',
                message: `${offendingControllersStringTrimmed} controllers have defaultController === true`
            };
            globalUtilities.log(logObj);
        }

        return defaultControllers[0];
    };

    globalUtilities.appInit = (controllers) => {
        Object.keys(controllers).map((key) => {
            const bodyId = controllers[key].settings.elementIds.body;
            const body = document.getElementById(bodyId);
            if(body) {
                body.classList.add('app-body');
                body.classList.add(globals.settings.cssClasses.hidden);
            }
        });
    };

    return globalUtilities;
};

export default globalUtilitiesSingleton;