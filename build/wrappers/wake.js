const getWake = (globals) => {
    const appWake = ()=>{}/* replace me */;

    const wake = wakeDecorator(globals, appWake);
    return wake;
};

/**
 * In the function returned by wakeDecorator, we place anything that will be universal to the wake step of controllers
 * @param globals.settings
 * @param globals.controllers
 * @param globals.utilities
 * @param appWake
 * @return Promise resolving with the result of the appWake function
 */
const wakeDecorator = (globals, appWake) => {
    const wake = function() {
        const coreFn = function() {
            const wakeReturn = appWake.call(this, ...arguments);
            if(this.elems.body) {
                this.elems.body.classList.remove(globals.settings.cssClasses.hidden);
            }
            if(this.settings.title && this.settings.route) {
                // history.pushState(state, `${globals.settings.appName} - ${this.settings.title}`, this.settings.route);
            }
            this.state.awake = true;
            return wakeReturn;
        }.bind(this, ...arguments);
        // Init the first time wake is run:
        if(this.state.initted !== true) {
            return this.init()
                .then(() => {
                    return coreFn();
                })
                .catch((error) => {
                    const logObj = {
                        file: `${this.settings.key}: wake.js`,
                        function: 'wake',
                        message: 'Failed to wake.',
                        error
                    };
                    globals.utilities.log(logObj);
                });
        } else {
            // Since init always returns a promise, wake will always return a promise
            // Show body of controller, if exists
            return Promise.resolve(coreFn(...arguments));
        }
    }
    return wake;
};

export default getWake;
