const getInit = (globalSettings, state, controllers, globalUtilities) => {

    /** Enter Init Code Here */
    const appInit = /**
    this // The controller
    globalSettings // Application Settings
    globalState // Access to the state of other controllers
    controllers // Access to other controllers
    globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
 */

(function(/* Your args here */) {

});;

    const init = initDecorator(globalSettings, state, controllers, globalUtilities, appInit);
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

const initDecorator = (globalSettings, state, controllers, globalUtilities, appInit) => {
    const init = function() {
        // Gather elements for this controller
        this.elems = globalUtilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call(this, ...arguments));
    };
    return init;
};

export default getInit;