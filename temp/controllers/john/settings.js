const settings = {};

settings.key = ''; // How other controllers will refer to this controller in the `controllers` object.
settings.title = ''; // Will display as page title if this controller has a route.

settings.isDefault = false; // True for the controller which will wake if no route match occurs.
settings.route = ''; // If this string matches a segment of the URL, this controller will wake.

/**
    Each index of this object will automatically be added to the controller.elems object.
    The key of that object will be the key of the key of the `settings.elementIds` object,
    and the value will be the node with the ID matching the string value.
    Example:
        The object `settings.elementIds = { what: 'the-heck' }`
        will result in `this.elems.what.nodeName === 'DIV' && this.elems.what.id === 'the-heck'`
        after the controller inits.
        Be sure your HTML contains the element with the matching ID.
 */
settings.elementIds = {};
settings.elementIds.body = false; // If this controller has a top-level div that should be displayed upon wake, add it's ID here.

export default settings;
