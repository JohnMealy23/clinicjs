const getSleep = (globalSettings, state, controllers, globalUtilities) => {
    const appSleep = /**
    this // The controller
    globalSettings // Application Settings
    globalState // Access to the state of other controllers
    controllers // Access to other controllers
    globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
 */

(function(/* Your args here */) {

    this.elems.body.classList.add(globalSettings.cssClasses.hidden);

});;

    const sleep = sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep);
    return sleep;
};

const sleepDecorator = (globalSettings, state, controllers, globalUtilities, appSleep) => {
    const sleep = function() {
        if(this.state.awake === false) {
            return false;
        }
        this.state.awake = false;
        if(this.elems.body) {
            this.elems.body.classList.add(globalSettings.cssClasses.hidden);
        }
        return appSleep(...arguments);
    };
    return sleep;
};

export default getSleep;