const getInit = (globals) => {

    /** Enter Init Code Here */
    const appInit = ()=>{}/* replace me */;

    const init = initDecorator(globals, appInit);
    return init;
};

/**
 * In the function returned by initDecorator, we place anything that will be universal to the init step of controllers
 * @param globals.settings
 * @param globals.controllers
 * @param globals.utilities
 * @param appInit
 * @returns {function()}
 */

const initDecorator = (globals, appInit) => {
    const init = function() {
        // Gather elements for this controller
        this.elems = globals.utilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call(this, ...arguments));
    };
    return init;
};

export default getInit;