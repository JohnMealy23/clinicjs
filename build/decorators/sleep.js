const sleepDecorator = (globals, appSleep) => {
    const sleep = function() {
        if(this.state.awake === false) {
            return false;
        }
        const sleepReturn = appSleep.call(this, ...arguments);
        this.state.awake = false;
        if(this.elems.body) {
            this.elems.body.classList.add(globals.settings.cssClasses.hidden);
        }
        return sleepReturn;
    };
    return sleep;
};

export default sleepDecorator;