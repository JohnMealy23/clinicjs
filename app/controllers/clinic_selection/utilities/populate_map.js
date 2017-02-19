((clinics) => {
    const createMapMarkers = clinics.map(addMarkerWithTimeout);
    return Promise.all(createMapMarkers);
});

const addMarkerWithTimeout = () => {
    const interval = 100;
    // Start it at one less interval than zero, so the first timeout is zero
    let timeout = 0 - interval;
    return (clinic) => {
        timeout = timeout + interval;
        return new Promise((resolve) => {
            window.setTimeout(() => {
                const marker = new winodw.google.maps.Marker({
                    title: clinic.name,
                    position: clinic.location,
                    animation: google.maps.Animation.DROP,
                    map,
                });
                resolve(marker);
            }, timeout);
        });
    }
};
