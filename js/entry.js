ymaps.ready(init);

function init () {

    // =========================================================================
    let myMap = new ymaps.Map('map', {
        center   : [54.17523457, 45.18074950], // Саранск
        zoom     : 16,
        behaviors: ['drag']
    });
    myMap.controls.add('zoomControl');

    ymaps.geocode('Саранск, ул. Степана Разина,17, Регистрационная палата')
        .then(res => {
            let firstGeoObject = res.geoObjects.get(0),
                coords = firstGeoObject.geometry.getCoordinates(),
                address = firstGeoObject.getAddressLine();

            console.log(coords);
            console.log(address);
            // currentReview.coords = coords;
            // currentReview.address = res.geoObjects.get(0).getAddressLine();
            // showForm(position, currentReview.address);
        })
        .catch(err => console.error(err));

}
