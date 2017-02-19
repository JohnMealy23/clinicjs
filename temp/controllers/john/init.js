const getInit = (globalSettings, state, controllers, globalUtilities) => {

    /** Enter Init Code Here */
    const appInit = /*

 Within the following function, the app developer has access to the following objects:

# this
`this.elems` - An object literal map of each element created from the settings.elementIds object
`this.settings` - The controller's settings object
`this.init` - The controller's init method.  Can only be called once, and will automatically be called, if the wake method is called before the init method.
     Turns this.state.initted to true.
`this.wake` - The method to turn on the controller.  Largely made up of the code the app developer has created.
     If this.elems.body exists, will remove the .hidden class
     If controller is not yet init, will run this.init()
     Turns this.state.awake to true
     Returns a resolved promise, unless the init or app developer's wake returns an unresolved promise
     Value conveyed to the resolve is that which the app developer returns from their wake method
`this.sleep` - The method to turn off the controller.
     If this.elems.body exists, will add the .hidden class
     Turns this.state.awake to false
     Returns false if already asleep
`this.utilities` - An object literal, containing the content's of the controller's /utilities/ directory.
`this.state` - The private state object of this controller
`this.state.awake` - Turns to true when controller is awake, and false when asleep
`this.state.initted` - Is false until controller is initted, then turns to true

 # globalSettings
 Contents of the ./app/app_settings.js JSON

 # controllers
 An object literal of all controllers.  Each key is a camel-cased version of your controller's directory name.

 For instance, if you have created a controller at ./app/controllers/basic_questions, access its wake function from any controller with `controllers.basicQuestions.wake()`

 # globalUtilities
 Contents of the ./app/utilities file
 */

(function(/* Your args here */) {



});;

    const init = initDecorator(globalSettings, state, controllers, globalUtilities, appInit);
    return init;
};

/**
 * In the function returned by initDecorator, we place anything that will be universal to the init step of controllers
 * @param globalSettings
 * @param controllers
 * @param globalUtilities
 * @param appInit
 * @returns {function()}
 */

const initDecorator = (globalSettings, state, controllers, globalUtilities, appInit) => {
    const init = function() {
        // Gather elements for this controller
        this.elems = globalUtilities.getElems(this.settings.elementIds);
        this.state.initted = true;

        // Since some init processes will need to return promises,
        // all init processes will return promises, so that we
        // can be consistent in how wake deals with init.
        return Promise.resolve(appInit.call(this, ...arguments));
    };
    return init;
};

export default getInit;