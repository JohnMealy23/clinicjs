import getInit from './init';
import getWake from './wake';
import getSleep from './sleep';
import getUpdate from './update';
import settings from './settings';
import getUtilities from './utilities';

const controllerInit = (globals) => {
    const controller = {};
    controller.elems = null; // Will be populated by the init step.
    controller.settings = settings;
    controller.init = getInit(globals);
    controller.wake = getWake(globals);
    controller.update = getUpdate(globals);
    controller.sleep = getSleep(globals);
    controller.utilities = getUtilities.call(controller, globals);

    controller.default = settings.isDefault || false;

    controller.state = {};
    controller.state.awake = false;
    controller.state.initted = false;

    return controller;
};

export default controllerInit;
