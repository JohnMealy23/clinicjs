const getWake = (globalSettings, state, controllers, globalUtilities) => {
    const appWake = /**
     this // The controller
     globalSettings // Application Settings
     controllers // Access to other controllers
     globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
 */


(function(response) {
    if(response === undefined) {
        // If user has arrived here without a server response, it's probably because they pasted the URL into their address bar.
        // This being the case, push them back to the userStatus acquisition phase.
        controllers.basicQuestions.wake()
            .then(this.sleep);
        return;
    }

    history.replaceState({}, this.settings.title, this.settings.route);

    this.utilities.populateMap(clinic);

});;

    const wake = wakeDecorator(globalSettings, state, controllers, globalUtilities, appWake);
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
const wakeDecorator = (globalSettings, state, controllers, globalUtilities, appWake) => {
    const wake = function() {
        const coreFn = () => {
            if(this.elems.body) {
                this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
            }
            if(this.settings.title && this.settings.route) {
                console.warn("TODO: Turn on page history");
                // history.pushState(state, `${globalSettings.appName} - ${this.settings.title}`, this.settings.route);
            }
            return appWake.call(this, ...arguments);
        };
        // Init the first time wake is run:
        if(this.state.initted !== true) {
            this.state.initted = true;
            return this.init().then(() => {
                return coreFn(...arguments);
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
