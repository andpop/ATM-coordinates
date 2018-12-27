import sourceAtmAddresses from '../data/atm_adresses';
// require("babel-core/register");
// require("babel-polyfill");

ymaps.ready(init);

// function getCoordsForAtm(atm, index) {
//     return new Promise((resolve, reject) => {
//         ymaps.geocode(`${atm.city},${atm.address}`)
//             .then(res => {
//                 let atmWithCoords = {},
//                     firstGeoObject = res.geoObjects.get(0),
//                     coords = firstGeoObject.geometry.getCoordinates(),
//                     address = firstGeoObject.getAddressLine();
//
//                 atmWithCoords.id = atm.ID;
//                 atmWithCoords.address = atm.address;
//                 atmWithCoords.place = atm.place;
//                 atmWithCoords.category = atm.category;
//                 atmWithCoords.normalAddress = address;
//                 atmWithCoords.latitude = coords[0];
//                 atmWithCoords.longitude = coords[1];
//
//                 resolve(atmWithCoords);
//             })
//             .catch(err => {
//                 console.error(`${index}: ${atm.full_address}: ${err}`);
//                 reject(`${index}: ${atm.full_address}: ${err}`);
//             });
//     });
// }

async function getCoordsForAtm(atm, index) {
    try {
        let res = await ymaps.geocode(`${atm.city},${atm.address}`);
        let atmWithCoords = {},
            firstGeoObject = res.geoObjects.get(0),
            coords = firstGeoObject.geometry.getCoordinates(),
            address = firstGeoObject.getAddressLine();

        atmWithCoords.id = atm.ID;
        atmWithCoords.address = atm.address;
        atmWithCoords.place = atm.place;
        atmWithCoords.category = atm.category;
        atmWithCoords.normalAddress = address;
        atmWithCoords.latitude = coords[0];
        atmWithCoords.longitude = coords[1];

        return atmWithCoords;
    } catch (err) {
        console.error(`${index}: ${atm.full_address}: ${err}`);
        // reject(`${index}: ${atm.full_address}: ${err}`);
    }
}


// Вставка в DOM списка <li> с адресами и координатами
function makeAtmLi(atmList) {
    let atmLi = '';
    atmList.forEach(atm => {
        console.log(atm);
        console.log(atm["normalAddress"]);
        atmLi += `<li>${atm.id};${atm.normalAddress};${atm.latitude};${atm.longitude}</li>`;
    });

    return atmLi;
}

//===============================================================================
function init() {
    let atmList = document.getElementById('atm_list');

    let myMap = new ymaps.Map('map', {
        center: [54.17523457, 45.18074950], // Саранск
        zoom: 16,
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

    // getCoordsForAtm(sourceAtmAddresses[0], 0)
    //     .then(atm => {
    //         console.log(atm.latitude, atm.longitude, atm.address);
    //         return getCoordsForAtm(sourceAtmAddresses[1], 1);
    //         })
    //     .then(atm => {
    //             console.log(atm.latitude, atm.longitude, atm.address);
    //             return getCoordsForAtm(sourceAtmAddresses[2], 2);
    //         })
    //     .then(atm => {
    //             console.log(atm.latitude, atm.longitude, atm.address);
    //             return getCoordsForAtm(sourceAtmAddresses[3], 3);
    //         })
    //     .catch(error => console.log(error));

    let atmPromiseArray = [];

    sourceAtmAddresses.forEach((atm, index) => {
        atmPromiseArray.push(getCoordsForAtm(atm, index));
    });


    Promise.all(atmPromiseArray)
        .then(targetAtmList => {
            console.log(targetAtmList);
            atmList.innerHTML = makeAtmLi(targetAtmList);
        });


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
