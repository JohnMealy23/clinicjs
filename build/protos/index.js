import getInit from './init';
import getWake from './wake';
import getSleep from './sleep';
import settings from './settings';
import getUtilities from './utilities';

const controllerInit = (globalSettings, state, controllers, globalUtilities) => {
    const controller = {};
    controller.elems = null; // Will be populated by the init step.
    controller.settings = settings;
    controller.init = getInit(globalSettings, state, controllers, globalUtilities);
    controller.wake = getWake(globalSettings, state, controllers, globalUtilities);
    controller.sleep = getSleep(globalSettings, state, controllers, globalUtilities);
    controller.utilities = getUtilities.call(controller, globalSettings, state, controllers, globalUtilities);

    controller.default = settings.isDefault || false;

    controller.state = {};
    controller.state.awake = false;
    controller.state.initted = false;

    return controller;
};

export default controllerInit;
