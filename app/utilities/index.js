import responseModel from '../models/clinic_query_response';

let initted = false;
const globalUtilities = {};

const globalUtilitiesSingleton = ($settings, controllers) => {
    if($settings === undefined) {
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

    globalUtilities.scriptInject = (url, hasCallback) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            let apiSrc = url;
            if(hasCallback) {
                const random = Math.round(globalUtilities.getRandom() * 1000);
                const randomName = `callback_${random}`;
                apiSrc += `&callback=${randomName}`;
                window[randomName] = () => {
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
        Object.keys(controllers).map((key) => {
            if(controllers[key].name !== exception) {
                controllers[key].sleep();
            }
        });
    };

    globalUtilities.getElems = (idsObj) => {
        return Object.keys(idsObj).reduce((elemsObj, key) => {
            const elem = document.getElementById(idsObj[key]);
            if(elem === null) {
                globalUtilities.makeError('globalUtilities', 'getElems', `Required DOM node with ID ${idsObj[key]} did not exist`);
            } else {
                elemsObj[key] = elem;
            }
            return elemsObj;
        }, {});
    };

    globalUtilities.makeError = (file = '', functionName = '', message = '', error = '') => {
        const errorObj = { file, functionName, message, error };
        throw new Error(errorObj);
    };

    globalUtilities.getApiEndpoint= (key = 'an endpoint to this function call and') => {
        const endpoint = $settings.api.endpoints[key];
        if(endpoint === undefined) {
            globalUtilities.makeError('globalUtilities', 'getRoutes', `Endpoint not defined. Please add ${key} to your app_settings.js file.`);
        }
        return `${$settings.api.protocol}://${$settings.api.domain}/${$settings.api.version}/${endpoint}/`;
    };

    globalUtilities.ajax = (options) => {
        return new Promise((resolve, reject) => {


            return resolve(responseModel);


            const {url, body, queryObj} = options;
            const queryString = (() => {
                const qString = Object.keys(queryObj).reduce((string, key) => {
                    string += `${key}=${queryObj[key]}&`;
                    return string;
                }, '?');
                return qString.substring(0, qString.length-1);
            })();
            const req = new XMLHttpRequest();
            req.open('GET', `${url}${queryString}`);
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
            globalUtilities.makeError('assembly.js','getFileString', 'No default controller was indicated.');
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
            globalUtilities.makeError('root/index.js', 'getFileString', `${offendingControllersStringTrimmed} controllers have defaultController === true`);
        }

        return defaultControllers[0];
    };

    globalUtilities.appInit = (controllers) => {
        Object.keys(controllers).map((key) => {
            const bodyId = controllers[key].settings.elementIds.body;
            const body = document.getElementById(bodyId);
            if(body) {
                body.classList.add('app-body');
                body.classList.add($settings.cssClasses.hidden);
            }
        });
    };

    return globalUtilities;
};

export default globalUtilitiesSingleton;