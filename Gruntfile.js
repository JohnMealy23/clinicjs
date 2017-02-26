'use strict';

const cmd = require('node-cmd');
const camelCase = require('lodash.camelcase');
const fs = require('fs');
const settings = require('./build/settings');
const Logger = require('js-logger');
Logger.useDefaults();

module.exports = function(grunt) {
    /**
     * newcontroller creates a controller directory and component files
     * @param {string} name is the name of the controller
     */
    grunt.registerTask('newcontroller', function() {
        const name = grunt.option('name');
        let err;
        if(name === undefined) {
            err = 'Please specify a name: grunt controller --name=${name yo thang}';
        } else if(name.indexOf(' ') > -1) {
            err = 'No spaces in controller names, please.'
        } else if(name !== name.toLowerCase()) {
            err = 'Please use only lowercase characters';
        } else if(grunt.file.exists(`${settings.controllersSrc}/${name}`)) {
            err = 'This controller already exists. Delete its directory before creating a new one, if you wish to start over.';
        }

        if(err) {
            throw new Error(err);
        }
        grunt.file.mkdir(`${settings.controllersSrc}/${name}`);
        grunt.file.copy(settings.protoSrc, `${settings.controllersSrc}/${name}`)
    });

    /**
     * grunt assemble runs the process of wrapping app controllers in decorators, creating the high-level index.js file, and building the browserified file
     * @param {string} log-level denotes level of console logging
     */
    grunt.registerTask('assemble', () => {
        const done = grunt.task.current.async();
        const logLevel = (grunt.option('log-level') || 'warn').toUpperCase();
        Logger.setLevel(Logger[logLevel]);

        Logger.debug('grunt assemble');
        // Remove artifacts from previous build, if exist:
        if(grunt.file.exists(settings.tempBuildDest) === true) {
            grunt.file.delete(settings.tempBuildDest);
        }
        const publicFileLocation = `${settings.distPath}/${settings.distFileName}.js`;
        if(grunt.file.exists(publicFileLocation) === true) {
            grunt.file.delete(publicFileLocation);
        }
        // Create temp location and files:
        fortifyTempLocation(settings.tempBuildDest, settings.controllersSrc);
        wrapControllers(settings.controllersTemp, settings.wrapperSrc)
            .then(() => {
                Logger.debug('---------------------------------------');
                Logger.debug('Commencing to get filename variable map');
                const path = settings.controllersTemp;
                return getFilenames(path);
            })
            .then(getFilenameVarMap)
            .then(getFileString)
            .then((fileString) => {
                Logger.debug('---------------------------------------');
                Logger.debug('Commencing to write file');
                const path = `${settings.tempBuildDest}/index.js`;
                return writeFile(path, fileString);
            })
            .then(createUtilitiesIndexes)
            .then(() => {
                Logger.debug('---------------------------------------');
                Logger.debug('Commencing build');
                grunt.task.run('build');
                Logger.debug('---------------------------------------');
                Logger.debug('Assembly complete');
                done();
            })
            .catch((error) => {
                Logger.debug('---------------------------------------');
                Logger.error('assemble failed', {error});
                Logger.debug('Commencing cleanup');
                // grunt.file.delete(settings.tempBuildDest);
            });
    });

    const fortifyTempLocation = () => {
        Logger.debug('starting fortifyTempLocation');
        // Create map of src and dest for each controller and its children:
        grunt.file.mkdir(settings.tempBuildDest);
        grunt.file.copy(settings.controllersSrc, `${settings.tempBuildDest}/${settings.controllersDirName}`);
        grunt.file.copy(settings.modelSrc, `${settings.tempBuildDest}/${settings.modelDirName}`);
        grunt.file.copy(settings.utilitiesSrc, `${settings.tempBuildDest}/${settings.utilitiesDirName}`);
        grunt.file.copy(`${settings.appSrc}/${settings.appSettingsFilename}`, `${settings.tempBuildDest}/${settings.appSettingsFilename}`);
    };

    /**
     * wrap app controller children in decorators
     * @returns promise that resolves when all files have been wrapped and deposited in target directory.
     * resolve value is the location
     */
    const wrapControllers = (controllerLocation, wrapperLocation) => {
        return new Promise((resolve, reject) => {
            Logger.debug('starting wrapControllers');
            // Compose an object with src, dest, etc. for each controller:
            const controllerSpecs = getControllerPaths(controllerLocation);
            // Logger.debug('Acquired controller specs:', controllerSpecs[0].children);
            const wrapperFilenames = fs.readdirSync(wrapperLocation);
            // Logger.debug('Acquired wrapper filenames:', wrapperFilenames);
            controllerSpecs.map((controllerSpec) => {
                // Make controller directory in temp:
                grunt.file.mkdir(controllerSpec.dest);
                // Copy all the app files over:
                grunt.file.copy(controllerSpec.src, controllerSpec.dest);
                // Create a scoped app component file for each wrapper.
                const wrappedFiles = wrapperFilenames.map((wrapperFilename) => {
                    Logger.debug('---------------------------');
                    // Logger.debug('wrapControllers', `Creating file for wrapper: ${wrapperFilename}`);

                    // Get app component file that corresponds to this wrapper file:
                    const controllerItem = controllerSpec.children.find((child) => {
                        Logger.debug('wrapControllers', child.name);
                        console.log('wrapControllers', {wrapperFilename}, child.name);
                        return wrapperFilename.indexOf(child.name) > -1;
                    });
                    if(!controllerItem) {
                        // No app file was found to correspond to this wrapper.  Transfer the wrapper over directly:
                        const src = `${settings.wrapperSrc}/${wrapperFilename}`;
                        const dest = `${controllerSpec.dest}/${wrapperFilename}`;
                        const conversionFunction = getConversionFunction(settings.replaceToken, '()=>{}');
                        grunt.file.copy(src, dest, conversionFunction);
                    } else if(controllerItem.children !== null) {
                        // If the component has children, wrap each child in a common wrapper:
                        Logger.debug('wrapControllers', 'controllerItem has children', controllerItem);
                        return controllerItem.children.map((childSpec) => {
                            const controllerContents = grunt.file.read(childSpec.src);
                            return wrapAppFile(wrapperFilename, childSpec, controllerContents)
                        });
                    } else {
                        // Wrap the component:
                        Logger.debug('wrapControllers', 'controllerItem has no children', controllerItem);
                        const controllerContents = getControllerContents(wrapperFilename, controllerSpec);
                        return wrapAppFile(wrapperFilename, controllerItem, controllerContents);
                    }
                });
                resolve(wrappedFiles);
            });
        })
    };

    const getControllerPaths = (controllerLocation) => {
        Logger.debug(`starting getControllerPaths`);
        const controllerNames = fs.readdirSync(controllerLocation);
        if(controllerNames.length === 0) {
            throw new Error(`No controllers found in ${controllerLocation}. Please run \`grunt newcontroller name=your-controller-name\` to create a controller.`);
        }
        Logger.debug(`Creating controllers for ${controllerNames.join(', ')}`);
        return controllerNames.map((name) => {
            const location = `${controllerLocation}/${name}`;
            return getLocationSpecs(location, controllerLocation);
        });
    };

    const getControllerContents = (wrapperName, controllerSpec) => {
        // If there is a wrapper file for a app component file that doesn't exist,
        // the developer has not included a controller file for that wrapper.
        // Example: There will need to be a `sleep()` method for the controller, but the developer may
        // The wrapper's output is necessary, though, so we'll fabricate the controller
        // file with an empty function
        let stubFunction = '()=>{}';
        const controllerContents = controllerSpec.children.reduce((controllerContents, spec) => {
            if(spec.name === wrapperName) {
                // Acquire the contents of the app component file:
                controllerContents = grunt.file.read(`${controllerSpec.src}/${spec.name}`);
            }
            return controllerContents;
        }, stubFunction);
        return controllerContents;
    };

    /**
     * wrapAppFile takes the app component file the developer has created (wake.js), and wraps it in the scoping decorator
     * @param {String} filename the name of wrapper file, and the app component file, if exists
     * @param {Array} controllerFiles the array of existing app component file names
     */
    const wrapAppFile = (wrapperName, controllerSpec, controllerContents) => {
        // Logger.debug('wrapAppFile', {wrapperName, controllerSpec});
        const src = `${settings.wrapperSrc}/${wrapperName}`;
        const dest = `${controllerSpec.dest}`;
        const conversionFunction = getConversionFunction(settings.replaceToken, controllerContents);
        Logger.debug('wrapAppFile', {src, dest, wrapperName, controllerSpec});
        grunt.file.copy(src, dest, conversionFunction);
    };

    /**
     * getItemName snips the last piece of the file path off and returns it
     * @param {String} location full file path
     * @return {String} name of file or directory at the end of the file path
     */
    const getItemName = (location) => {
        Logger.debug('getItemName');
        const pathArray = location.split('/');
        return pathArray[pathArray.length - 1];
    };

    /**
     * getLocationSpecs creates a map of app component files, and where they will be deposited once wrapped in their decorators:
     * @param location location of item in file/folder system
     * @param parentDest location of parent folder in file system
     * @return {Object} contains source location, destination location, file/folder name, and children of folder
     */
    const getLocationSpecs = (location, parentDest) => {
        Logger.debug('getLocationSpecs');
        const name = getItemName(location);
        const src = location;
        // Create each destination path
        const dest = `${parentDest}/${name}`;
        let children = null;
        if(name.indexOf('.') === -1) {
            // If we've reached a directory and not a file, assimilate its children:
            const childrenNames = fs.readdirSync(location);
            Logger.debug({childrenNames})
            children = childrenNames.map((childName) => {
                const childSrc = `${src}/${childName}`;
                Logger.debug({childSrc, dest});
                const childrenSpec = getLocationSpecs(childSrc, dest);
                return childrenSpec;
            });
        }
        const locationSpecs = {
            dest,
            name,
            src,
            children
        };
        return locationSpecs;
    };

    /**
     * getConversionFunction determines if the wrapper file being copied has a corresponding app controller file, and inserts the app controller file inside the wrapper, if so.
     * @param {string} src the source of the wrapper file
     * @param {string} dest destination directory where the wrapper and controller component function will be combined
     * @param {string} controllerContents string of the function which will be inserted into the wrapper
     */
    const getConversionFunction = (replaceToken, controllerContents) => {
        Logger.debug('getConversionFunction');
        return {
            process: (contents) => contents.replace(replaceToken, controllerContents)
        };
    };


    /////////////////////////////////////
    //         end wrap functions      //
    /////////////////////////////////////

    const getFilenames = (path) => {
        return new Promise((resolve, reject) => {
            Logger.debug('getFilenames starts');
            fs.readdir(path, function(error, filenames) {
                if(error) {
                    Logger.debug('getFilenames failed', {error});
                    return reject(error);
                }
                Logger.debug('getFilenames concluded', {filenames});
                resolve(filenames);
            });
        })
    };

    const getFilenameVarMap = (filenames) => {
        return filenames.map((filename) => {
            const clippedName = (filename.indexOf('.') > -1) ? filename.substring(0, filename.indexOf('.')) : filename;
            return {
                varName: camelCase(clippedName),
                filename
            };
        });
    };

    const getReadFilePromise = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error, data) => {
                if(error) {
                    Logger.error('readFilePromise', {error});
                    return reject(error);
                }
                resolve(data);
            });
        });
    };

    const createUtilitiesIndexes = () => {

        Logger.debug('---------------------------------------');
        Logger.debug('Commencing utility index creation');
        const path = settings.controllersTemp;
        return getFilenames(path)
            .then((controllersNames) => {
                // For each controller:
                return controllersNames.map((controllersName) => {
                    // Grab filenames for each controller's utilities:
                    const utilitiesPath = `${path}/${controllersName}/utilities`;
                    return getFilenames(utilitiesPath)
                    // Convert filenames into var names:
                        .then(getFilenameVarMap)
                        // Create a string that will import and assimilate each utility file into the utilities object:
                        .then((fileVarMap) => {
                            let instantiationString = `
const utilityInits = {};\n
const utilitiesInit = function(globals, routes) {
    const utilityWrap = function(utilities, utilityName) {
          utilities[utilityName] = utilityInits[utilityName].call(this, globals);
          return utilities;
    }.bind(this)
    return Object.keys(utilityInits).reduce(utilityWrap, {});
};
`;
                            instantiationString += fileVarMap.reduce((instantiationString, fileVars) => {
                                instantiationString += `
import ${fileVars.varName} from './${fileVars.filename}';
utilityInits.${fileVars.varName} = ${fileVars.varName};
                                `;
                                return instantiationString;
                            }, '');
                            instantiationString += '\n\nexport default utilitiesInit';
                            return instantiationString;
                        })
                        .then((fileString) => {
                            const path = `${utilitiesPath}/index.js`;
                            writeFile(path, fileString);
                        });
                })

            });
    };

    const getFileString = (controllerSpecs) => {
        Logger.debug('getFileString',controllerSpecs);
        const fileString = ` 
/*
 * This file is automatically generated.  Do not edit it directly.
 * To create a new index.js, run \`node assemble\` in the root folder.
*/

import globalUtilitiesSingleton from './utilities';
import appSettings from './app_settings';

const routes = {}; 
const globals = {};
globals.settings = appSettings;
globals.state = {}; 
globals.utilities = globalUtilitiesSingleton(globals, routes);
globals.controllers = {};
let controllerKey;
${getControllerInstantiationString(controllerSpecs)}
Object.assign(routes, globals.utilities.getRoutes(globals.controllers));
globals.controllers.default = globals.utilities.getDefaultController(globals.controllers);
if(!globals.controllers.default) {
    globals.utilities.makeError('index.js', 'getFileString', 'No default controller was indicated.');
}

// Start the machine:
globals.utilities.appInit(routes);
(routes[globals.utilities.getRoute()] || globals.controllers.default).wake();
    `;

        return fileString;
    };

    /**
     * getControllerInstantiationString composes a string, which when inserted in a file and executed, inits a series of controllers
     * @param controllerSpecs
     * @return {*}
     */
    const getControllerInstantiationString = (controllerSpecs) => {
        const controllerInstantiationString = controllerSpecs.reduce((controllerInstantiationString, controllerSpec) => {
            controllerInstantiationString += `
import ${controllerSpec.varName}Init from './${settings.controllersDirName}/${controllerSpec.filename}';
const ${controllerSpec.varName} = ${controllerSpec.varName}Init(globals);
controllerKey = ${controllerSpec.varName}.settings.key || '${controllerSpec.varName}';
globals.controllers[controllerKey] = ${controllerSpec.varName};
            `;
            return controllerInstantiationString;
        }, '');
        Logger.debug('getControllerInstantiationString',controllerInstantiationString);
        return controllerInstantiationString;
    };

    const writeFile = (dest, fileString) => {
        return new Promise((resolve, reject) => {
            Logger.debug('writeFile', dest);
            fs.writeFile(dest, fileString, function(err) {
                if(err) {
                    reject(err);
                }
                Logger.debug('writeFile completed');
                resolve();
            });

        })
    };

    // User `grunt --file=product` (as an example) to just build the product.js file.
    grunt.registerTask('build', () => {
        const dest = `${settings.distPath}/${settings.distFileName}.js`;
        const src = `${settings.tempBuildDest}/index.js`;
        const fileList = {
            [dest]: src
        };
        Logger.debug({dest, src});
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            browserify: {
                dist: {
                    files: fileList,
                    options: {
                        transform: [["babelify", { "presets": ["es2015"] }]],
                        watch: true
                    }
                },
                options: {
                    postBundleCB: (err, src, next) => {
                        // grunt.file.delete(settings.tempBuildDest);
                        next(err, src);
                    }
                }
            }
        });
        grunt.task.run('browserify');
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['assemble']);
};
