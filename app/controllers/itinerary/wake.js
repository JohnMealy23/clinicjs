/**
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
};