const getWake = (globalSettings, state, controllers, globalUtilities) => {
    const appWake = /**
     this // The controller
     globalSettings // Application Settings
     controllers // Access to other controllers
     globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
 */

(function(/* Your args here */) {

    this.elems.body.classList.remove(globalSettings.cssClasses.hidden);
    globalUtilities.sleepAllExcept(name);

    if(!this.state.zip || !this.state.destination) {
        // If the state does contaier the to and from, yet, attempt to grab them from the URL
        let qParts = utilities.g.getQStringObj();
        this.state.zip = qParts.zip;
        this.state.destination = qParts.destination;
    }

    if(!this.directionsIframe) {
        this.directionsIframe = createDirectionsIframe();
    }

});

const createDirectionsIframe = (origin, destination) => {
    const escapedOrigin = utilities.g.escapeSpaces(origin);
    const escapedDestination = utilities.g.escapeSpaces(destination);
    const iframe = document.createElement('iframe');
    iframe.width = 600;
    iframe.height = 450;
    iframe.frameborder = 0;
    iframe.style.border = 0;
    iframe.allowfullscreen = true;
    iframe.src = `${$settings.maps.directionsEndpoint}?key=${$settings.maps.key}&origin=${escapedOrigin}&destination=${escapedDestination}`;
    return iframe;
};;

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
