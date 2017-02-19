/**
    this // The controller
    globalSettings // Application Settings
    globalState // Access to the state of other controllers
    controllers // Access to other controllers
    globalUtilities // Utilities offered by clinic.js, as well as those universally introduced by the app developer
 */

(function(/* Your args here */) {

    this.elems.submitButton.addEventListener('click', () => {
        const trimester = this.elems.trimester.value;
        const age = this.elems.age.value;
        const zip = this.elems.zip.value;
        if(!trimester || !age || !zip) {
            alert('Please make sure to complete the form.');
            return;
        } else if(isNaN(age)) {
            alert('Please enter a valid age.');
            return;
        } else if(isNaN(zip) || zip.length !== 5) {
            alert('Please enter a valid zip code.');
            return;
        }
        const userStatus = {
            trimester,
            age,
            zip
        };
        state.userStatus = userStatus;
        const url = globalUtilities.getApiEndpoint('clinicOptions');
        globalUtilities.ajax({url, userStatus})
            .then((response) => {
                return controllers.clinicSelection.wake(response);
            })
            .then(() => {
                this.sleep();
            });
    });

});