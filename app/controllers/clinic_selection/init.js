/**
    this // The controller
    globalSettings // Application Settings
    globalState // Access to the state of other controllers
    controllers // Access to other controllers
    globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
 */

(function(/* Your args here */) {

    // Attach click listener for nav toggle:
    this.elems.collapseButton.addEventListener('click', this.utilities.collapse());

    // Create map for clinic search results:
    state.map = new google.maps.Map(localState.elems.mapContainer, {
        zoom: 4,
        // center: userLocation
    });

});