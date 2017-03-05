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
        if(this.elems.body) {
            this.elems.body.classList.remove(globals.settings.cssClasses.hidden);
        }
        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        const initReturn = appInit.call(this, ...arguments);
        // Only mark this as initted once the app's init function has gone through.
        // This way, if an error is thrown while initting, the initted flag won't be turned to true:
        this.state.initted = true;
        return Promise.resolve(initReturn);
    };
    return init;
};

export default initDecorator;