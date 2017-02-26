# Work in Progress
Please note that this project is still under development.  Tweaks will be constant.  Please feel free to ask questions, make recommentations, and submit pull requests.  Thanks much!

# Clinic JS
## Overview
This is a moderately opinionated framework, designed to get the client-side application up and running quickly, and in a structured-yet-not-restrictive fashion.

At minimum, the developer only needs to populate standardized functions in the `/app/controllers/` directory with the following command...
 
```
grunt newcontroller --name={controllers_name}
```
... and write the corresponding HTML in the index.html file.  

The app developer will then need to run...
```
grunt assemble
``` 
... in the root, and a client-side script file will be produced.

A deeper understanding of build processes is never a bad thing.  This being said, this framework allows a developer to know little of what's going on under the hood to get up and running.  Create controllers, assemble the project, and check it in the browser.
 
## Project Structure
The app developer need only attend to the files in the ./app directory.  These files include...

### Settings File
The ./app/app_settings.js file's purpose is to abstract business-specific data from the application. API addresses, application name and so on should be stored in this.

### Utilities
For the time being, this file contains an object literal of all functions that will need to be shared across controllers.

### Controllers
Each controller is located in the /app/controllers directory.  Each controller is represented by a directory with the controller's name, containing a conglomerate of standardized files.  At assemble time, these files produce the functionality with which other controllers can manipulate your controller.

When accessing a controller, the following API will be present:

* `init()`: Will only be run once per controller.  Collects required DOM nodes, and prepares the controllers dependencies.
* `sleep()`: De-activates a controller. Should be used to release unneeded objects from memory, and remove the controller's view components from the GUI, if necessary.
* `wake()`: Activates the controller.  Puts it into view automatically, if a controller's body ID was specific in the controller's settings.js file.
  * Returns a promise. Any returned value will be piped to the `then()`.
* `settings`: Object literal, containing the local settings for the controller.
    * `key`: A string lacking spaces and special characters, with which the controller will be accessed in the `controllers` object in other controllers.
    * `isDefault`: A boolean value indicating the controller that will serve when an unidentified route is provided by the URL. Should only be true for one controller.
    * `route`: If the controller is a top-level controller, input the URL path for it here.  Example:
        * `myController.route` = 'myroute' will be accessed by mysite.com/myroute.
    * `elementIds`: A shallow object literal. Each key will become a key in the contoller's

### Creating a Controller
To create a new controller, navigate to the root directory in your terminal, and input:
```
grunt newcontroller --name={controllers_name}
```
 This will produce a new directory in the ./app/controllers directory.  Inside this directory are the skeleton files for everything the controller will need to function.  

The wake, sleep and init files all contain an anonymous function.  This can be populated by the app developer with all of the necessary functionality.  Within this anonymous function, the app developer has access to call the following objects:

#### this 
A reference to the controller and its components.
* `this.elems` - An object literal map of each element created from the settings.elementIds object
* `this.settings` - The controller's settings object
* `this.init()` - The controller's init method.  Can only be called once, and will automatically be called, if the wake method is called before the init method.
  * Turns this.state.initted to true.
* `this.wake()` - The method to turn on the controller.  Largely made up of the code the app developer has created.
  * If this.elems.body exists, will remove the .hidden class
  * If controller is not yet init, will run this.init()
  * Turns this.state.awake to true
  * Returns a resolved promise, unless the init or app developer's wake returns an unresolved promise
  * Value conveyed to the resolve is that which the app developer returns from their wake method
* `this.sleep()` - The method to turn off the controller.
  * If this.elems.body exists, will add the .hidden class
  * Turns this.state.awake to false
  * Returns false if already asleep
  * Returns
* `this.utilities` - An object literal, containing the content's of the controller's /utilities/ directory.
* `this.state` - The private state object of this controller
* `this.state.awake` - Turns to true when controller is awake, and false when asleep
* `this.state.initted` = Is false until controller is initted, then turns to true

#### globalSettings
Contents of the ./app/app_settings.js JSON

#### controllers 
An object literal of all controllers.  Each key is a camel-cased version of your controller's directory name.  

For instance, if you have created a controller at ./app/controllers/basic_questions, access its wake function from any controller with `controllers.basicQuestions.wake()`

#### globalUtilities 
Contents of the ./app/utilities file

#### Example Controller Files
By running...
```
grunt newcontroller --name=hello_there
```
and
```
grunt newcontroller --name=goodbye_now
```
you will find that your ./app/controllers folder now has two directories within it - hello_there and goodbye_now.
 
Each of these directories has the following contents:
* utilities/
  * proto_utility.js
* index.js
* init.js
* settings.js
* sleep.js
* wake.js
 
Begin by opening the settings.js files, and filling in some required data.
