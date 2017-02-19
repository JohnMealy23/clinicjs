/**
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

});