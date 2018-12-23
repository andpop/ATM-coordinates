import sourceAtmAddresses from '../data/atm_adresses';

ymaps.ready(init);

function addCoordsToAtm(atm, index) {
    let atmWithCoords = {};

    atmWithCoords.id = atm.ID;
    atmWithCoords.address = atm.address;
    atmWithCoords.place = atm.place;
    atmWithCoords.category = atm.category;
    ymaps.geocode(`${atm.city},${atm.address}`)
        .then(res => {
            let firstGeoObject = res.geoObjects.get(0),
                coords = firstGeoObject.geometry.getCoordinates(),
                address = firstGeoObject.getAddressLine();

            atmWithCoords.normalAddress = address;
            atmWithCoords.latitude = coords[0];
            atmWithCoords.longitude = coords[1];
        })
        .catch(err => console.error(`${index}: ${atm.full_address}: ${err}`));

    return atmWithCoords;
}

function makeAtmLi(atmList) {
    let atmLi = '';
    atmList.forEach(atm => {
        console.log(atm);
        console.log(atm["normalAddress"]);
        atmLi += `<li>${atm.id};${atm.normalAddress};${atm.latitude};${atm.longitude}</li>`;
    });

    return atmLi;
}

function init () {
    let atmList = document.getElementById('atm_list');

    // =========================================================================
    let myMap = new ymaps.Map('map', {
        center   : [54.17523457, 45.18074950], // Саранск
        zoom     : 16,
        behaviors: ['drag']
    });
    myMap.controls.add('zoomControl');
    let clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedDarkOrangeClusterIcons',
        openBalloonOnClick: true,
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterHideIconOnBalloonOpen: false,
        // Устанавливаем для балуна кластера стандартный макет типа "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        // clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна.
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
    });
    myMap.geoObjects.add(clusterer);

    let targetAtmList = sourceAtmAddresses.map((atm, index) => addCoordsToAtm(atm, index));
    // console.log("target=", targetAtmList);
    atmList.innerHTML = makeAtmLi(targetAtmList);

    // ymaps.geocode('Саранск, ул. Степана Разина,17, Регистрационная палата')
    // ymaps.geocode('Саранск, ул. Степана Разина,17, Регистрационная палата')
    //     .then(res => {
    //         let firstGeoObject = res.geoObjects.get(0),
    //             coords = firstGeoObject.geometry.getCoordinates(),
    //             address = firstGeoObject.getAddressLine();
    //
    //         let placemark = new ymaps.Placemark(coords, {
    //             balloonContentHeader: `${address}`,
    //             // balloonContentBody: text,
    //             // balloonContentFooter: date,
    //             hintContent: `12345`
    //         }, {
    //             preset: 'islands#redIcon',
    //             iconColor: '#df6543',
    //             openBalloonOnClick: false
    //         });
    //         clusterer.add(placemark);
    //     })
    //     .catch(err => console.error(err));

}
