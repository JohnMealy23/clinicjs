const getSleep = (globalSettings, state, controllers, globalUtilities) => {
    const appSleep = ()=>{}/* replace me */;

    const sleep = sleepDecorator(globalSettings, state, controllers, globalUtilities, appSleep);
    return sleep;
};

const sleepDecorator = (globalSettings, state, controllers, globalUtilities, appSleep) => {
    const sleep = function() {
        if(this.state.awake === false) {
            return false;
        }
        const sleepReturn = appSleep.call(this, ...arguments);
        this.state.awake = false;
        if(this.elems.body) {
            this.elems.body.classList.add(globalSettings.cssClasses.hidden);
        }
        return sleepReturn;
    };
    return sleep;
};

export default getSleep;