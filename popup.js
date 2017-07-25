var apiKey = "e9e260718f3e80217b7d67cc20cd05a27019862c";

// chrome.browserAction.setBadgeText({text: data.available_bikes.toString()});

function displayInfos(data) {
    var title = document.createElement('h2');
    title.innerHTML = data.name;

    var available = data.available_bikes;
    var sentence;
    if (available == 0) {
        sentence = "Aucun vélo disponible";
    } else if (available == 1) {
        sentence = available + " vélo disponible";
    } else {
        sentence = available + " vélos disponibles";
    }
    var bikes = document.createElement('p');
    bikes.innerHTML = sentence;

    var standsAvailable = data.available_bike_stands;
    var sentence2;
    if (standsAvailable == 0) {
        sentence2 = "Aucune place disponible";
    } else if (standsAvailable == 1) {
        sentence2 = standsAvailable + " place disponible";
    } else {
        sentence2 = standsAvailable + " places disponibles";
    }
    var stands = document.createElement('p');
    stands.innerHTML = sentence2;

    var element = document.createElement('div');
    element.className = "station";
    element.appendChild(title);
    element.appendChild(bikes);
    element.appendChild(stands);
    document.getElementById('stations').append(element);
}

function getStationInfos(stationId) {
    var url = "https://api.jcdecaux.com/vls/v1/stations/"+stationId+"?contract=nantes&apiKey="+apiKey;
    console.log('url', url);
    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.responseType = 'json';
    x.onload = function() {
        var response = x.response;
        if (!response) {
            return;
        }
        console.log(response);
        displayInfos(response);
    };
    x.onerror = function() {
        console.error(x.response);
    };
    x.send();
}

document.addEventListener('DOMContentLoaded', function() {
    getStationInfos(17);
    getStationInfos(8);
    getStationInfos(7);
});
